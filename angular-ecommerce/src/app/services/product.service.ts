import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})

export class ProductService {
  private baseUrl = 'http://localhost:8080/api/products';
  private categoryUrl =  'http://localhost:8080/api/product-category';

  constructor(private httpClient:HttpClient) { }
  
  getProductCategories():Observable<ProductCategory[]>{
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  getProducts(url:string):Observable<Product[]>{
    return this.httpClient.get<GetResponseProducts>(url).pipe(
      map(response => response._embedded.products)
    );
  }
  
  getProductList(currentCategoryId:number): Observable<Product[]>{
    const searchUrl =  `${this.baseUrl}/search/findByCategoryId?id=${currentCategoryId}`;
    return this.getProducts(searchUrl);
  }

  searchcProduct(keyword:string):Observable<Product[]>{
    const searchUrl = this.baseUrl + '/search/findByNameContaining?name='+ keyword;
    return this.getProducts(searchUrl);
  }

  getProduct(id:number):Observable<Product>{
    const searchUrl = this.baseUrl + '/' + id;
    return this.httpClient.get<Product>(searchUrl);
  }

  getProductListByPagination(thePage:number, thePageSize:number, currentCategoryId:number): Observable<GetResponseProducts>{
    const searchUrl =  `${this.baseUrl}/search/findByCategoryId?id=${currentCategoryId}&page=${thePage}&size=${thePageSize}`;
    return  this.httpClient.get<GetResponseProducts>(searchUrl);
  }

  searchcProductByPagination(thePage:number, thePageSize:number,keyword:string):Observable<GetResponseProducts>{
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${keyword}&page=${thePage}&size=${thePageSize}`;
    return  this.httpClient.get<GetResponseProducts>(searchUrl);
  }

}

interface GetResponseProducts{
  _embedded:{
    products: Product[];
  },
  _links : {
    first:string;
    last:string;
  },
  page : {
    size : number,
    totalElements : number,
    totalPages: number,
    number : number
  }
}

interface GetResponseProductCategory  {
  _embedded:{
    productCategory: ProductCategory[];
  }
}