package com.ptitb22cn539.mqtt.DTO;

import java.sql.Date;

public interface DataHistoryResponse {
    Long getCount();
    String getDeviceName();
    Date getCreatedDate();
}

