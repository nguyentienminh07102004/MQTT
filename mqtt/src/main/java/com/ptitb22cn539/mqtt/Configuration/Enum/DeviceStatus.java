package com.ptitb22cn539.mqtt.Configuration.Enum;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum DeviceStatus {
    on("on"),
    off("off")
    ;
    private final String value;
}
