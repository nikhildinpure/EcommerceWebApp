import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
 
  cartItems:CartItem[] =[];
  totalPrice: Subject<number> = new BehaviorSubject<number>(0);//Subject<number>();
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0); //new Subject<number>();

  storage : Storage  = localStorage;

  constructor() { 
    let data = JSON.parse(this.storage.getItem('cartItems')  || '{}');
    
    if(data != null &&  !(Object.getPrototypeOf(data) === Object.prototype)){
      this.cartItems = data;
      this.computeCartTotals();
    }
  }

  persistCartItems(){
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  addToCart(currentCartItem:CartItem){
    let isExist = false;
    for (let index = 0; index < this.cartItems.length; index++) {
      const item = this.cartItems[index];
      if(item.id == currentCartItem.id){
        this.cartItems[index].quantity = item.quantity+1;
        isExist = true;
        break;
      }
    }
    
    if(!isExist){
      this.cartItems.push(currentCartItem);
    }
    
    this.computeCartTotals();

  }

  removeFromCart(CartItem: CartItem) {
    const itemIndex = this.cartItems.findIndex( item => item.id == CartItem.id);
    if(itemIndex > -1){
      this.cartItems.splice(itemIndex,1);
      this.computeCartTotals();
    }
  }

  computeCartTotals(){
    let totalPriceValue : number = 0.00;
    let totalQuantityValues : number = 0;

    for(let item of this.cartItems){
      totalPriceValue += item.quantity * item.unitPrice;
      totalQuantityValues += item.quantity;
    }
    console.log(totalPriceValue.toFixed(2)+'::'+totalQuantityValues);
    
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValues);

    this.persistCartItems();

  }

}
