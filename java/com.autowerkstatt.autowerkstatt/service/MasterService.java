package com.autowerkstatt.autowerkstatt.service;

import com.autowerkstatt.autowerkstatt.dao.MasterRepository;
import com.autowerkstatt.autowerkstatt.entity.Master;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class MasterService {

    @Autowired
    private MasterRepository masterRepository;

    public List<Master> findAllMaster() {
        return this.masterRepository.findAll();
    }

    public void save(Master master) {
        this.masterRepository.save(master);
    }

    public Master findById(Long masterId) {
        return this.masterRepository.findById(masterId).orElseThrow(() -> new NoSuchElementException(String.format("Мастер не найден по id: " + masterId)));
    }
}
