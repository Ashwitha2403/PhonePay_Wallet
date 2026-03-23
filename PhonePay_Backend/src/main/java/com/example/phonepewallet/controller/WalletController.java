package com.example.phonepewallet.controller;

import com.example.phonepewallet.dto.SendMoneyRequest;
import com.example.phonepewallet.service.WalletService;
import com.example.phonepewallet.dto.AddMoneyRequest;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/wallet")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @GetMapping("/balance")
    public Double checkBalance(@RequestParam Long userId) {
        return walletService.checkBalance(userId);
    }

    @PostMapping("/add-money")
    public Double addMoney(@RequestBody AddMoneyRequest request) {
        return walletService.addMoney(request);
    }

    @PostMapping("/send-money")
    public String sendMoney(@RequestBody SendMoneyRequest request) {
        return walletService.sendMoney(request);
    }


}