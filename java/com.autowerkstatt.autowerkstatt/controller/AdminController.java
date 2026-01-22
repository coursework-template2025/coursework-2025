package com.autowerkstatt.autowerkstatt.controller;

import com.autowerkstatt.autowerkstatt.dto.AdminResponseToRequestDto;
import com.autowerkstatt.autowerkstatt.entity.*;
import com.autowerkstatt.autowerkstatt.enums.Status;
import com.autowerkstatt.autowerkstatt.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.List;

@Controller
public class AdminController {

    @Autowired
    private CarService carService;

    @Autowired
    private EmailSenderService emailSenderService;

    @Autowired
    private UsersDetailsServiceImpl usersDetailsService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private TurnService turnService;

    @GetMapping(value = "/admin-users-records")
    public String adminResponseToRequest(Model model) {
        model.addAttribute("notifications", notificationService.getNewRequestUser());
        model.addAttribute("responseToRequest", new AdminResponseToRequestDto());
        return "adminUsersRecords";
    }

    @GetMapping(value = "/user-response")
    public ModelAndView userResponse(Long id) {
        ModelAndView modelAndView = new ModelAndView("responseUser");
        modelAndView.addObject("userResponse", notificationService.findById(id));
        return modelAndView;
    }

    @PostMapping(value = "/adminResponseToRequest")
    public String adminResponse(@ModelAttribute(name = "userResponse") AdminResponseToRequestDto adminResponseToRequestDto,
                                @RequestParam String email) {
        Notification notification = notificationService.findById(adminResponseToRequestDto.getId());
        Users users = usersDetailsService.findByEmailUser(email);

        emailSenderService.sendEmail(users.getEmail(), "Autowerkstatt", "Администратор ответил на вашу заявку, перейдите в свои записи. " +
                " Если согласны то нажмите согласиться, иначе откажитесь");

        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'hh:mm");
        try {
            notification.setDateFrom(simpleDateFormat.parse(adminResponseToRequestDto.getDateFrom()));
            notification.setDateBefore(simpleDateFormat.parse(adminResponseToRequestDto.getDateBefore()));
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
        notification.setPrice(adminResponseToRequestDto.getPrice());
        notification.setStatus(Status.PENDING);
        this.notificationService.save(notification);
        return "redirect:/admin-users-records";
    }

    @GetMapping(value = "/denied-response")
    public String denied(@RequestParam Long responseId, @RequestParam String email) {
        Notification notification = notificationService.findById(responseId);
        notification.setStatus(Status.DENIED);
        this.notificationService.save(notification);
        Users users = usersDetailsService.findByEmailUser(email);

        emailSenderService.sendEmail(users.getEmail(), "Autowerkstatt", "Ваша заявка была отменена так как мы не можем решить вашу проблему.");

        Turn turn = new Turn();
        turn.setNotification(notification);
        turn.setStatus(Status.DENIED);
        this.turnService.save(turn);
        return "redirect:/admin-users-records";
    }

    @RequestMapping(value = "/mainPage-admin", method = RequestMethod.POST)
    public String notesUserReturnMainPage() {
        return "mainPageAdmin";
    }

    @GetMapping(value = "/users-authorization")
    public String usersAuthorization(Model model) {
        List<Car> carUsers = carService.findAllAuthorizationUser();
        model.addAttribute("users", carUsers);
        return "usersAuthorization";
    }
}
