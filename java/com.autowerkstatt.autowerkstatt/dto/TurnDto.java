package com.autowerkstatt.autowerkstatt.dto;

import com.autowerkstatt.autowerkstatt.entity.Notification;
import com.autowerkstatt.autowerkstatt.enums.Faults;
import com.autowerkstatt.autowerkstatt.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TurnDto {
    private Long id;
    private Notification notification;
    private Faults faults;
    private Status status;
    private Integer count;
}
