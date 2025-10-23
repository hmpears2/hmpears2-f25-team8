package HomeConnectPro.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import HomeConnectPro.model.User;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailAndPassword(String email, String password);
    List<User> findByUserType(String userType);
}