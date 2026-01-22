package com.autowerkstatt.autowerkstatt.service;

import com.autowerkstatt.autowerkstatt.dao.UsersRepository;
import com.autowerkstatt.autowerkstatt.entity.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UsersRepository usersRepository;

    public List<Users> findAll() {
        return this.usersRepository.findAll();
    }
}
