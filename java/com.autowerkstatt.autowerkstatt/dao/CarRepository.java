package com.autowerkstatt.autowerkstatt.dao;

import com.autowerkstatt.autowerkstatt.entity.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {

    @Query(value = "select * from cars c where c.user_id = :user_id", nativeQuery = true)
    List<Car> findCarByUser(@Param("user_id") Long userId);
}
