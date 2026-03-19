package com.example.phonepewallet.service;

import com.example.phonepewallet.dto.SendMoneyRequest;
import com.example.phonepewallet.dto.AddMoneyRequest;
import com.example.phonepewallet.entity.Wallet;
import com.example.phonepewallet.entity.Transaction;
import com.example.phonepewallet.entity.User;
import com.example.phonepewallet.repository.WalletRepository;
import com.example.phonepewallet.repository.TransactionRepository;
import com.example.phonepewallet.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class WalletService {

    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;
    private final UserRepository userRepository;

    public WalletService(WalletRepository walletRepository,
                         TransactionRepository transactionRepository,
                         UserRepository userRepository) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
        this.userRepository = userRepository;
    }

    public Double checkBalance(Long userId) {

        Optional<Wallet> wallet = walletRepository.findByUserId(userId);

        return wallet.map(Wallet::getBalance).orElse(0.0);
    }

    public Double addMoney(AddMoneyRequest request) {

        Optional<Wallet> walletOptional =
                walletRepository.findByUserId(request.getUserId());

        Wallet wallet;

        if(walletOptional.isPresent()) {

            wallet = walletOptional.get();

        } else {

            User user = userRepository.findById(request.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            wallet = new Wallet();
            wallet.setUser(user);
            wallet.setBalance(0.0);
        }

        wallet.setBalance(wallet.getBalance() + request.getAmount());

        walletRepository.save(wallet);

        return wallet.getBalance();
    }

    public String sendMoney(SendMoneyRequest request) {

        Optional<User> senderUser =
                userRepository.findByPhoneNumber(request.getFromPhone());

        Optional<User> receiverUser =
                userRepository.findByPhoneNumber(request.getToPhone());

        if(senderUser.isEmpty() || receiverUser.isEmpty()){
            return "User not found";
        }

        Optional<Wallet> senderWallet =
                walletRepository.findByUserId(senderUser.get().getId());

        Optional<Wallet> receiverWallet =
                walletRepository.findByUserId(receiverUser.get().getId());

        if(senderWallet.isEmpty() || receiverWallet.isEmpty()){
            return "Wallet not found";
        }

        Wallet sender = senderWallet.get();
        Wallet receiver = receiverWallet.get();

        if(sender.getBalance() < request.getAmount()){
            return "Insufficient balance";
        }

        sender.setBalance(sender.getBalance() - request.getAmount());
        receiver.setBalance(receiver.getBalance() + request.getAmount());

        walletRepository.save(sender);
        walletRepository.save(receiver);

        Transaction transaction = new Transaction();
        transaction.setSenderUpi(sender.getUser().getUpiId());
        transaction.setReceiverUpi(receiver.getUser().getUpiId());
        transaction.setAmount(request.getAmount());
        transaction.setStatus("SUCCESS");
        transaction.setTimestamp(LocalDateTime.now());

        transactionRepository.save(transaction);

        return "Money transferred successfully";
    }
}