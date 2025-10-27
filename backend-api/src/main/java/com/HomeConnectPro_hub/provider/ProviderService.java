package HomeConnectPro.service;

import HomeConnectPro.model.Provider;
import java.util.List;
import java.util.Optional;

public interface ProviderService {
    Provider saveProvider(Provider provider);
    Optional<Provider> findById(Long id);
    Optional<Provider> findByEmailAndPassword(String email, String password);
    List<Provider> findAllProviders();
    void deleteProvider(Long id);
}