package HomeConnectPro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import HomeConnectPro.model.Provider;
import java.util.List;
import java.util.Optional;

public interface ProviderRepository extends JpaRepository<Provider, Long> {
    Optional<Provider> findByEmailAndPassword(String email, String password);
    List<Provider> findByUserType(String userType);
}