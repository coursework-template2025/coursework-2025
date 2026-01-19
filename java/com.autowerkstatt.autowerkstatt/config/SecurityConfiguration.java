package com.autowerkstatt.autowerkstatt.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import javax.sql.DataSource;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration extends WebSecurityConfigurerAdapter {

    @Autowired
    private DataSource dataSource;

    @Value("${spring.queries.users-query}")
    private String usersQuery;

    @Value("${spring.queries.roles-query}")
    private String rolesQuery;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Autowired
    CustomizeAuthenticationSuccessHandler customizeAuthenticationSuccessHandler;

    @Override
    protected void configure(AuthenticationManagerBuilder auth)
            throws Exception {
        auth.
                jdbcAuthentication()
                .usersByUsernameQuery(usersQuery)
                .authoritiesByUsernameQuery(rolesQuery)
                .dataSource(dataSource)
                .passwordEncoder(passwordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http.
                authorizeRequests()
                .antMatchers("/", "/login", "/register", "/registration", "/forgotPassword", "/passwordRecoveryEmail", "/newPasswordUser").permitAll()
                .antMatchers("/mainPageUser", "/userDropDownList",
                        "/user-notification", "/mainPage-notification", "/submit-application-faults-hodovka", "/submit-application-hodovka", "/submit-application-faults-DVS", "/submit-application-DVS", "/submit-application-faults-electrician", "/submit-application-electrician", "/submit-application-faults-more", "/submit-application-more", "/get-my-notes", "/agree", "/denied", "/mainPage-note",
                        "/saveCarOpen", "/getModelsCar", "/addCarUser", "/getAllCarUser", "/mainPage-car",
                        "/mainPage-user", "/turn-works").authenticated()
                .antMatchers( "/mainPageUser", "/user-notification", "/saveCarOpen", "/getModelsCar", "/addCarUser").hasAnyAuthority("USER")
                .antMatchers("/mainPageAdmin", "/admin-users-records", "/user-response", "/adminResponseToRequest", "/mainPage-admin", "users-authorization",
                        "/return-page-master", "/addMasterForm", "/saveMaster", "/show-update-master-form", "/not-active-master",
                        "/turn-hodovka", "/turn-electrician", "/turn-DVS", "/turn-more", "/mainPage-turn").hasAnyAuthority("ADMIN")
                .and().csrf().disable()
                .formLogin().successHandler(customizeAuthenticationSuccessHandler)
                .loginPage("/login").failureUrl("/login?error=true")
                .usernameParameter("email")
                .passwordParameter("password")
                .and().logout()
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/").and().exceptionHandling()
                .accessDeniedPage("/access-denied");
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        super.configure(web);
        web.ignoring().antMatchers("/resources/**", "/templates/**", "/static/**", "registration","static/js/**");
    }

    @Autowired
    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception {
        auth
                .inMemoryAuthentication()
                .withUser("admin").password("{noop}admin").roles("ADMIN");
    }
}
