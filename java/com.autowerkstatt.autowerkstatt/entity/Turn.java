package com.autowerkstatt.autowerkstatt.entity;

import com.autowerkstatt.autowerkstatt.enums.Faults;
import com.autowerkstatt.autowerkstatt.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "TURN")
public class Turn {

    @Id
    @GeneratedValue
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "notification_id", referencedColumnName = "id")
    private Notification notification;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Enumerated(EnumType.STRING)
    @Column(name = "faults")
    private Faults faults;
}
