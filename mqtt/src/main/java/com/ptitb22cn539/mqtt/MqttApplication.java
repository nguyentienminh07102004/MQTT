package com.ptitb22cn539.mqtt;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
@Slf4j
public class MqttApplication {
    public static void main(String[] args) {
        SpringApplication.run(MqttApplication.class, args);
    }
}