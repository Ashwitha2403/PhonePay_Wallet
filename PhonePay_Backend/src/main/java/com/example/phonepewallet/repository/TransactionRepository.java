package com.example.phonepewallet.repository;

import com.example.phonepewallet.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findBySenderUpiOrReceiverUpi(String senderUpi, String receiverUpi);

}