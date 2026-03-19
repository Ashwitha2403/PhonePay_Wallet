package com.example.phonepewallet.repository;

import com.example.phonepewallet.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByPhoneNumber(String phoneNumber);
    Optional<User> findByUpiId(String upiId);
    Optional<User> findByPhoneNumberAndPin(String phoneNumber, String pin);

}