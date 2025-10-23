package HomeConnectPro.service;

import HomeConnectPro.model.User;
import java.util.List;
import java.util.Optional;

public interface UserService {
    User saveUser(User user);
    Optional<User> findById(Long id);
    Optional<User> findByEmailAndPassword(String email, String password);
    List<User> findAllProviders();
    void deleteUser(Long id);
}