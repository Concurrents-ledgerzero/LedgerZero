package com.bank.Bank.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_phone", columnList = "phone_number", unique = true),
        @Index(name = "idx_vpa", columnList = "vpa", unique = true)
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserAccount {


    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID userId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    @Email(message = "Invalid email format")
    private String email;

    @Column(name = "phone_number", nullable = false, length = 15)
    @Size(min = 10, max = 15, message = "Phone number must be valid")
    private String phoneNumber;

    @Column(name = "account_no", nullable = false, length = 20)
    private String accountNumber;

    @Column(name = "bank_name", nullable = false)
    private String bankName;

    @Column(name = "bank_branch")
    private String bankBranchName;

    @Column(name = "ifsc_code", nullable = false, length = 11)
    @Pattern(regexp = "^[A-Z]{4}0[A-Z0-9]{6}$", message = "Invalid IFSC Code format")
    private String ifscCode;

    @Column(nullable = false, unique = true)
    private String vpa;

    @Column(name = "mpin_hash", nullable = false)
    private String mpinHash;

    @Column(nullable = false)
    private String mpinSalt;

    @Column(nullable = false, precision = 19, scale = 4)
    @Builder.Default
    private BigDecimal balance = BigDecimal.ZERO;

    @Version
    private Long version; // Optimistic Locking (Prevent Double Spend)

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}