package com.bank.Bank.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionHistoryDto {

    private String transactionId;   // The Global Switch ID
    private BigDecimal amount;
    private String direction;       // "DEBIT" or "CREDIT"
    private String counterpartyVpa; // The person you paid or received from
    private String status;          // "SUCCESS", "FAILED"
    private String description;     // e.g. "Dinner Bill"
    private LocalDateTime timestamp;
}