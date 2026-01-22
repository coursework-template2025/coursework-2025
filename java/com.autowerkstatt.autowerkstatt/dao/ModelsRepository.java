package com.autowerkstatt.autowerkstatt.dao;

import com.autowerkstatt.autowerkstatt.entity.Models;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ModelsRepository extends JpaRepository<Models, Long> {
   Optional <Models> findByName(String modelsName);
}
