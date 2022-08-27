import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-status',
  templateUrl: './cart-status.component.html',
  styleUrls: ['./cart-status.component.css']
})
export class CartStatusComponent implements OnInit {

  totalCartPrice : number = 0.00;
  totalCartQuantity : number = 0;

  constructor(private cartService:CartService) { }

  ngOnInit(): void {
    this.updateCartStatus();
  }

  updateCartStatus(){
    this.cartService.totalPrice.subscribe(
      data => this.totalCartPrice = data
    )

    this.cartService.totalQuantity.subscribe(
      data => this.totalCartQuantity = data
    )
  }
}
