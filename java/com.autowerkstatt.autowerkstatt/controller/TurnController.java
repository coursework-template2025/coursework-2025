package com.autowerkstatt.autowerkstatt.controller;

import com.autowerkstatt.autowerkstatt.dto.TurnDto;
import com.autowerkstatt.autowerkstatt.entity.Turn;
import com.autowerkstatt.autowerkstatt.entity.Users;
import com.autowerkstatt.autowerkstatt.enums.Faults;
import com.autowerkstatt.autowerkstatt.enums.Status;
import com.autowerkstatt.autowerkstatt.service.EmailSenderService;
import com.autowerkstatt.autowerkstatt.service.TurnService;
import com.autowerkstatt.autowerkstatt.service.UsersDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;

@Controller
public class TurnController {

    @Autowired
    private TurnService turnService;

    @Autowired
    private UsersDetailsServiceImpl usersDetailsService;

    @Autowired
    private EmailSenderService emailSenderService;

    @GetMapping(value = "/turn-hodovka")
    public String turnHodovka(Model model) {
        List<Turn> turnList = turnService.findTurnByHodovkaAndStatus();
        model.addAttribute("turnHodovka", turnList);
        return "turnHodovka";
    }

    @GetMapping(value = "/turn-electrician")
    public String turnElectrician(Model model) {
        List<Turn> turnList = turnService.findTurnByElectricianAndStatus();
        model.addAttribute("turnElectrician", turnList);
        return "turnElectrician";
    }

    @GetMapping(value = "/turn-DVS")
    public String turnDVS(Model model) {
        List<Turn> turnList = turnService.findTurnByDVSAndStatus();
        model.addAttribute("turnDVS", turnList);
        return "turnDVS";
    }

    @GetMapping(value = "/turn-more")
    public String turnMore(Model model) {
        List<Turn> turnList = turnService.findTurnByMoreAndStatus();
        model.addAttribute("turnMore", turnList);
        return "turnMore";
    }

    @GetMapping(value = "/turn-works")
    public String turnWorks(Model model) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        Users users = usersDetailsService.findByEmailUser(auth.getName());

        List<Turn> turnListWorks = turnService.findTurnByStatusAndUser(users.getId());
        model.addAttribute("carTurnWork", turnListWorks);
        return "turnWorks";
    }

    @GetMapping(value = "/save-application-hodovka")
    public String saveApplicationHodovka(@RequestParam Long turnId) {
        Turn turn = turnService.findById(turnId);
        turn.setStatus(Status.WORKING);
        this.turnService.save(turn);
        return "redirect:/turn-hodovka";
    }

    @GetMapping(value = "/save-application-electrician")
    public String saveApplicationElectrician(@RequestParam Long turnId) {
        Turn turn = turnService.findById(turnId);
        turn.setStatus(Status.WORKING);
        this.turnService.save(turn);
        return "redirect:/turn-electrician";
    }

    @GetMapping(value = "/save-application-DVS")
    public String saveApplicationDVS(@RequestParam Long turnId) {
        Turn turn = turnService.findById(turnId);
        turn.setStatus(Status.WORKING);
        this.turnService.save(turn);
        return "redirect:/turn-DVS";
    }

    @GetMapping(value = "/save-application-more")
    public String saveApplicationMore(@RequestParam Long turnId) {
        Turn turn = turnService.findById(turnId);
        turn.setStatus(Status.WORKING);
        this.turnService.save(turn);
        return "redirect:/turn-more";
    }

    @GetMapping(value = "/turn-working")
    public String turnWorking(Model model) {
        List<Turn> turnList = turnService.findTurnByStatusWorking();
        model.addAttribute("turnStatusWorking", turnList);
        return "turnStatusWork";
    }

    @GetMapping(value = "/done")
    public String done(@RequestParam Long turnId) {
        Turn turn = turnService.findById(turnId);
        turn.setStatus(Status.DONE);
        this.turnService.save(turn);
        return "redirect:/turn-working";
    }

    @GetMapping(value = "/statistics")
    public String statistics(Model model) {
        List<Turn> turnList = turnService.findTurnByStatusDone();

        List<TurnDto> turnDtoList = new ArrayList<>();

        for (Turn t : turnList) {
            Integer turn = turnService.findTurnByFaultsCount(t.getId());
            TurnDto turnDto = new TurnDto();
            turnDto.setFaults(t.getFaults());
            turnDto.setNotification(t.getNotification());
            turnDto.setCount(turn);
            turnDto.setStatus(t.getStatus());
            turnDtoList.add(turnDto);
        }
        model.addAttribute("turnDone", turnDtoList);
        return "statistics";
    }

    @RequestMapping(value = "/mainPage-turn", method = RequestMethod.POST)
    public String returnMainPageAdmin() {
        return "mainPageAdmin";
    }

    @RequestMapping(value = "/mainPage-user", method = RequestMethod.POST)
    public String returnMainPageUser() {
        return "mainPageUser";
    }
}
