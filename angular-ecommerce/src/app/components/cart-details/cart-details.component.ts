import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems:CartItem[] =[];
  totalCartPrice : number = 0.00;
  totalCartQuantity : number = 0;
  
  constructor(private cartService:CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    this.cartItems = this.cartService.cartItems;

    this.cartService.totalPrice.subscribe(data => this.totalCartPrice = data);
    this.cartService.totalQuantity.subscribe(data => this.totalCartQuantity = data);

    this.cartService.computeCartTotals();
  }

  incrementQuantity(cartItem : CartItem){
    this.cartService.addToCart(cartItem);
  }

  decrementQuantity(cartItem : CartItem){
    cartItem.quantity--;
    if( cartItem.quantity == 0)
      this.removeItem(cartItem);
    
    this.cartService.computeCartTotals();
  }

  removeItem(cartItem : CartItem){
    this.cartService.removeFromCart(cartItem);
  }

}
