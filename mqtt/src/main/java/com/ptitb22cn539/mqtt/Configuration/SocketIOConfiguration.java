package com.ptitb22cn539.mqtt.Configuration;

import com.corundumstudio.socketio.SocketIOServer;
import com.corundumstudio.socketio.protocol.JacksonJsonSupport;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SocketIOConfiguration {
    @Value("${socketio.host}")
    private String host;
    @Value("${socketio.port}")
    private Integer port;

    @Bean
    public SocketIOServer socketIOServer() {
        com.corundumstudio.socketio.Configuration configuration = new com.corundumstudio.socketio.Configuration();
        configuration.setHostname(host);
        configuration.setPort(port);
        configuration.setEnableCors(true);
        JacksonJsonSupport jacksonJsonSupport = new JacksonJsonSupport(new JavaTimeModule());
        configuration.setJsonSupport(jacksonJsonSupport);
        SocketIOServer socketIOServer = new SocketIOServer(configuration);
        socketIOServer.start();
        return socketIOServer;
    }
}
