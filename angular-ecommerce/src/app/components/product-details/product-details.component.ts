import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {

  currentProduct:Product = new Product();
  previousCategoryId!:number;
  previousCatName!:string;

  constructor(private productService:ProductService, private route:ActivatedRoute, private cartService:CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getProductDetails();
    })
  }

  getProductDetails(){
    const productId = Number(this.route.snapshot.paramMap.get('prodId'));
    if(this.route.snapshot.paramMap.has('catId')){
      this.previousCategoryId = Number(this.route.snapshot.paramMap.get('catId'));
    }
    if(this.route.snapshot.paramMap.has('catName')){
      this.previousCatName = this.route.snapshot.paramMap.get('catName')!.toString();
    }
    
      this.productService.getProduct(productId).subscribe(
        data =>{
          console.log(data);
          this.currentProduct = data;
        }
      )
  }

  addToCart(selectedProduct:Product){
    console.log(selectedProduct.id + " Adding to cart");
    const selectedItem = new CartItem(selectedProduct);

    this.cartService.addToCart(selectedItem);

  }

}
