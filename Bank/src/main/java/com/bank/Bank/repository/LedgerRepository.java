package com.bank.Bank.repository;

import com.bank.Bank.models.LedgerEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface LedgerRepository extends JpaRepository<LedgerEntry, UUID> {

    // Fetch all logs for a user, newest first
    List<LedgerEntry> findByUser_UserIdOrderByCreatedAtDesc(UUID userId);
}