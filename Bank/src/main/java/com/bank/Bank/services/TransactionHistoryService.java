package com.bank.Bank.service;

import com.bank.Bank.dto.TransactionHistoryDto;
import com.bank.Bank.models.LedgerEntry;
import com.bank.Bank.repository.LedgerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TransactionHistoryService {

    private final LedgerRepository ledgerRepository;

    public List<TransactionHistoryDto> getUserHistory(UUID userId) {
        List<LedgerEntry> entries = ledgerRepository.findByUser_UserIdOrderByCreatedAtDesc(userId);

        // Convert Entity to simple DTO to hide internal DB columns
        return entries.stream().map(e -> new TransactionHistoryDto(
                e.getTransactionId(),
                e.getAmount(),
                e.getDirection().toString(),
                e.getCounterpartyVpa(),
                e.getStatus().toString(),
                e.getDescription(),
                e.getCreatedAt()
        )).collect(Collectors.toList());
    }
}