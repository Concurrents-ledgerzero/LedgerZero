package com.bank.Bank.controller;

import com.bank.Bank.dto.PaymentRequestDto;
import com.bank.Bank.services.CoreBankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/banking")
@RequiredArgsConstructor
public class PaymentController {

    private final CoreBankingService coreBankingService;

    // --- DOOR A: CLIENT FACING API ---
    // User calls this to SEND money
    @PostMapping("/initiate-payment")
    public ResponseEntity<?> initiatePayment(@RequestBody PaymentRequestDto request) {
        try {
            // 1. Bank locks sender & Debits money
            String txnId = coreBankingService.initiateDebit(request);

            // 2. In a real system, we would now call the SWITCH here.
            // Since we haven't built the Switch yet, we return the ID.
            return ResponseEntity.ok("Debit Successful. Transaction Pending Switch processing. ID: " + txnId);

        } catch (SecurityException e) {
            return ResponseEntity.status(401).body("Wrong MPIN");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Payment Failed: " + e.getMessage());
        }
    }

    // --- DOOR B: SWITCH FACING API (Webhook) ---
    // The NPCI Switch calls this to CREDIT money to a user in this bank
    // Security Warning: In prod, this needs IP whitelisting (only accept from Switch IP)
    @PostMapping("/webhook/credit")
    public ResponseEntity<?> receiveCredit(
            @RequestParam String receiverVpa,
            @RequestParam BigDecimal amount,
            @RequestParam String txnId,
            @RequestParam String senderVpa) {

        try {
            coreBankingService.processIncomingCredit(receiverVpa, amount, txnId, senderVpa);
            return ResponseEntity.ok("Credit Applied Successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Credit Failed: " + e.getMessage());
        }
    }
}