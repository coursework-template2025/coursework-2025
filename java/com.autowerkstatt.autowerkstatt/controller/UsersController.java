package com.autowerkstatt.autowerkstatt.controller;

import com.autowerkstatt.autowerkstatt.dto.NewPasswordUser;
import com.autowerkstatt.autowerkstatt.entity.Token;
import com.autowerkstatt.autowerkstatt.entity.Users;
import com.autowerkstatt.autowerkstatt.enums.Roles;
import com.autowerkstatt.autowerkstatt.service.EmailSenderService;
import com.autowerkstatt.autowerkstatt.service.TokenService;
import com.autowerkstatt.autowerkstatt.service.UserService;
import com.autowerkstatt.autowerkstatt.service.UsersDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;

@Controller
public class UsersController {

    @Autowired
    private UserService userService;

    @Autowired
    private UsersDetailsServiceImpl usersDetailsService;

    @Autowired
    private TokenService tokenService;

    @Autowired
    private EmailSenderService emailSender;

    private BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String login() {
        return "login";
    }

    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public ModelAndView loginPage(@RequestParam(value = "error", required = false) String error,
                                  @RequestParam(value = "logout", required = false) String logout) {

        ModelAndView model = new ModelAndView();
        if (error != null) {
            model.addObject("error", "Почта или пароль неверны");
            model.setViewName("/login");
        }
        if (logout != null) {
            model.addObject("logout", "Logged out successfully.");
            model.setViewName("/login");
        }
        return model;
    }

    @RequestMapping(value = "/mainPageUser", method = RequestMethod.GET)
    public String mainPageUser() {
        return "mainPageUser";
    }

    @RequestMapping(value = "/register", method = RequestMethod.GET)
    public ModelAndView register() {
        ModelAndView modelAndView = new ModelAndView("registration");
        modelAndView.addObject("user", new Users());
        return modelAndView;
    }

    @PostMapping(value = "/registartion")
    public String registration(@ModelAttribute(name = "user") Users user) {
        user.setRole(Roles.USER);
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        this.usersDetailsService.save(user);
        return "login";
    }

    @GetMapping(value = "/forgotPassword")
    public String resetPasswordPage() {
        return "forgotPasswordPage";
    }

    @PostMapping(value = "/passwordRecoveryEmail")
    public ModelAndView getEmailForResetPassword(@RequestParam String email) {
        ModelAndView modelAndView = new ModelAndView("newPasswordUser");
        Users saved = usersDetailsService.findByEmailUser(email);
        Token token = tokenService.saveToken(saved, tokenService.makeToken());

        emailSender.sendEmail(saved.getEmail(), "Восстановление пароля", String.valueOf(token.getToken()));
        NewPasswordUser item = new NewPasswordUser();
        item.setUserEmail(email);
        modelAndView.addObject("reset", item);
        return modelAndView;
    }

    @PostMapping(value = "/newPasswordUser")
    public String newPassword(@ModelAttribute(name = "reset") NewPasswordUser item) {
        Users users = usersDetailsService.findByEmailUser(item.getUserEmail());
        Token byUserAndToken = tokenService.findByUserAndToken(users, item.getToken());

        users.setPassword(bCryptPasswordEncoder.encode(item.getPassword()));
        usersDetailsService.save(users);

        tokenService.deleteToken(byUserAndToken);

        return "login";
    }

    @RequestMapping(value = "/userDropDownList", method = RequestMethod.GET)
    public String populateList(Model model) {
        Users users = new Users();
        model.addAttribute("users", users);
        model.addAttribute("usersList", userService.findAll());
        return "mainPageUser";
    }


    @RequestMapping(value = "/mainPageAdmin", method = RequestMethod.GET)
    @PreAuthorize("hasRole('ADMIN')")
    public String mainPageAdmin() {
        return "mainPageAdmin";
    }
}
