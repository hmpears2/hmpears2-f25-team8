package com.HomeConnectPro_hub.provider;

import org.springframework.lang.NonNull;

import java.util.List;
import java.util.Optional;

public interface ProviderService {
    Provider saveProvider(@NonNull Provider provider);
    Optional<Provider> getProviderById(@NonNull Long id);
    Optional<Provider> findByEmailAndPassword(String email, String password);
    List<Provider> findAllProviders();
    void deleteProvider(@NonNull Long id);
}