package com.ptitb22cn539.mqtt.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
public class DataSensorRequest {
    private Float humidity;
    private Float temperature;
    private Float brightness;
}
