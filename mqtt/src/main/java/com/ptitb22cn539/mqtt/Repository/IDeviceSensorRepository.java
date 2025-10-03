package com.ptitb22cn539.mqtt.Repository;

import com.ptitb22cn539.mqtt.Entity.DeviceSensorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface IDeviceSensorRepository extends JpaRepository<DeviceSensorEntity, String>, JpaSpecificationExecutor<DeviceSensorEntity> {
}
