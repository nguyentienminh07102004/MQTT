package com.ptitb22cn539.mqtt.DTO;

import com.ptitb22cn539.mqtt.Configuration.Enum.DeviceStatus;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.FieldDefaults;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ControlDeviceRequest implements Serializable {
    String requestId;
    DeviceStatus status;
}