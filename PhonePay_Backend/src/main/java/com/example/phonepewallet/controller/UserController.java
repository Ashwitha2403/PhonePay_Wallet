package com.example.phonepewallet.controller;

import com.example.phonepewallet.entity.User;
import com.example.phonepewallet.entity.Wallet;
import com.example.phonepewallet.repository.UserRepository;
import com.example.phonepewallet.repository.WalletRepository;
import com.example.phonepewallet.dto.LoginRequest;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import java.util.Map;
import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;

    public UserController(UserRepository userRepository,
                          WalletRepository walletRepository) {
        this.userRepository = userRepository;
        this.walletRepository = walletRepository;
    }

    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {

        if (userRepository.findByPhoneNumber(user.getPhoneNumber()).isPresent()) {
            return "Phone number already registered";
        }

        if (userRepository.findByUpiId(user.getUpiId()).isPresent()) {
            return "UPI ID already exists";
        }

        User savedUser = userRepository.save(user);

        Wallet wallet = new Wallet();
        wallet.setUser(savedUser);
        wallet.setBalance(0.0);

        walletRepository.save(wallet);

        return "User registered successfully";
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        Optional<User> userOptional =
                userRepository.findByPhoneNumber(request.getPhoneNumber());

        if(userOptional.isPresent() &&
                userOptional.get().getPin().equals(request.getPin())){

            User user = userOptional.get();

            Map<String,Object> response = new HashMap<>();
            response.put("message","Login successful");
            response.put("userId",user.getId());

            return ResponseEntity.ok(response);
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body("Invalid phone or pin");
    }
}