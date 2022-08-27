package com.backend.ecommerce.dao;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.RequestParam;

import com.backend.ecommerce.entity.Order;

@RepositoryRestResource(collectionResourceRel = "orders", path="orders")
public interface OrderRepository extends JpaRepository<Order, Long> {
	
	Page <Order> findByCustomerEmailOrderByDateCreatedDesc(@RequestParam String email, Pageable pageable);
}
