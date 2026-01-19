package com.autowerkstatt.autowerkstatt.service;

import com.autowerkstatt.autowerkstatt.dao.ModelsRepository;
import com.autowerkstatt.autowerkstatt.entity.Models;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.NoSuchElementException;

@Service
public class ModelsService {

    @Autowired
    private ModelsRepository modelsRepository;

    public Models findByModelsName(String modelsName) {
        return this.modelsRepository.findByName(modelsName).orElse(null);
    }

    public Models findByModelId(Long modelId) {
        return this.modelsRepository.findById(modelId).orElse(null);
    }
}
