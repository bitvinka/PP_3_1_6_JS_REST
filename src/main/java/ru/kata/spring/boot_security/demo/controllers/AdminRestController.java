package ru.kata.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.models.Role;
import ru.kata.spring.boot_security.demo.models.User;
import ru.kata.spring.boot_security.demo.services.RoleService;
import ru.kata.spring.boot_security.demo.services.UserService;

import java.security.Principal;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
public class AdminRestController {

    private final UserService userService;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AdminRestController(UserService userService, RoleService roleService, PasswordEncoder passwordEncoder) {
        this.userService = userService;
        this.roleService = roleService;
        this.passwordEncoder = passwordEncoder;
    }


    @GetMapping("/principal")
    public ResponseEntity<User> showUser(Principal principal) {
        return new ResponseEntity<>( userService.findByUserName(principal.getName()).get(), HttpStatus.OK);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userService.getUsers(), HttpStatus.OK);
    }

    @GetMapping("/roles")
    public ResponseEntity<Collection<Role>> getAllRoles() {
        return new ResponseEntity<>(roleService.getRoles(), HttpStatus.OK);
    }


    @PostMapping("/users")
    public ResponseEntity<User> addUser(@RequestBody User user) {
        Set<Role> set = user.getRoles().stream()
                .map(Role::getName)
                .flatMap(name -> roleService.getRoleByName(name).stream())
                .collect(Collectors.toSet());
        user.setRoles(set);
        userService.addUser(user);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PutMapping("/users")
    public ResponseEntity<User> updateUser(@RequestBody User user) {
        Optional<User> optUser = userService.getUserById(user.getId());

        if (optUser.isPresent() && (!user.getPassword().equals(optUser.get().getPassword()))) {
            user.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        Set<Role> set = user.getRoles().stream()
                .map(Role::getName)
                .flatMap(name -> roleService.getRoleByName(name).stream())
                .collect(Collectors.toSet());
        user.setRoles(set);
        userService.updateUser(user);
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") Long id) {
        userService.removeUser(id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}