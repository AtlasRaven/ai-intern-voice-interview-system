package com.intern.interview.repository;

import com.intern.interview.entity.Consent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConsentRepository extends JpaRepository<Consent, Long> {
    List<Consent> findByUserId(Long userId);
    Optional<Consent> findFirstByUserIdAndConsentTypeOrderByAgreedAtDesc(Long userId, String consentType);
}
