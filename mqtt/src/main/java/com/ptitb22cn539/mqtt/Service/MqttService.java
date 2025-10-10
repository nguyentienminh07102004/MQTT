package com.ptitb22cn539.mqtt.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ptitb22cn539.mqtt.Configuration.AppConstants;
import com.ptitb22cn539.mqtt.Configuration.Enum.DeviceStatus;
import com.ptitb22cn539.mqtt.DTO.ControlDeviceRequest;
import com.ptitb22cn539.mqtt.DTO.ControlDeviceResponse;
import com.ptitb22cn539.mqtt.DTO.DataHistorySearchRequest;
import com.ptitb22cn539.mqtt.DTO.DeviceSensorSearchRequest;
import com.ptitb22cn539.mqtt.Entity.DeviceHistoryEntity;
import com.ptitb22cn539.mqtt.Entity.DeviceSensorEntity;
import com.ptitb22cn539.mqtt.Repository.IDeviceHistoryRepository;
import com.ptitb22cn539.mqtt.Repository.IDeviceSensorRepository;
import jakarta.annotation.PostConstruct;
import jakarta.persistence.criteria.Predicate;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.IMqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.util.Pair;
import org.springframework.data.web.PagedModel;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class MqttService {
    IMqttClient mqttClient;
    IDeviceHistoryRepository deviceHistoryRepository;
    IDeviceSensorRepository deviceSensorRepository;
    ObjectMapper objectMapper;
    Map<String, CompletableFuture<Void>> futures = new ConcurrentHashMap<>();
    @Value("${mqtt.qos}")
    @NonFinal
    private int qos;

    @PostConstruct
    public void handleControlDevice() throws MqttException {
        this.mqttClient.subscribe("control-device", qos, (topic, message) -> {
            ControlDeviceResponse controlDeviceResponse = this.objectMapper.readValue(message.getPayload(), ControlDeviceResponse.class);
            CompletableFuture<Void> future = this.futures.get(controlDeviceResponse.getId());
            if (future != null) {
                future.complete(null);
            }
        });
    }

    public CompletableFuture<Void> turnOnOffDevice(String deviceName, String status) throws Exception {
        String device = AppConstants.FAN;
        String topic = AppConstants.TOPIC_FAN;
        if (deviceName.equalsIgnoreCase(AppConstants.LED)) {
            device = AppConstants.LED;
            topic = AppConstants.TOPIC_LED;
        } else if (deviceName.equalsIgnoreCase(AppConstants.AIR_CONDITIONER)) {
            device = AppConstants.AIR_CONDITIONER;
            topic = AppConstants.TOPIC_AIR_CONDITIONER;
        }
        final String Device = device;
        if (!StringUtils.hasText(status)) status = DeviceStatus.on.getValue();
        DeviceStatus deviceStatus = DeviceStatus.valueOf(status.toLowerCase());
        String id = UUID.randomUUID().toString();
        ControlDeviceRequest request = new ControlDeviceRequest(id, deviceStatus);
        MqttMessage message = new MqttMessage(this.objectMapper.writeValueAsBytes(request));
        message.setQos(qos);
        CompletableFuture<Void> future = new CompletableFuture<>();
        futures.put(id, future);
        this.mqttClient.publish(topic, message);
        return future.whenComplete((Void, exception) -> {
            DeviceHistoryEntity deviceHistoryEntity = DeviceHistoryEntity.builder()
                    .deviceName(Device)
                    .status(deviceStatus)
                    .build();
            this.deviceHistoryRepository.save(deviceHistoryEntity);
        }).orTimeout(10, TimeUnit.SECONDS);
    }

    public PagedModel<DeviceHistoryEntity> getDeviceHistory(DataHistorySearchRequest dataHistorySearchRequest) {
        Integer page = dataHistorySearchRequest.getPage();
        if (page == null || page < 1) page = 1;
        Integer limit = dataHistorySearchRequest.getLimit();
        if (limit == null || limit < 1) limit = 10;
        if (!StringUtils.hasText(dataHistorySearchRequest.getSort())) {
            dataHistorySearchRequest.setSort("createdDate-desc");
        }
        String[] sorts = dataHistorySearchRequest.getSort().split("-");
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.valueOf(sorts[1].toUpperCase(Locale.ROOT)), sorts[0]));
        Specification<DeviceHistoryEntity> specification = (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();
            Pair<LocalDateTime, LocalDateTime> time = this.parseStringLocalDateTime(dataHistorySearchRequest.getDateTime());
            if (time != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.greaterThanOrEqualTo(root.get("createdDate"), time.getFirst()));
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.lessThanOrEqualTo(root.get("createdDate"), time.getSecond()));
            }
            if (StringUtils.hasText(dataHistorySearchRequest.getDeviceName())) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(criteriaBuilder.lower(root.get("deviceName")), dataHistorySearchRequest.getDeviceName().toLowerCase()));
            }
            if (dataHistorySearchRequest.getStatus() != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get("status"), dataHistorySearchRequest.getStatus().toString()));
            }
            return predicate;
        };

        Page<DeviceHistoryEntity> deviceHistoryEntityPage = this.deviceHistoryRepository.findAll(specification, pageable);
        return new PagedModel<>(deviceHistoryEntityPage);
    }

    public PagedModel<DeviceSensorEntity> searchDeviceSensor(DeviceSensorSearchRequest deviceSensorSearchRequest) {
        Integer page = deviceSensorSearchRequest.getPage();
        if (page == null || page < 1) page = 1;
        Integer limit = deviceSensorSearchRequest.getLimit();
        if (limit == null || limit < 1) limit = 10;
        if (!StringUtils.hasText(deviceSensorSearchRequest.getSort())) {
            deviceSensorSearchRequest.setSort("createdDate-desc");
        }
        String[] sorts = deviceSensorSearchRequest.getSort().split("-");
        Pageable pageable = PageRequest.of(page - 1, limit, Sort.by(Sort.Direction.valueOf(sorts[1].toUpperCase(Locale.ROOT)), sorts[0]));
        Specification<DeviceSensorEntity> specification = (root, query, criteriaBuilder) -> {
            Predicate predicate = criteriaBuilder.conjunction();
            Pair<LocalDateTime, LocalDateTime> time = this.parseStringLocalDateTime(deviceSensorSearchRequest.getDateTime());
            if (time != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.greaterThanOrEqualTo(root.get("createdDate"), time.getFirst()));
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.lessThanOrEqualTo(root.get("createdDate"), time.getSecond()));
            }
            if (StringUtils.hasText(deviceSensorSearchRequest.getType()) && deviceSensorSearchRequest.getValue() != null) {
                predicate = criteriaBuilder.and(predicate, criteriaBuilder.equal(root.get(deviceSensorSearchRequest.getType()), deviceSensorSearchRequest.getValue()));
            }
            return predicate;
        };
        Page<DeviceSensorEntity> deviceHistoryEntityPage = this.deviceSensorRepository.findAll(specification, pageable);
        return new PagedModel<>(deviceHistoryEntityPage);
    }

    private Pair<LocalDateTime, LocalDateTime> parseStringLocalDateTime(String dateTime) {
        if (!StringUtils.hasText(dateTime) || dateTime.length() < 10) {
            return null;
        }
        dateTime = dateTime.strip();
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        ChronoUnit plusUnit = ChronoUnit.SECONDS;
        if (dateTime.length() == 16) {
            dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            plusUnit = ChronoUnit.MINUTES;
        } else if (dateTime.length() == 13) {
            dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH");
            plusUnit = ChronoUnit.HOURS;
        } else if (dateTime.length() == 10) {
            dateTime += " 00:00:00";
            plusUnit = ChronoUnit.DAYS;
        }
        LocalDateTime startTime = LocalDateTime.parse(dateTime, dateTimeFormatter);
        LocalDateTime endTime = startTime.plus(1, plusUnit).minus(1, ChronoUnit.MICROS);
        return Pair.of(startTime, endTime);
    }

    public DeviceHistoryEntity getLastDeviceHistory(String deviceName) {
        return this.deviceHistoryRepository.findLatestByDeviceName(deviceName);
    }
}
