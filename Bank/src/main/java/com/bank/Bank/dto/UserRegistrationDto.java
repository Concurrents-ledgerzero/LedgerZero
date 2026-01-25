package com.bank.Bank.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class UserRegistrationDto {
    private String name;
    private String email;
    private String phoneNumber;
    private String accountNo;
    private String bankName;
    private String bankBranch;
    private String ifscCode;
    private String mpin; // Raw 4-6 digit PIN
}