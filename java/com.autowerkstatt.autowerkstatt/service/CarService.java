package com.autowerkstatt.autowerkstatt.service;

import com.autowerkstatt.autowerkstatt.dao.CarRepository;
import com.autowerkstatt.autowerkstatt.entity.Car;
import com.autowerkstatt.autowerkstatt.entity.Models;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

@Service
@AllArgsConstructor
@NoArgsConstructor
public class CarService {
    @Autowired
    private CarRepository repository;

    public void addCar(Car car) {
        this.repository.save(car);
    }


    public Car findById(Long id) {
        return this.repository.findById(id).orElse(null);
    }

    public List<Car> getCarByUser(Long userId) {
        return this.repository.findCarByUser(userId);
    }

    public List<Car> getCarByUserId(Long userId) {
        return this.repository.findCarByUser(userId);
    }

    public List<Car> findAllAuthorizationUser() {
        return this.repository.findAll();
    }
}
