package com.ptitb22cn539.mqtt.Configuration;

import com.corundumstudio.socketio.SocketIOServer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ptitb22cn539.mqtt.DTO.DataHistoryRequest;
import com.ptitb22cn539.mqtt.DTO.DataSensorRequest;
import com.ptitb22cn539.mqtt.Entity.DeviceHistoryEntity;
import com.ptitb22cn539.mqtt.Entity.DeviceSensorEntity;
import com.ptitb22cn539.mqtt.Repository.IDeviceHistoryRepository;
import com.ptitb22cn539.mqtt.Repository.IDeviceSensorRepository;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.IMqttClient;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
@SuppressWarnings("unused")
public class MqttConfiguration {
    @Value("${mqtt.username}")
    private String username;
    @Value("${mqtt.password}")
    private String password;
    @Value("${mqtt.host}")
    private String host;
    @Value("${mqtt.port}")
    private String port;
    @Value("${mqtt.qos}")
    private int qos;

    @Bean
    public IMqttClient mqttClient(ObjectMapper objectMapper, IDeviceSensorRepository deviceSensorRepository, IDeviceHistoryRepository deviceHistoryRepository, SocketIOServer socketIOServer) throws MqttException {
        String publisherId = "java-server";
        String brokerUrl = "tcp://%s:%s".formatted(host, port);
        MqttConnectOptions options = new MqttConnectOptions();
        options.setAutomaticReconnect(true);
        options.setCleanSession(true);
        options.setConnectionTimeout(10);
        options.setUserName(username);
        options.setPassword(password.toCharArray());
        IMqttClient mqttClient = new MqttClient(brokerUrl, publisherId);
        try {
            mqttClient.connect(options);
            mqttClient.subscribe("topic/sendData", this.qos, (topic, message) -> {
                DataSensorRequest data = objectMapper.readValue(message.getPayload(), DataSensorRequest.class);
                DeviceSensorEntity dataSensor = DeviceSensorEntity.builder()
                        .temperature(data.getTemperature())
                        .brightness(data.getBrightness())
                        .humidity(data.getHumidity())
                        .build();
                deviceSensorRepository.save(dataSensor);
                socketIOServer.getBroadcastOperations().sendEvent("topic/sendData", dataSensor);
            });
            mqttClient.subscribe("setupDevice", this.qos, (topic, message) -> {
                DeviceHistoryEntity led = deviceHistoryRepository.findLatestByDeviceName(AppConstants.LED);
                DeviceHistoryEntity fan = deviceHistoryRepository.findLatestByDeviceName(AppConstants.FAN);
                DeviceHistoryEntity airConditioner = deviceHistoryRepository.findLatestByDeviceName(AppConstants.AIR_CONDITIONER);
                MqttMessage mqttMessage = new MqttMessage();
                mqttMessage.setQos(this.qos);
                mqttMessage.setPayload(objectMapper.writeValueAsBytes(DataHistoryRequest.builder()
                        .fan(fan.getStatus().getValue())
                        .air_conditioner(airConditioner.getStatus().getValue())
                        .led(led.getStatus().getValue())
                        .build()));
                mqttClient.publish("initDevice", mqttMessage);
            });
        } catch (MqttException e) {
            log.error("Failed to connect to MQTT broker: {}", e.getMessage(), e);
            throw e;
        }

        return mqttClient;
    }
}
