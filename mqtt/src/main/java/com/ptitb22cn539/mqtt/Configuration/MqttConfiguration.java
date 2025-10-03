package com.ptitb22cn539.mqtt.Configuration;

import lombok.extern.slf4j.Slf4j;
import org.eclipse.paho.client.mqttv3.IMqttClient;
import org.eclipse.paho.client.mqttv3.MqttCallback;
import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttConnectOptions;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.UUID;

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

    @Bean
    public IMqttClient mqttClient(MqttCallback mqttCallback) throws MqttException {
        String publisherId = UUID.randomUUID().toString();
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
            int qos = 1;
            mqttClient.setCallback(mqttCallback);
            String getEsp32MqttTopic = "topic/sendData";
            mqttClient.subscribe(getEsp32MqttTopic, qos);
        } catch (MqttException e) {
            log.error("Failed to connect to MQTT broker: {}", e.getMessage(), e);
            throw e;
        }
        
        return mqttClient;
    }
}
