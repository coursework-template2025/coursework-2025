package com.autowerkstatt.autowerkstatt.controller;

import com.autowerkstatt.autowerkstatt.entity.Master;
import com.autowerkstatt.autowerkstatt.enums.StatusMaster;
import com.autowerkstatt.autowerkstatt.service.MasterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class MasterController {

    @Autowired
    private MasterService masterService;

    @GetMapping(value = "/page-master")
    public ModelAndView createMaster() {
        ModelAndView modelAndView = new ModelAndView("masterPage");
        modelAndView.addObject("masters", masterService.findAllMaster());
        return modelAndView;
    }

    @GetMapping(value = "/addMasterForm")
    public ModelAndView addMasterForm() {
        ModelAndView modelAndView = new ModelAndView("addMasterForm");
        Master newMaster = new Master();
        modelAndView.addObject("master", newMaster);
        return modelAndView;
    }

    @PostMapping(value = "/saveMaster")
    public String saveMaster(@ModelAttribute Master master) {
        master.setStatusMaster(StatusMaster.ACTIVE);
        this.masterService.save(master);
        return "redirect:/page-master";
    }

    @GetMapping(value = "/show-update-master-form")
    public ModelAndView showUpdateMasterForm(@RequestParam Long masterId) {
        ModelAndView modelAndView = new ModelAndView("addMasterForm");
        Master master = masterService.findById(masterId);
        modelAndView.addObject("master", master);
        return modelAndView;
    }

    @GetMapping(value = "/not-active-master")
    public String notActiveMaster(@RequestParam Long masterId) {
        Master master = masterService.findById(masterId);
        master.setStatusMaster(StatusMaster.NOT_ACTIVE);
        this.masterService.save(master);
        return "redirect:/page-master";
    }

    @RequestMapping(value = "/return-page-master", method = RequestMethod.POST)
    public String masterPageReturn() {
        return "masterPage";
    }
}
