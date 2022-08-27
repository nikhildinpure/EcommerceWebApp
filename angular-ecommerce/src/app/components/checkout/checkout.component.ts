import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { EcommerceFormServiceService } from 'src/app/services/ecommerce-form-service.service';
import { CheckOutValidators } from 'src/app/validators/check-out-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup! : FormGroup;
  totalCartPrice : number = 0.00;
  totalCartQuantity : number = 0;
  creditCardYears : number[] = [];
  creditCardMonths : number[] = [];
  countries : Country[] = [];
  shippingStates : State[] = [];
  billingStates : State[] = [];
  errorMsg : string = "";

  storage : Storage = sessionStorage;

  constructor(private formBuilder : FormBuilder ,private cartService : CartService , 
              private ecommerceFormService : EcommerceFormServiceService , private checkoutService:CheckoutService,
              private router: Router) { }

  ngOnInit(): void {

    let userEmail = JSON.parse(this.storage.getItem('userEmail') || '{}');
    if(userEmail == null || (Object.getPrototypeOf(userEmail) === Object.prototype)){
      userEmail = '';
    }

    this.checkoutFormGroup = this.formBuilder.group({
      customer : this.formBuilder.group({
        firstName: new FormControl('',[Validators.required, Validators.minLength(2), CheckOutValidators.notOnlyWhitespace]),
        lastName: new FormControl('',[Validators.required, Validators.minLength(2), CheckOutValidators.notOnlyWhitespace]),
        email: new FormControl(userEmail,[Validators.required, Validators.pattern('^[A-Za-z0-9._+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,4}$')])
      }),

      shippingAddress : this.formBuilder.group({
        street: new FormControl('',[Validators.required, Validators.minLength(2), CheckOutValidators.notOnlyWhitespace]),
        city: new FormControl('',[Validators.required, Validators.minLength(2), CheckOutValidators.notOnlyWhitespace]),
        state: new FormControl('',[Validators.required]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',[Validators.required, Validators.minLength(2), CheckOutValidators.notOnlyWhitespace]),
      }),

      billingAddress : this.formBuilder.group({
        street: new FormControl('',[Validators.required, Validators.minLength(2), CheckOutValidators.notOnlyWhitespace]),
        city: new FormControl('',[Validators.required, Validators.minLength(2), CheckOutValidators.notOnlyWhitespace]),
        state: new FormControl('',[Validators.required]),
        country: new FormControl('',[Validators.required]),
        zipCode: new FormControl('',[Validators.required, Validators.minLength(2), CheckOutValidators.notOnlyWhitespace]),
     }),

      creditCard : this.formBuilder.group({
        cardType:new FormControl('',[Validators.required]),
        nameOnCard:new FormControl('',[Validators.required, Validators.minLength(2), CheckOutValidators.notOnlyWhitespace]),
        cardNumber:new FormControl('',[Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode:new FormControl('',[Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth:[''],
        expirationYear:['']
      })
    });

    this.cartService.totalPrice.subscribe(data => {
      this.totalCartPrice = data
      console.log(this.totalCartPrice );
    })
    this.cartService.totalQuantity.subscribe(data => this.totalCartQuantity = data)

    this.cartService.computeCartTotals();
    
    this.ecommerceFormService.getCreditCardMonths().subscribe(
      data => this.creditCardMonths = data
    )

    this.ecommerceFormService.getCreditCardYears().subscribe(
      data => this.creditCardYears = data
    )

    this.ecommerceFormService.getCountries().subscribe(
      data => this.countries = data
    )

    this.errorMsg = "";

  }

  get firstName(){return this.checkoutFormGroup.get('customer.firstName');}
  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){return this.checkoutFormGroup.get('customer.email');}

  get street(){return this.checkoutFormGroup.get('shippingAddress.street');}
  get city(){return this.checkoutFormGroup.get('shippingAddress.city');}
  get state(){return this.checkoutFormGroup.get('shippingAddress.state');}
  get country(){return this.checkoutFormGroup.get('shippingAddress.country');}
  get zipCode(){return this.checkoutFormGroup.get('shippingAddress.zipCode');}

  get billingStreet(){return this.checkoutFormGroup.get('billingAddress.street');}
  get billingCity(){return this.checkoutFormGroup.get('billingAddress.city');}
  get billingState(){return this.checkoutFormGroup.get('billingAddress.state');}
  get billingCountry(){return this.checkoutFormGroup.get('billingAddress.country');}
  get billingZipCode(){return this.checkoutFormGroup.get('billingAddress.zipCode');}

  get cardType(){return this.checkoutFormGroup.get('creditCard.cardType');}
  get nameOnCard(){return this.checkoutFormGroup.get('creditCard.nameOnCard');}
  get cardNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber');}
  get securityCode(){return this.checkoutFormGroup.get('creditCard.securityCode');}
  get expirationMonth(){return this.checkoutFormGroup.get('creditCard.expirationMonth');}
  get expirationYear(){return this.checkoutFormGroup.get('creditCard.expirationYear');}

  copyShippingAddress(event: any){

    if(event.target.checked){
      this.billingStates =  this.shippingStates ;
      this.checkoutFormGroup.controls.billingAddress
                            .setValue(this.checkoutFormGroup.controls.shippingAddress.value);
    }else{
      this.checkoutFormGroup.controls.billingAddress.reset();
      this.billingStates = [];
    }

  }

  loadStatesOnCountryChange(event: any, addressType:String){
    const countryCode = event.target.value;
    console.log(addressType +" for "+ countryCode);
    if(addressType == "shipping"){
      this.ecommerceFormService.getStates(countryCode).subscribe(
        data => this.shippingStates = data
      )
    }else if(addressType == "billing"){
      this.ecommerceFormService.getStates(countryCode).subscribe(
        data => this.billingStates = data
      )
    }
   
  }

  onSubmit(){
    console.log('On Submit Checkout Form ' +this.checkoutFormGroup.invalid);

    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    //Set up Order
    let order = new Order();
    order.totalPrice = this.totalCartPrice;
    order.totalQuantity = this.totalCartQuantity;
    
    //get cart items
    const cartItems = this.cartService.cartItems;
    let orderItems :  OrderItem[] = cartItems.map(item => new OrderItem(item));

    //set up purchase which will be sent over http

    let purchase = new Purchase();
    purchase.customer =  this.checkoutFormGroup.controls['customer'].value;

    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    purchase.shippingAddress.state = this.checkoutFormGroup.get('shippingAddress')?.get('state')?.value;
    purchase.shippingAddress.state = this.checkoutFormGroup.get('shippingAddress')?.get('country')?.value;

    purchase.shippingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    purchase.shippingAddress.state = this.checkoutFormGroup.get('billingAddress')?.get('state')?.value;
    purchase.shippingAddress.state = this.checkoutFormGroup.get('billingAddress')?.get('country')?.value;

    purchase.order = order;
    purchase.orderItems = orderItems;

    //call REST service
    this.errorMsg = "";
    this.checkoutService.placeOrder(purchase).subscribe({
      next: response => {
        this.errorMsg  = `Your order has been received.\n Order tracking number: ${response.orderTrackingNumber}`;
        this.resetCart();
      },
      error: err =>{
          this.errorMsg = `There was an error: ${err.message}`;
      }
    })


  }

  resetCart() {
    // reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    
    // reset the form
    this.checkoutFormGroup.reset();

    // navigate back to the products page
    this.router.navigateByUrl("/products");
  }

}
