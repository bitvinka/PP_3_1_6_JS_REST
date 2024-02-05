package ru.kata.spring.boot_security.demo.dao;

import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class UserDaoImp implements UserDao {
    @PersistenceContext
    private EntityManager em;
    private final RoleDao roleDao;
    private final PasswordEncoder passwordEncoder;

    public UserDaoImp(RoleDao roleDao, @Lazy PasswordEncoder passwordEncoder) {
        this.roleDao = roleDao;
        this.passwordEncoder = passwordEncoder;
    }


    @Override
    public List<User> getUsers() {
        return em.createQuery("from users", User.class).getResultList();
    }

    @Override
    public boolean addUser(User user) {
        if (!(user.getRoles() instanceof Set)) {
            user.setRoles(rolesUser(user));
        }
        em.persist(user);
        return true;
    }

    @Override
    public Optional<User> getUserById(Long id) {
        return em.createQuery("select u from users u JOIN FETCH u.roles where u.id =:userId", User.class)
                .setParameter("userId", id)
                .getResultList()
                .stream()
                .findFirst();
    }

    @Override
    public void removeUser(Long id) {
        User user = em.find(User.class, id);
        em.remove(user);
    }

    @Override
    public void updateUser(User user) {
        Optional<User> optUser = getUserById(user.getId());
        if (optUser.isPresent() && (!user.getPassword().equals(optUser.get().getPassword()))) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        user.setRoles(rolesUser(user));
        em.merge(user);

    }

    @Override
    public Optional<User> findByUserName(String userName) {
        return em.createQuery("select u from users u JOIN FETCH u.roles where u.userName =:userName", User.class)
                .setParameter("userName", userName)
                .getResultList()
                .stream()
                .findFirst();
    }

    public Set<Role> rolesUser(User user) {
        return user.getRoles().stream()
                .map(Role::getName)
                .flatMap(name -> roleDao.getRoleByName(name).stream())
                .collect(Collectors.toSet());
    }

}
