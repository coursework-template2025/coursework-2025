package com.autowerkstatt.autowerkstatt.service;

import com.autowerkstatt.autowerkstatt.dao.MarkRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MarkService {

    @Autowired
    private MarkRepository markRepository;

    public List<Object[]> getAllMarks()  {
        return markRepository.geaAllMarks();
    }

    public List<Object[]> getModelByMark(Long id) {
        return markRepository.getModelByMark(id);
    }
}
