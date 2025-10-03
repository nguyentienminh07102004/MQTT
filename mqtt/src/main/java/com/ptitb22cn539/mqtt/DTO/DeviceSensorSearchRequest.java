package com.ptitb22cn539.mqtt.DTO;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.experimental.FieldDefaults;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@FieldDefaults(level = AccessLevel.PRIVATE)
public class DeviceSensorSearchRequest {
    @Builder.Default
    Integer page = 1;
    @Builder.Default
    Integer limit = 10;
    String dateTime;
    String type;
    Float value;
    private String sort;
}
