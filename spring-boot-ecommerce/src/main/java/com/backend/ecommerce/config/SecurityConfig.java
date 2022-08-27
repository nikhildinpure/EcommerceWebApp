package com.backend.ecommerce.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

import com.okta.spring.boot.oauth.Okta;


@Configuration
public class SecurityConfig extends WebSecurityConfigurerAdapter {
	
	@Override
	protected void configure(HttpSecurity http) throws Exception {
		
		//Protect endpoint 
		http.authorizeRequests()
        .antMatchers("/api/orders/**")
        .authenticated()
        .and()
        .oauth2ResourceServer()
        .jwt(); 
		
		//add CORS filter
		http.cors();
		
		//force non empty response when not authorize
		Okta.configureResourceServer401ResponseBody(http);
		
		//Disable CSRF since we are not using cookies for session tracking
		http.csrf().disable();
		
	}
}
