package com.bank.Bank.controller;

import com.bank.Bank.dto.UserRegistrationDto;
import com.bank.Bank.models.UserAccount;
import com.bank.Bank.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * API to Onboard a new User.
     * This generates their VPA and Hashes their MPIN securely.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationDto request) {
        try {
            // 1. Call the Service Logic
            UserAccount newUser = userService.registerUser(request);

            // 2. Prepare a clean response (Don't return the full entity with Salts/Hashes!)
            Map<String, Object> response = new HashMap<>();
            response.put("message", "User Registered Successfully");
            response.put("userId", newUser.getUserId());
            response.put("vpa", newUser.getVpa());
            response.put("balance", newUser.getBalance());

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            // Handles "Phone already exists" or "Email already exists"
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));

        } catch (Exception e) {
            // Handles unexpected server errors
            return ResponseEntity.internalServerError().body(Map.of("error", "Registration Failed: " + e.getMessage()));
        }
    }
}