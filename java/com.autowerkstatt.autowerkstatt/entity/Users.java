package com.autowerkstatt.autowerkstatt.entity;

import com.autowerkstatt.autowerkstatt.enums.Roles;
import lombok.*;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "USERS")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "password")
    private String password;

    @Column(name = "tel_number")
    private Integer telNumber;

    @Column(name = "user_email")
    private String email;

    @Enumerated(EnumType.STRING)
    private Roles role;

    @Column
    private Boolean active = true;
}
