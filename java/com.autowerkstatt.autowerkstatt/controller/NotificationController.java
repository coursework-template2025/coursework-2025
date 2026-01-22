package com.autowerkstatt.autowerkstatt.controller;

import com.autowerkstatt.autowerkstatt.dto.SubmitApplicationUserFaultsDto;
import com.autowerkstatt.autowerkstatt.entity.Car;
import com.autowerkstatt.autowerkstatt.entity.Notification;
import com.autowerkstatt.autowerkstatt.entity.Turn;
import com.autowerkstatt.autowerkstatt.entity.Users;
import com.autowerkstatt.autowerkstatt.enums.Faults;
import com.autowerkstatt.autowerkstatt.enums.Status;
import com.autowerkstatt.autowerkstatt.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@Controller
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UsersDetailsServiceImpl usersDetailsService;

    @Autowired
    private CarService carService;

    @Autowired
    private TurnService turnService;

    @GetMapping(value = "/user-notification")
    public String userNotificationList(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Users users = usersDetailsService.findByEmailUser(auth.getName());

        List<Notification> notifications = notificationService.getNotificationByUserId(users.getId());
        model.addAttribute("notifications", notifications);
        return "recordsUser";
    }

    @RequestMapping(value = "/mainPage-notification", method = RequestMethod.POST)
    public String notificationReturnMainPage() {
        return "mainPageUser";
    }

    @GetMapping(value = "/submit-application-faults-hodovka")
    public String submitApplicationFaultsUserHodovka(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Users users = usersDetailsService.findByEmailUser(auth.getName());

        List<Car> carList = carService.getCarByUser(users.getId());
        model.addAttribute("carUserList", carList);
        model.addAttribute("submitApplicationUser", new SubmitApplicationUserFaultsDto());
        return "submitApplicationUserFaultsHodovka";
    }

    @PostMapping(value = "/submit-application-hodovka")
    public String submitApplicationHodovka(@ModelAttribute(name = "submitApplication") SubmitApplicationUserFaultsDto submitApplicationUserFaultsDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Users users = usersDetailsService.findByEmailUser(auth.getName());
        Car car = carService.findById(submitApplicationUserFaultsDto.getCarId());

        Notification notification = new Notification();
        notification.setUser(users);
        notification.setCar(car);
        if (car != null) {
            notification.setMark(car.getModels().getMark().getName());
            notification.setModel(car.getModels().getName());
        }
        notification.setDateTime(new Date());
        notification.setStatus(Status.NEW);
        notification.setFaults(Faults.HODOVKA);
        notification.setDescription(submitApplicationUserFaultsDto.getDescription());
        this.notificationService.save(notification);
        return "mainPageUser";
    }

    @GetMapping(value = "/submit-application-faults-DVS")
    public String submitApplicationFaultsUserDVS(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Users users = usersDetailsService.findByEmailUser(auth.getName());

        List<Car> carList = carService.getCarByUser(users.getId());
        model.addAttribute("carUserList", carList);
        model.addAttribute("submitApplicationUser", new SubmitApplicationUserFaultsDto());
        return "submitApplicationUserFaultsDVS";
    }

    @PostMapping(value = "/submit-application-DVS")
    public String submitApplicationDVS(@ModelAttribute(name = "submitApplication") SubmitApplicationUserFaultsDto submitApplicationUserFaultsDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Users users = usersDetailsService.findByEmailUser(auth.getName());
        Car car = carService.findById(submitApplicationUserFaultsDto.getCarId());

        Notification notification = new Notification();
        notification.setUser(users);
        notification.setCar(car);
        if (car != null) {
            notification.setMark(car.getModels().getMark().getName());
            notification.setModel(car.getModels().getName());
        }
        notification.setDateTime(new Date());
        notification.setStatus(Status.NEW);
        notification.setFaults(Faults.INTERNAL_COMBUSTION_ENGINE);
        notification.setDescription(submitApplicationUserFaultsDto.getDescription());
        this.notificationService.save(notification);
        return "mainPageUser";
    }

    @GetMapping(value = "/submit-application-faults-electrician")
    public String submitApplicationFaultsUserElectrician(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Users users = usersDetailsService.findByEmailUser(auth.getName());

        List<Car> carList = carService.getCarByUser(users.getId());
        model.addAttribute("carUserList", carList);
        model.addAttribute("submitApplicationUser", new SubmitApplicationUserFaultsDto());
        return "submitApplicationUserFaultsElectrician";
    }

    @PostMapping(value = "/submit-application-electrician")
    public String submitApplicationElectrician(@ModelAttribute(name = "submitApplication") SubmitApplicationUserFaultsDto submitApplicationUserFaultsDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Users users = usersDetailsService.findByEmailUser(auth.getName());
        Car car = carService.findById(submitApplicationUserFaultsDto.getCarId());

        Notification notification = new Notification();
        notification.setUser(users);
        notification.setCar(car);
        if (car != null) {
            notification.setMark(car.getModels().getMark().getName());
            notification.setModel(car.getModels().getName());
        }
        notification.setDateTime(new Date());
        notification.setStatus(Status.NEW);
        notification.setFaults(Faults.ELECTRICIAN);
        notification.setDescription(submitApplicationUserFaultsDto.getDescription());
        this.notificationService.save(notification);
        return "mainPageUser";
    }

    @GetMapping(value = "/submit-application-faults-more")
    public String submitApplicationFaultsUser(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Users users = usersDetailsService.findByEmailUser(auth.getName());

        List<Car> carList = carService.getCarByUser(users.getId());
        model.addAttribute("carUserList", carList);
        model.addAttribute("submitApplicationUser", new SubmitApplicationUserFaultsDto());
        return "submitApplicationUserFaultsMore";
    }

    @PostMapping(value = "/submit-application-more")
    public String submitApplicationMore(@ModelAttribute(name = "submitApplication") SubmitApplicationUserFaultsDto submitApplicationUserFaultsDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Users users = usersDetailsService.findByEmailUser(auth.getName());
        Car car = carService.findById(submitApplicationUserFaultsDto.getCarId());

        Notification notification = new Notification();
        notification.setUser(users);
        notification.setCar(car);
        if (car != null) {
            notification.setMark(car.getModels().getMark().getName());
            notification.setModel(car.getModels().getName());
        }
        notification.setDateTime(new Date());
        notification.setStatus(Status.NEW);
        notification.setFaults(Faults.MORE);
        notification.setDescription(submitApplicationUserFaultsDto.getDescription());
        this.notificationService.save(notification);
        return "mainPageUser";
    }

    @GetMapping(value = "/get-my-notes")
    public String getAllNotesUser(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Users users = usersDetailsService.findByEmailUser(auth.getName());

        List<Notification> notesUser = notificationService.getNotesUser(users.getId());
        model.addAttribute("notesUser", notesUser);
        return "notesUser";
    }

    @GetMapping(value = "/agree")
    public String agree(@RequestParam Long notificationId) {
        Notification notification = notificationService.findById(notificationId);
        notification.setStatus(Status.QUEUE);
        this.notificationService.save(notification);

        Turn turn = new Turn();
        turn.setNotification(notification);
        turn.setStatus(Status.QUEUE);
        turn.setFaults(notification.getFaults());
        this.turnService.save(turn);
        return "redirect:/get-my-notes";
    }

    @GetMapping(value = "/denied")
    public String denied(@RequestParam Long notificationId) {
        Notification notification = notificationService.findById(notificationId);
        notification.setStatus(Status.DENIED);
        this.notificationService.save(notification);

        Turn turn = new Turn();
        turn.setNotification(notification);
        turn.setStatus(Status.DENIED);
        this.turnService.save(turn);
        return "redirect:/get-my-notes";
    }

    @RequestMapping(value = "/mainPage-note", method = RequestMethod.POST)
    public String notesUserReturnMainPage() {
        return "mainPageUser";
    }
}
