package com.bank.Bank.service;

import com.bank.Bank.dto.UserRegistrationDto;
import com.bank.Bank.models.UserAccount;
import com.bank.Bank.repository.UserAccountRepository;
import com.bank.Bank.services.security.PinSecurityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor // Automatically injects 'final' fields (Lombok)
public class UserService {

    private final UserAccountRepository userAccountRepository;
    private final PinSecurityService pinSecurityService;

    @Transactional
    public UserAccount registerUser(UserRegistrationDto request) {
        // 1. Validation: Check duplicates
        if (userAccountRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new IllegalArgumentException("Phone number already registered.");
        }
        if (userAccountRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered.");
        }

        // 2. Generate VPA Logic
        // Logic: Extract part before '@' in email + "@ok" + bankName (lowercase, no spaces)
        // Example: john.doe@gmail.com, HDFC Bank -> john.doe@okhdfcbank
        String emailPrefix = request.getEmail().split("@")[0];
        String cleanBankName = request.getBankName().replaceAll("\\s+", "").toLowerCase();
        String generatedVpa = emailPrefix + "@ok" + cleanBankName;

        // Verify VPA uniqueness (Edge case handling)
        if (userAccountRepository.existsByVpa(generatedVpa)) {
            // Fallback: Add random suffix if collision happens
            generatedVpa = generatedVpa + "." + UUID.randomUUID().toString().substring(0, 4);
        }

        // 3. Security: Hash MPIN
        String salt = pinSecurityService.generateSalt();
        String mpinHash = pinSecurityService.hashMpin(request.getMpin(), salt);

        // 4. Build Entity
        UserAccount newUser = UserAccount.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phoneNumber(request.getPhoneNumber())
                .accountNumber(request.getAccountNo())
                .bankName(request.getBankName())
                .bankBranchName(request.getBankBranch())
                .ifscCode(request.getIfscCode())
                .balance(java.math.BigDecimal.valueOf(50000))
                // Generated Fields
                .vpa(generatedVpa)
                .mpinHash(mpinHash)
                .mpinSalt(salt)
                .build();

        // 5. Save & Return
        return userAccountRepository.save(newUser);
    }
}