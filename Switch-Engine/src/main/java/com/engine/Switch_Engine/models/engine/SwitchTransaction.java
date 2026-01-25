package com.engine.Switch_Engine.models.engine;

import com.engine.Switch_Engine.models.enums.constants;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "switch_transactions", indexes = {
        @Index(name = "idx_sender_bank", columnList = "sender_bank_id"),
        @Index(name = "idx_receiver_bank", columnList = "receiver_bank_id"),
        @Index(name = "idx_created_at", columnList = "created_at") // Critical for "Time-Window" lookups
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SwitchTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID txnId;

    // 🚀 OPTIMIZATION: Logical Link only (No DB Constraint)
    // We store "HDFC", "SBI" directly.
    // Validation happens in Java Service layer using a Cached Map, not in DB.
    @Column(name = "sender_bank_id", nullable = false, length = 20)
    private String senderBankId;

    @Column(name = "receiver_bank_id", nullable = false, length = 20)
    private String receiverBankId;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private constants.TransactionStatus status = constants.TransactionStatus.PROCESSING;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}