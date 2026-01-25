package com.bank.Bank.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class PaymentRequestDto {
    private UUID senderId;
    private String receiverVpa;
    private BigDecimal amount;
    private String mpin; // The 4-6 digit PIN to authorize
    private String description; // e.g., "Dinner Bill"
}