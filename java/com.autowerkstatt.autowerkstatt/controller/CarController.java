package com.autowerkstatt.autowerkstatt.controller;

import com.autowerkstatt.autowerkstatt.dto.CarDto;
import com.autowerkstatt.autowerkstatt.entity.Car;
import com.autowerkstatt.autowerkstatt.entity.Models;
import com.autowerkstatt.autowerkstatt.entity.Users;
import com.autowerkstatt.autowerkstatt.service.CarService;
import com.autowerkstatt.autowerkstatt.service.MarkService;
import com.autowerkstatt.autowerkstatt.service.ModelsService;
import com.autowerkstatt.autowerkstatt.service.UsersDetailsServiceImpl;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;
import java.util.Optional;

@Controller
public class CarController {

    @Autowired
    private ModelsService modelsService;

    @Autowired
    private MarkService markService;

    @Autowired
    private UsersDetailsServiceImpl usersDetailsService;

    @Autowired
    private CarService carService;

    @GetMapping(value = "/saveCarOpen")
    public String mainPage(Model model) {
        model.addAttribute("marksList", markService.getAllMarks());
        model.addAttribute("car", new CarDto());
        return "saveCar";
    }

    @GetMapping(value = "/getModelsCar")
    public @ResponseBody String getModels(@RequestParam Long marksId) {
        String json = null;
        List<Object[]> list = markService.getModelByMark(marksId);
        try {
            json = new ObjectMapper().writeValueAsString(list);
        } catch (JsonProcessingException exception) {
            exception.printStackTrace();
        }
        return json;
    }

    @PostMapping(value = "/addCarUser")
    public String addCar(@ModelAttribute(name = "car") CarDto carDto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Users users = usersDetailsService.findByEmailUser(auth.getName());
        Models models = modelsService.findByModelsName(carDto.getModelsName());

        Car car = new Car();
        car.setUser(users);
        car.setModels(models);
        this.carService.addCar(car);
        return "mainPageUser";
    }

    @GetMapping(value = "/getAllCarUser")
    public String getAllCarUser(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Users users = usersDetailsService.findByEmailUser(auth.getName());

        List<Car> carList = carService.getCarByUserId(users.getId());
        model.addAttribute("cars", carList);
        return "myCars";
    }

    @RequestMapping(value = "/mainPage-car", method = RequestMethod.POST)
    public String notificationReturnMainPage() {
        return "mainPageUser";
    }

}

