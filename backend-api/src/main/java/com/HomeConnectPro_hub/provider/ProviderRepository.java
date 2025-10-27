package com.HomeConnectPro_hub.provider;

import org.springframework.data.jpa.repository.JpaRepository;
import com.HomeConnectPro_hub.provider.Provider;
import java.util.List;
import java.util.Optional;

public interface ProviderRepository extends JpaRepository<Provider, Long> {
    Optional<Provider> findByEmailAndPassword(String email, String password);
    List<Provider> findByUserType(String userType);
    Optional<Provider> findByEmail(String email);
    List<Provider> findByActiveTrue();
}