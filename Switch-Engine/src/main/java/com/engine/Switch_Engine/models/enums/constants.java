package com.engine.Switch_Engine.models.enums;

public class constants {
    public enum TransactionStatus {
        PENDING, SUCCESS, FAILED, PROCESSING
    }

    public enum TransactionType {
        DEBIT, CREDIT
    }

    public enum BankStatus {
        ACTIVE, INACTIVE, MAINTENANCE
    }
}
