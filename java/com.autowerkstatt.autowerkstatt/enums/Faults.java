package com.autowerkstatt.autowerkstatt.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public enum Faults {

    MORE("ПРОЧЕЕ"),
    HODOVKA("ХОДОВКА"),
    ELECTRICIAN("ЭЛЕКТРИКА"),
    INTERNAL_COMBUSTION_ENGINE("ДВС");

    private String translate;
}
