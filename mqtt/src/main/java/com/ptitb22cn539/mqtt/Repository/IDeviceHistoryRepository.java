package com.ptitb22cn539.mqtt.Repository;

import com.ptitb22cn539.mqtt.Entity.DeviceHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface IDeviceHistoryRepository extends JpaRepository<DeviceHistoryEntity, Long>, JpaSpecificationExecutor<DeviceHistoryEntity> {
    @Query(value = "select d.* from deviceHistories d where lower(d.deviceName) = lower(:deviceName) order by d.createdDate desc limit 1 offset 0", nativeQuery = true)
    DeviceHistoryEntity findLatestByDeviceName(String deviceName);
}