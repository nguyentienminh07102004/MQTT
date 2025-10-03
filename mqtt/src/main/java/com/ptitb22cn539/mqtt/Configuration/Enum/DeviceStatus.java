package com.ptitb22cn539.mqtt.Configuration.Enum;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum DeviceStatus {
    ON("on"),
    OFF("off")
    ;
    private final String value;
}
