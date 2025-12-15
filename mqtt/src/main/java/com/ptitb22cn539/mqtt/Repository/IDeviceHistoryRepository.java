package com.ptitb22cn539.mqtt.Repository;

import com.ptitb22cn539.mqtt.DTO.DataHistoryResponse;
import com.ptitb22cn539.mqtt.Entity.DeviceHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface IDeviceHistoryRepository extends JpaRepository<DeviceHistoryEntity, Long>, JpaSpecificationExecutor<DeviceHistoryEntity> {
    @Query(value = "select d.* from deviceHistories d where lower(d.deviceName) = lower(:deviceName) order by d.createdDate desc limit 1 offset 0", nativeQuery = true)
    DeviceHistoryEntity findLatestByDeviceName(String deviceName);

    @Query(value = """
                SELECT 
                    COUNT(d.id) AS count,
                    d.deviceName AS deviceName,
                    DATE(d.createdDate) AS createdDate
                FROM deviceHistories d
                WHERE (d.createdDate BETWEEN 
                      COALESCE(:startDate, d.createdDate) 
                      AND COALESCE(:endDate, d.createdDate))
                        AND lower(d.status) = lower(:status)
                AND (:deviceName IS NULL OR lower(d.deviceName) = lower(:deviceName))
                GROUP BY DATE(d.createdDate), d.deviceName
            """, nativeQuery = true)
    List<DataHistoryResponse> searchCountByDeviceNameAndCreatedDate(
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate,
            @Param("status") String status,
            @Param("deviceName") String deviceName
    );

    @Query(value = "select count(d.id) from deviceHistories d where lower(d.deviceName) = lower(:deviceName) and DATE(d.createdDate) = DATE(NOW())", nativeQuery = true)
    Long countByDeviceNameIgnoreCase(String deviceName);
}