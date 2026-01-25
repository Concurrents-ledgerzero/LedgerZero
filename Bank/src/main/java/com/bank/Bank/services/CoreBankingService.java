package com.bank.Bank.services;

import com.bank.Bank.dto.PaymentRequestDto;
import com.bank.Bank.models.LedgerEntry;
import com.bank.Bank.models.UserAccount;
import com.bank.Bank.models.enums.constants.TransactionStatus;
import com.bank.Bank.models.enums.constants.TransactionType;
import com.bank.Bank.repository.LedgerRepository;
import com.bank.Bank.repository.UserAccountRepository;
import com.bank.Bank.services.security.PinSecurityService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CoreBankingService {

    private final UserAccountRepository userRepo;
    private final LedgerRepository ledgerRepo;
    private final PinSecurityService pinSecurityService;

    /**
     * STEP 1: SENDER SIDE (Debit)
     * This happens at the Sender's Bank.
     */
    @Transactional
    public String initiateDebit(PaymentRequestDto request) {

        // 1. Fetch User (Optimistic / No Lock)
        // We fetch here just to get the security credentials (Hash/Salt)
        // This is fast and doesn't block other users.
        UserAccount sender = userRepo.findById(request.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        // 2. Security Check (Done BEFORE locking)
        // We check the PIN *before* we lock the row. This prevents bad actors from
        // sending 1000 invalid requests to lock up a user's account.
        boolean isPinValid = pinSecurityService.verifyMpin(
                request.getMpin(),
                sender.getMpinHash(),
                sender.getMpinSalt()
        );
        if (!isPinValid) {
            throw new SecurityException("Invalid MPIN");
        }

        // ---------------------------------------------------------
        // 🔒 CRITICAL SECTION STARTS HERE
        // ---------------------------------------------------------

        // 3. Acquire PESSIMISTIC Lock
        // This call will WAIT if another transaction is modifying this user.
        // Once this line executes, we "own" the user row until the method ends.
        UserAccount lockedSender = userRepo.findByIdWithLock(request.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender lock failed"));

        // 4. Validate Balance (on the LOCKED object)
        if (lockedSender.getBalance().compareTo(request.getAmount()) < 0) {
            throw new RuntimeException("Insufficient Funds");
        }

        // 5. Deduct Money
        lockedSender.setBalance(lockedSender.getBalance().subtract(request.getAmount()));
        userRepo.save(lockedSender); // Hibernate flushes this update immediately

        // 6. Generate Transaction ID (Simulated Switch ID)
        String txnId = UUID.randomUUID().toString();

        // 7. Write Ledger Entry
        LedgerEntry debitEntry = LedgerEntry.builder()
                .transactionId(txnId)
                .user(lockedSender)
                .amount(request.getAmount())
                .direction(TransactionType.DEBIT)
                .counterpartyVpa(request.getReceiverVpa())
                .status(TransactionStatus.SUCCESS)
                .description(request.getDescription())
                .build();

        ledgerRepo.save(debitEntry);

        // 🔒 CRITICAL SECTION ENDS HERE (Transaction Commit releases the lock)

        return txnId;
    }

    /**
     * STEP 2: RECEIVER SIDE (Credit)
     */
    @Transactional
    public void processIncomingCredit(String receiverVpa, BigDecimal amount, String txnId, String senderVpa) {

        // 1. Find Receiver (Fast lookup, no lock)
        UserAccount receiver = userRepo.findByVpa(receiverVpa)
                .orElseThrow(() -> new RuntimeException("Receiver VPA not found: " + receiverVpa));

        // ---------------------------------------------------------
        // 🔒 CRITICAL SECTION STARTS HERE
        // ---------------------------------------------------------

        // 2. Acquire PESSIMISTIC Lock using the ID we just found
        UserAccount lockedReceiver = userRepo.findByIdWithLock(receiver.getUserId())
                .orElseThrow(() -> new RuntimeException("Receiver lock failed"));

        // 3. Add Money
        lockedReceiver.setBalance(lockedReceiver.getBalance().add(amount));
        userRepo.save(lockedReceiver);

        // 4. Write Ledger Entry
        LedgerEntry creditEntry = LedgerEntry.builder()
                .transactionId(txnId)
                .user(lockedReceiver)
                .amount(amount)
                .direction(TransactionType.CREDIT)
                .counterpartyVpa(senderVpa)
                .status(TransactionStatus.SUCCESS)
                .description("Received via UPI")
                .build();

        ledgerRepo.save(creditEntry);

        // 🔒 CRITICAL SECTION ENDS HERE
    }

    /**
     * FOR TESTING ONLY: Simulates full transfer in one transaction.
     */
    @Transactional
    public void performLocalTransfer(PaymentRequestDto request) {
        // 1. Debit Sender (Lock acquired and released*)
        // *Since we are in one @Transactional method, the lock from 'initiateDebit'
        // actually extends until 'performLocalTransfer' finishes!
        String txnId = initiateDebit(request);

        // Fetch sender details again (safe within transaction)
        UserAccount sender = userRepo.findById(request.getSenderId()).orElseThrow();

        // 2. Credit Receiver (Lock acquired and held)
        processIncomingCredit(request.getReceiverVpa(), request.getAmount(), txnId, sender.getVpa());

        // Both locks (Sender + Receiver) are released here.
    }
}