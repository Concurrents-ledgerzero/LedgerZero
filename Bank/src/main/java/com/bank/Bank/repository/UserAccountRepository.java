package com.bank.Bank.repository;

import com.bank.Bank.models.UserAccount;
import jakarta.persistence.LockModeType;
import jakarta.persistence.QueryHint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.QueryHints;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserAccountRepository extends JpaRepository<UserAccount, UUID> {

    // --- Standard Checks (No Locks) ---
    boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByEmail(String email);
    boolean existsByVpa(String vpa);
    Optional<UserAccount> findByVpa(String vpa);

    /**
     * 🔒 PESSIMISTIC LOCK (The "Waiting" Queue)
     * Use this ONLY when you are about to deduct money (Debit).
     * * How it works:
     * 1. It runs "SELECT ... FOR UPDATE" in SQL.
     * 2. If User A is being processed by another thread, this thread WAITS here.
     * 3. It waits for up to 10000ms (3 seconds). If lock isn't free by then, it fails.
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @QueryHints({@QueryHint(name = "jakarta.persistence.lock.timeout", value = "10000")})
    @Query("SELECT u FROM UserAccount u WHERE u.userId = :userId")
    Optional<UserAccount> findByIdWithLock(@Param("userId") UUID userId);
}