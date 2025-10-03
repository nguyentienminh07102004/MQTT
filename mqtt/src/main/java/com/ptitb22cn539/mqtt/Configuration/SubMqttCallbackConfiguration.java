package com.ptitb22cn539.mqtt.Configuration;

import com.corundumstudio.socketio.SocketIOServer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ptitb22cn539.mqtt.DTO.DataSensorRequest;
import com.ptitb22cn539.mqtt.Entity.DeviceSensorEntity;
import com.ptitb22cn539.mqtt.Repository.IDeviceSensorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.IMqttDeliveryToken;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
@SuppressWarnings("unused")
public class SubMqttCallbackConfiguration implements MqttCallback {

    private final ObjectMapper objectMapper;
    private final IDeviceSensorRepository deviceSensorRepository;
    private final SocketIOServer socketIOServer;

    @Override
    public void connectionLost(Throwable throwable) {
        log.error("MQTT connection lost: {}", throwable.getMessage(), throwable);
    }

    @Override
    public void messageArrived(String topic, MqttMessage mqttMessage) throws Exception {
        try {
            DataSensorRequest data = objectMapper.readValue(mqttMessage.getPayload(), DataSensorRequest.class);
            DeviceSensorEntity dataSensor = DeviceSensorEntity.builder()
                    .temperature(data.getTemperature())
                    .brightness(data.getBrightness())
                    .humidity(data.getHumidity())
                    .build();
            this.deviceSensorRepository.save(dataSensor);
            this.socketIOServer.getBroadcastOperations().sendEvent("topic/sendData", dataSensor);
        } catch (Exception e) {
            log.error("Error processing MQTT message: {}", e.getMessage());
            throw e;
        }
    }

    @Override
    public void deliveryComplete(IMqttDeliveryToken iMqttDeliveryToken) {
        log.info("Message delivery completed: {}", iMqttDeliveryToken.getMessageId());
    }
}
