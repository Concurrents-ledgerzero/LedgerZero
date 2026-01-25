package com.bank.Bank.services.security;

import org.springframework.stereotype.Service;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class PinSecurityService {

    private static final String ALGORITHM = "SHA-256";

    /**
     * Generates a secure random 16-byte salt.
     * @return Base64 encoded salt string
     */
    public String generateSalt() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return Base64.getEncoder().encodeToString(salt);
    }

    /**
     * Hashes the MPIN using SHA-256 with the provided Salt.
     * Formula: Hash = SHA256( MPIN + Salt )
     */
    public String hashMpin(String plainMpin, String salt) {
        try {
            MessageDigest md = MessageDigest.getInstance(ALGORITHM);

            // Combine MPIN and Salt
            String input = plainMpin + salt;

            // Compute Hash
            byte[] hashedBytes = md.digest(input.getBytes());

            // Return as Base64 String to store in DB
            return Base64.getEncoder().encodeToString(hashedBytes);

        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Encryption algorithm not found", e);
        }
    }

    /**
     * Verifies if the entered MPIN matches the stored hash.
     */
    public boolean verifyMpin(String enteredMpin, String storedHash, String storedSalt) {
        String calculatedHash = hashMpin(enteredMpin, storedSalt);
        return calculatedHash.equals(storedHash);
    }
}