ПОЯСНИТЕЛЬНАЯ ЗАПИСКА
к проекту «Autowerkstatt — Веб-приложение для регистрации на события»

1. НАЗНАЧЕНИЕ И ЦЕЛЬ ПРОЕКТА
   Цель проекта Autowerkstatt — разработка веб-приложения для автоматизации процесса записи клиентов на ремонт
   автомобилей. Приложение позволяет:

Регистрировать и авторизовывать пользователей с разными ролями
Клиентам — создавать заявки на ремонт, просматривать свои записи
Администраторам — управлять заявками, назначать время и стоимость
Организовывать очередь работ по категориям неисправностей
Обеспечивать безопасное хранение данных

2. АРХИТЕКТУРА СИСТЕМЫ
   2.1 Компоненты системы
   Компонент Назначение Технология
   Frontend Пользовательский интерфейс Thymeleaf + Bootstrap 5
   Backend Обработка запросов и бизнес-логика Spring Boot
   База данных Хранение данных PostgreSQL
   Spring Security Безопасность и авторизация Spring Security

   2.2 Схема работы
   Пользователь → Веб-браузер → Spring Boot приложение → База данных PostgreSQL
   (Thymeleaf + Bootstrap)      (Java)                (SQL)

3. BACKEND: ОСНОВНЫЕ КОМПОНЕНТЫ
   3.1 Стек технологий
   Java 11
   Spring Boot 2.7.5
   Spring Security
   Spring Data JPA
   Thymeleaf (шаблонизатор)
   Bootstrap 5 (стили)
   PostgreSQL (база данных)

3.2 Главный класс приложения
AutowerkstattApplication.java:

@SpringBootApplication
public class AutowerkstattApplication {
   public static void main(String[] args) {
     SpringApplication.run(AutowerkstattApplication.class, args);
   }
}

3.3 Настройка базы данных
# Datasource
spring.datasource.url = jdbc:postgresql://localhost:5432/
spring.datasource.username = postgres
spring.datasource.password = postgres
spring.datasource.driverClassName = org.postgresql.Driver

# Hibernate
spring.jpa.hibernate.ddl-auto = update
spring.jpa.generate-ddl = true

4. МОДЕЛИ ДАННЫХ (JPA СУЩНОСТИ)
   public class Users {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @Column(name = "first_name")
   private String firstName;

   @Column(name = "last_name")
   private String lastName;

   @Column(name = "password")
   private String password;

   @Column(name = "tel_number")
   private Integer telNumber;

   @Column(name = "user_email")
   private String email;

   @Enumerated(EnumType.STRING)
   private Roles role;

   @Column
   private Boolean active = true;
   }
   4.2 Автомобиль (Car)
   public class Car {

   @Id
   @GeneratedValue(strategy = GenerationType.IDENTITY)
   private Long id;

   @OneToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
   private Models models;

   @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
   private Users user;

}
   4.3 Заявка на ремонт (Turn)
    public class Turn {

    @Id
    @GeneratedValue
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "notification_id", referencedColumnName = "id")
    private Notification notification;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private Status status;

    @Enumerated(EnumType.STRING)
    @Column(name = "faults")
    private Faults faults;
}

   4.4 Перечисления (Enums)
   java
   // Типы неисправностей
   public enum Faults {

    MORE("ПРОЧЕЕ"),
    HODOVKA("ХОДОВКА"),
    ELECTRICIAN("ЭЛЕКТРИКА"),
    INTERNAL_COMBUSTION_ENGINE("ДВС");

    private String translate;
}

// Статусы заявок
public enum Status {

    NEW("НОВЫЙ"),
    PENDING("В ОЖИДАНИИ"),
    QUEUE("В ОЧЕРЕДИ"),
    WORKING("В РАБОТЕ"),
    DONE("ВЫПОЛНЕННО"),
    DENIED("ОТКАЗАНО");

    private String translate;
}


// Роли пользователей
public enum Roles {

    ADMIN,
    USER

}
5. РЕПОЗИТОРИИ ДЛЯ РАБОТЫ С БАЗОЙ ДАННЫХ
   5.1 UsersRepository
   public interface UsersRepository extends JpaRepository<Users, Long> {

   Users findFirstByEmail(String email);

   Optional<Users> findByEmail(String email);
   }

   5.2 TurnRepository
   public interface TurnRepository extends JpaRepository<Turn, Long> {

   @Query(value = "select * from turn " +
   "inner join notification n on n.id = turn.notification_id " +
   "where n.faults = 'HODOVKA' and turn.status = 'QUEUE'", nativeQuery = true)
   List<Turn> findTurnByStatus();

   @Query(value = "select * from turn " +
   "inner join notification n on n.id = turn.notification_id " +
   "where n.faults = 'ELECTRICIAN' and turn.status = 'QUEUE'", nativeQuery = true)
   List<Turn> findTurnsBy();

   @Query(value = "select * from turn " +
   "inner join notification n on n.id = turn.notification_id " +
   "where n.faults = 'INTERNAL_COMBUSTION_ENGINE' and turn.status = 'QUEUE'", nativeQuery = true)
   List<Turn> findTurnAndStatus();

   @Query(value = "select * from turn " +
   "inner join notification n on n.id = turn.notification_id " +
   "where n.faults = 'MORE' and turn.status = 'QUEUE'", nativeQuery = true)
   List<Turn> findTurnByStatusAndNotification();

   @Query(value = "select * from turn " +
   "inner join notification n on n.id = turn.notification_id " +
   "where n.status in ('QUEUE', 'WORKING', 'DONE') and n.user_id = :user_id", nativeQuery = true)
   List<Turn> findTurnByStatusAndNotificationStatus(@Param(value = "user_id") Long userId);

   @Query(value = "select * from turn t " +
   "inner join notification n on n.id = t.notification_id " +
   "where t.status = 'WORKING'", nativeQuery = true)
   List<Turn> findTurnsByStatus();

   @Query(value = "select * from turn t " +
   "inner join notification n on n.id = t.notification_id " +
   "where t.status = 'DONE'", nativeQuery = true)
   List<Turn> findTurnBy();

   @Query(value = "select count(n.faults) " +
   "from turn t " +
   "inner join notification n on n.id = t.notification_id where t.id = :turn_id", nativeQuery = true)
   Integer getTurnByFaults(@Param(value = "turn_id")Long turnId);
   }
6. СЕРВИСНЫЙ СЛОЙ (БИЗНЕС-ЛОГИКА)
   6.1 UserService
   public class UsersDetailsServiceImpl implements UserDetailsService {

   @Autowired
   private UsersRepository userRepository;

   public void save(Users user) {
   this.userRepository.save(user);
   }

   @Override
   public UserDetails loadUserByUsername(String email) {
   Users user = userRepository.findFirstByEmail(email);

        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(user.getRole().name()));


        return new User(user.getEmail(), user.getPassword(), authorities);
   }

   public Users findByEmailUser(String email) {
   return userRepository.findByEmail(email)
   .orElseThrow(() -> new NoSuchFieldException("Не найден пользователь по email: " + email));
   }

   public Users findByUsersId(Long id) {
   return this.userRepository.findById(id).orElseThrow(() -> new NoSuchElementException(String.format("Нет пользователя по id: " + id)));
   }

   public List<Users> findAllAuthorizationUsers() {
   return userRepository.findAll();
   }
   }

   6.2 TurnService (основная бизнес-логика)
   @Service
   public class TurnService {

   @Autowired
   private TurnRepository turnRepository;

   public void save(Turn turn) {
   this.turnRepository.save(turn);
   }

   public Turn findById(Long turnId) {
   return this.turnRepository.findById(turnId).orElse(null);
   }

   public List<Turn> findTurnByHodovkaAndStatus() {
   return this.turnRepository.findTurnByStatus();
   }

   public List<Turn> findTurnByElectricianAndStatus() {
   return this.turnRepository.findTurnsBy();
   }

   public List<Turn> findTurnByDVSAndStatus() {
   return this.turnRepository.findTurnAndStatus();
   }

   public List<Turn> findTurnByMoreAndStatus() {
   return this.turnRepository.findTurnByStatusAndNotification();
   }

   public List<Turn> findTurnByStatusAndUser(Long userId) {
   return this.turnRepository.findTurnByStatusAndNotificationStatus(userId);
   }

   public List<Turn> findTurnByStatusWorking() {
   return this.turnRepository.findTurnsByStatus();
   }

   public List<Turn> findTurnByStatusDone() {
   return this.turnRepository.findTurnBy();
   }

   public Integer findTurnByFaultsCount(Long turnId) {
   return this.turnRepository.getTurnByFaults(turnId);
   }
   }


   
7. КОНТРОЛЛЕРЫ (ОБРАБОТКА HTTP-ЗАПРОСОВ)
   7.1 UsersController (регистрация и вход)
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

11. ИНСТРУКЦИЯ ПО ЗАПУСКУ

11.1 Требования
Java 11 или выше
Maven 3.6+
PostgreSQL 12+
Браузер (Chrome, Firefox, Edge)

12. ЗАКЛЮЧЕНИЕ
    Проект Autowerkstatt успешно реализует все основные функции системы записи на ремонт автомобилей:

Что реализовано:
Регистрация и авторизация пользователей с ролями CLIENT/ADMIN
Управление автомобилями — клиенты могут добавлять свои автомобили
Создание заявок — клиенты создают заявки с описанием проблемы
Оценка заявок — администраторы оценивают заявки, назначают время и стоимость
Подтверждение клиентом — двухэтапный процесс согласования
Управление очередью — администраторы видят очередь по категориям
Изменение статусов — полный жизненный цикл заявки (NEW → PENDING → QUEUE → WORKING → DONE)
Безопасность — Spring Security, BCrypt для паролей

Архитектурные особенности:
MVC паттерн — четкое разделение ответственности
Spring Data JPA — упрощенная работа с базой данных
Thymeleaf — серверный рендеринг шаблонов
Bootstrap 5 — адаптивный и современный дизайн
Транзакционность — обеспечение целостности данных

Для клиента:
Удобный интерфейс для создания заявок
Просмотр истории своих записей
Подтверждение/отклонение оценок администратора
Управление списком своих автомобилей

Для администратора:
Полный контроль над всеми заявками
Управление очередью работ
Назначение времени и стоимости
Просмотр статистики