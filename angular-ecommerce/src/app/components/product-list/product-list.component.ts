import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products!: Product[];
  currentCategoryId!: number;
  previousCategoryId!: number;
  currentCategoryName:String="";
  searchMode!:boolean;
  previosKeyword!:string;

  thePageNumber:number=1;
  thePageSize:number=20;
  totalElements:number=0;
  totalPages:number=0;
  lastPageLink!:string;
  firstPageLink!:string;


  constructor(private productService:ProductService, private route:ActivatedRoute, private cartService:CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  listProducts(){
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
      if(this.searchMode){
        this.handleSearchProducts();
      }else{
        this.handleListProducts();
      }
  }

  handleListProducts(){
    const  hasCategoryId:boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
        this.currentCategoryId =  Number(this.route.snapshot.paramMap.get('id'));
        if(this.route.snapshot.paramMap.get('name') !== null && this.route.snapshot.paramMap.get('name') !== undefined){
          this.currentCategoryName = this.route.snapshot.paramMap.get('name')!.toString();
        }
    }else{
      this.currentCategoryId =  1;
      this.currentCategoryName = "";
    }

    if(this.currentCategoryId != this.previousCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log('currentCategoryId: '+this.currentCategoryId + ' thePageNumber: ' + this.thePageNumber);

     this.productService.getProductListByPagination(this.thePageNumber-1,this.thePageSize,this.currentCategoryId)
        .subscribe(
          this.processResult()
       );
  };

  handleSearchProducts(){
    const keyword = this.route.snapshot.paramMap.get('keyword')!.toString();

    if(keyword != this.previosKeyword){
      this.thePageNumber = 1;
    }
    this.previosKeyword = keyword;

    console.log('keyword: '+this.previosKeyword + ' thePageNumber: ' + this.thePageNumber);

    this.productService.searchcProductByPagination(this.thePageNumber-1,this.thePageSize,keyword).subscribe(
      this.processResult()
    )

  }

  processResult(){
    return (data: { _embedded: { products: Product[]; }; page: { number: number; size: number; totalElements: number; totalPages:number}; _links: { first: string; last: string; }; }) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize =  data.page.size;
      this.totalElements = data.page.totalElements;
      this.totalPages =  data.page.totalPages;
      this.firstPageLink = data._links.first;
      this.lastPageLink = data._links.last;

    }
  }

  addToCart(selectedProduct:Product){
    console.log(selectedProduct.id + " Adding to cart");
    const selectedItem = new CartItem(selectedProduct);

    this.cartService.addToCart(selectedItem);

  }


}
