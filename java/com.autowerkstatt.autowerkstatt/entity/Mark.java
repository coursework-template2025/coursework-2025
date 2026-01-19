package com.autowerkstatt.autowerkstatt.entity;

import lombok.*;

import javax.persistence.*;
import java.util.Set;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "MARKS")
public class Mark {
    @Id
    @GeneratedValue
    private Long id;

    @Column(name = "name")
    private String name;
}
