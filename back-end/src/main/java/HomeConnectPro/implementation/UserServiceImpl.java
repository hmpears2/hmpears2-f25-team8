package HomeConnectPro.implementation;

import HomeConnectPro.service.UserService;
import HomeConnectPro.model.User;
import HomeConnectPro.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImpl implements UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public User saveUser(User user) {
        return userRepository.save(user);
    }
    
    @Override
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
    
    @Override
    public Optional<User> findByEmailAndPassword(String email, String password) {
        return userRepository.findByEmailAndPassword(email, password);
    }
    
    @Override
    public List<User> findAllProviders() {
        return userRepository.findByUserType("PROVIDER");
    }
    
    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}