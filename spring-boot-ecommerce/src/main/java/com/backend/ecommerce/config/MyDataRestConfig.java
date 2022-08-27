package com.backend.ecommerce.config;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.metamodel.EntityType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.util.pattern.PathPattern;

import com.backend.ecommerce.entity.Country;
import com.backend.ecommerce.entity.Order;
import com.backend.ecommerce.entity.Product;
import com.backend.ecommerce.entity.ProductCategory;
import com.backend.ecommerce.entity.State;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {
	
	@Value("${allowed.origins}")
	private String[] theAllowedOrigins;
	
	private EntityManager entityManager;
	
	@Autowired
	public MyDataRestConfig(EntityManager theEntityManager) {
		entityManager = theEntityManager;
	}

	@Override
	public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
		
		RepositoryRestConfigurer.super.configureRepositoryRestConfiguration(config, cors);
		
		HttpMethod[] theUnsupportedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE, HttpMethod.PATCH};
		
		//disable HTTP put , post, delete for product and product category, this makes them readonly 
		this.restrictActions(config, Product.class, theUnsupportedActions);
		this.restrictActions(config, ProductCategory.class, theUnsupportedActions);
		this.restrictActions(config, Country.class, theUnsupportedActions);
		this.restrictActions(config, State.class, theUnsupportedActions);
		this.restrictActions(config, Order.class, theUnsupportedActions);
		
		//call internal helper method to expose Ids	
		exposeIds(config);
		
		//configure cors mapping
		cors.addMapping(config.getBasePath()+"/**").allowedOrigins(theAllowedOrigins);
		
	}
	
	private void restrictActions(RepositoryRestConfiguration config, Class<?> className, HttpMethod[] theUnsupportedActions) {
		config.getExposureConfiguration()
		.forDomainType(className)
		.withItemExposure((metadata, httpsMethods)-> httpsMethods.disable(theUnsupportedActions))
		.withCollectionExposure((metadata, httpsMethods)-> httpsMethods.disable(theUnsupportedActions));
	}
	
	//get entity Ids of Entity tables
	private void exposeIds(RepositoryRestConfiguration config) {
		//get list of all Entity classes
		Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();
		
		//create array of entity types
		List<Class> entityClasses =  new ArrayList<>();
		
		for(EntityType et:entities) {
			entityClasses.add(et.getJavaType());
		}
		
		//expose entity ids for the array of entity types 
		Class[] domainTypes = entityClasses.toArray(new Class[0]);
		config.exposeIdsFor(domainTypes);
	}

}
