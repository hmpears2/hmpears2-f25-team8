package com.HomeConnectPro_hub.provider;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProviderImplementation implements ProviderService {
    
    @Autowired
    private ProviderRepository ProviderRepository;
    
    @Override
    public Provider saveProvider(Provider provider) {
        return ProviderRepository.save(provider);
    }
    
    @Override
    public Optional<Provider> getProviderById(Long id) {
        return ProviderRepository.findById(id);
    }
    
    @Override
    public Optional<Provider> findByEmailAndPassword(String email, String password) {
        return ProviderRepository.findByEmailAndPassword(email, password);
    }
    
    @Override
    public List<Provider> findAllProviders() {
        return ProviderRepository.findByUserType("PROVIDER");
    }
    
    @Override
    public void deleteProvider(Long id) {
        ProviderRepository.deleteById(id);
    }

}