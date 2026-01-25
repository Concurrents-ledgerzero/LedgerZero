package com.bank.Bank.models;


import com.bank.Bank.models.enums.constants;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "ledger", indexes = {
        @Index(name = "idx_ledger_user", columnList = "user_id"),
        @Index(name = "idx_txn_id", columnList = "transaction_id, direction", unique = true),
        @Index(name = "idx_created_at", columnList = "created_at") // For sorting history
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LedgerEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID entryId;

    // --- 1. CORE LINKING ---
    @Column(nullable = false, updatable = false)
    private String transactionId; // Global ID from Switch

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserAccount user; // The owner of this specific ledger row

    // --- 2. MONEY ---
    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private constants.TransactionType direction; // DEBIT (Money Out) or CREDIT (Money In)

    // --- 3. CONTEXT (Who was this with?) ---
    // If direction is DEBIT, this is the Receiver's VPA.
    // If direction is CREDIT, this is the Sender's VPA.
    @Column(name = "counterparty_vpa", nullable = false)
    private String counterpartyVpa;

    // Optional: Store the Name too so the history looks nice ("Paid to Zomato")
    @Column(name = "counterparty_name")
    private String counterpartyName;

    // --- 4. STATUS ---
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private constants.TransactionStatus status;

    private String description; // e.g., "Dinner Bill"

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
