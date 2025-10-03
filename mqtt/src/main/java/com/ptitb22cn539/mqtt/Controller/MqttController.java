package com.ptitb22cn539.mqtt.Controller;

import com.ptitb22cn539.mqtt.DTO.DataHistorySearchRequest;
import com.ptitb22cn539.mqtt.DTO.DeviceSensorSearchRequest;
import com.ptitb22cn539.mqtt.Entity.DeviceHistoryEntity;
import com.ptitb22cn539.mqtt.Entity.DeviceSensorEntity;
import com.ptitb22cn539.mqtt.Service.MqttService;
import lombok.RequiredArgsConstructor;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.springframework.data.web.PagedModel;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/api/v1")
public class MqttController {
    private final MqttService mqttService;

    @PostMapping(value = "/{deviceName}/{status}")
    public void turnOnOffDevice(@PathVariable String deviceName, @PathVariable String status) throws MqttException {
        this.mqttService.turnOnOffDevice(deviceName, status);
    }

    @GetMapping(value = "/sensors")
    public PagedModel<DeviceSensorEntity> searchDeviceSensor(@ModelAttribute DeviceSensorSearchRequest deviceSensorSearchRequest) {
        return this.mqttService.searchDeviceSensor(deviceSensorSearchRequest);
    }

    @GetMapping(value = "/histories")
    public PagedModel<DeviceHistoryEntity> searchDeviceHistory(@ModelAttribute DataHistorySearchRequest dataHistorySearchRequest) {
        return this.mqttService.getDeviceHistory(dataHistorySearchRequest);
    }

    @GetMapping(value = "/last/{deviceName}")
    public DeviceHistoryEntity getLastDevice(@PathVariable String deviceName) {
        return this.mqttService.getLastDeviceHistory(deviceName);
    }
}
