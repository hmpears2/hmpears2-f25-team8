package com.HomeConnectPro_hub.provider;

import java.util.List;
import java.util.Optional;

public interface ProviderService {
    Provider saveProvider(Provider provider);
    Optional<Provider> getProviderById(Long id);
    Optional<Provider> findByEmailAndPassword(String email, String password);
    List<Provider> findAllProviders();
    void deleteProvider(Long id);
}