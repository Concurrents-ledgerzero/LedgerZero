package com.engine.Switch_Engine.models.engine;

import com.engine.Switch_Engine.models.enums.constants;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bank_directory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankParticipant {

    @Id
    @Column(length = 20)
    private String bankId; // "HDFC", "SBI"

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String apiUrl;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String publicKey;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private constants.BankStatus status = constants.BankStatus.ACTIVE;
}
