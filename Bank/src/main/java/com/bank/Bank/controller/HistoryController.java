package com.bank.Bank.controller;

import com.bank.Bank.service.TransactionHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/history")
@RequiredArgsConstructor
public class HistoryController {

    private final TransactionHistoryService historyService;

    @GetMapping("/{userId}")
    public ResponseEntity<?> getPassbook(@PathVariable UUID userId) {
        return ResponseEntity.ok(historyService.getUserHistory(userId));
    }
}