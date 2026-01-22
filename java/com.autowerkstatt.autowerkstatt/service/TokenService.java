package com.autowerkstatt.autowerkstatt.service;

import com.autowerkstatt.autowerkstatt.dao.TokenRepository;
import com.autowerkstatt.autowerkstatt.entity.Token;
import com.autowerkstatt.autowerkstatt.entity.Users;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.NoSuchElementException;
import java.util.Random;

@Service
public class TokenService {

    @Autowired
    private TokenRepository tokenRepository;

    public Integer makeToken() {
        return new Random().nextInt(900000) + 100000;
    }

    public Token getToken(Integer token) {
        return tokenRepository.findByToken(token).orElse(null);
    }

    public Token saveToken(Users users, Integer tokenCode) {
        Token token = Token.builder()
                .time(new Date(System.currentTimeMillis()))
                .token(tokenCode)
                .users(users)
                .build();
        tokenRepository.save(token);
        return token;
    }

    public void deleteToken(Token token) {
        tokenRepository.delete(token);
    }

    public Token findByUserAndToken(Users users, Integer token) {
        return tokenRepository.findByTokenAndUsers(token, users)
                .orElseThrow(() -> new NoSuchElementException(String.format("Не найден токен %s для пользователя", token, users.getEmail())));
    }
}
