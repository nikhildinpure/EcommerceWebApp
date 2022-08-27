package com.backend.ecommerce.service;

import java.util.Set;
import java.util.UUID;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import com.backend.ecommerce.dao.CustomerRepository;
import com.backend.ecommerce.dto.Purchase;
import com.backend.ecommerce.dto.PurchaseResponse;
import com.backend.ecommerce.entity.Customer;
import com.backend.ecommerce.entity.Order;
import com.backend.ecommerce.entity.OrderItem;

@Service
public class CheckoutServiceImpl implements CheckoutService{

	private CustomerRepository customerRepository;
	
	@Autowired
	public CheckoutServiceImpl(CustomerRepository customerRepository) {
		this.customerRepository = customerRepository;
	}
	
	@Override
	@Transactional
	public PurchaseResponse placeOrder(Purchase purchase) {
		
		//retriev order from dto
		Order order = purchase.getOrder();
		
		//generate tracking number
		String orderTrackingNumber =  generateOrderTrackingNumber();
		order.setOrderTrackingNumber(orderTrackingNumber);
		
		//populate order with orderItems
		Set<OrderItem> orderItems = purchase.getOrderItems();
		orderItems.forEach(item -> order.add(item));
		
		//populate address
		order.setBillingAddress(purchase.getBillingAddress());
		order.setShippingAddress(purchase.getShippingAddress());
		
		//populate customer with order
		order.setStatus("Placed");
		
		Customer customer = purchase.getCustomer();
		
		Customer existingCustomer = this.customerRepository.findByEmail(customer.getEmail());
		
		if(null != existingCustomer) {
			customer = existingCustomer;
		}
		
		customer.addOrder(order);

		this.customerRepository.save(customer);
		
		return new PurchaseResponse(orderTrackingNumber);
	}

	private String generateOrderTrackingNumber() {
		// generate random UUID using version 4
		return UUID.randomUUID().toString();
	}

}
