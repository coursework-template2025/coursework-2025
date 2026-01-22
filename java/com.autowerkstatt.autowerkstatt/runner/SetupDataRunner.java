//package com.autowerkstatt.autowerkstatt.runner;
//
//import com.autowerkstatt.autowerkstatt.dao.MarkRepository;
//import com.autowerkstatt.autowerkstatt.dao.ModelsRepository;
//import com.autowerkstatt.autowerkstatt.dao.UsersRepository;
//import com.autowerkstatt.autowerkstatt.entity.Mark;
//import com.autowerkstatt.autowerkstatt.entity.Models;
//import com.autowerkstatt.autowerkstatt.entity.Users;
//import com.autowerkstatt.autowerkstatt.enums.Roles;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Component;
//
//import java.util.Arrays;
//import java.util.List;
//
//@Component
//public class SetupDataRunner implements CommandLineRunner {
//
//    @Autowired
//    private UsersRepository usersRepository;
//
//    @Autowired
//    private MarkRepository markRepository;
//
//    @Autowired
//    private ModelsRepository modelsRepository;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    @Override
//    public void run(String... args) throws Exception {
//        Mark lexus = new Mark(1L, "LEXUS");
//        Mark toyota = new Mark(2L, "TOYOTA");
//
//        markRepository.saveAll(Arrays.asList(lexus, toyota));
//
//        Models lx470 = new Models(1L, "LX 470", lexus);
//        Models gx470 = new Models(2L, "GX 470", lexus);
//        Models lx570 = new Models(3L, "LX 570", lexus);
//        Models camry70 = new Models(4L, "Camry 70", toyota);
//        Models landCruiser = new Models(5L, "Land Cruiser", toyota);
//        Models rav4 = new Models(6L, "Rav 4", toyota);
//
//        modelsRepository.saveAll(Arrays.asList(lx470, gx470, lx570, camry70, landCruiser, rav4));
//
//        Users admin = new Users(1L, "Admin", "Adminov", "admin", 777777, "testtestovvv7@gmail.com", Roles.ADMIN, true);
//        admin.setPassword(passwordEncoder.encode("admin"));
//
//        usersRepository.saveAll(List.of(admin));
//    }
//}
