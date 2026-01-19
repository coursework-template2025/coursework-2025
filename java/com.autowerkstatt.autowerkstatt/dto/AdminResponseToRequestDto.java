package com.autowerkstatt.autowerkstatt.dto;

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
public class AdminResponseToRequestDto {
    private Long id;
    private String dateFrom;
    private String dateBefore;
    private BigDecimal price;
    private String masterName;
    private Long masterId;
    private Status status;
}
