package com.autowerkstatt.autowerkstatt.dto;

import com.autowerkstatt.autowerkstatt.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SubmitApplicationUserFaultsDto {
    private Long id;
    private String firstName;
    private String lastName;
    private Date dateTime;
    private String description;
    private Long carId;
    private Status status;
}
