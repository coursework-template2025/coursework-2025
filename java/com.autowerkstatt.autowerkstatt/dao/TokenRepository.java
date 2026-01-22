package com.autowerkstatt.autowerkstatt.dao;

import com.autowerkstatt.autowerkstatt.entity.Token;
import com.autowerkstatt.autowerkstatt.entity.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TokenRepository extends JpaRepository<Token, Long> {

    Optional<Token> findByToken(Integer token);

    Optional<Token> findByTokenAndUsers(Integer token, Users user);
}
