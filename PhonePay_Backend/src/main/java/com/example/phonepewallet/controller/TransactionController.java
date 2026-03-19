package com.example.phonepewallet.controller;

import com.example.phonepewallet.entity.Transaction;
import com.example.phonepewallet.repository.TransactionRepository;
import com.example.phonepewallet.repository.UserRepository;
import com.example.phonepewallet.entity.User;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/transactions")
public class TransactionController {

    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public TransactionController(TransactionRepository transactionRepository,
                                 UserRepository userRepository) {
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/user/{userId}")
    public List<Transaction> getUserTransactions(@PathVariable Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String upi = user.getUpiId();

        return transactionRepository.findBySenderUpiOrReceiverUpi(upi, upi);
    }
}