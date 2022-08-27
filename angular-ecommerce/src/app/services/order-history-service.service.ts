import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryServiceService {

  private orderUrl = "http://localhost:8080/api/orders";

  constructor(private httpClient: HttpClient) { }

  getOrderHistory(email:string): Observable<GetResponseOrderHistory> {
    const orderHistoryUrl = this.orderUrl + "/search/findByCustomerEmailOrderByDateCreatedDesc?email=" + email;
    return this.httpClient.get<GetResponseOrderHistory>(orderHistoryUrl);
  }
}


interface GetResponseOrderHistory{
  _embedded : {
    orders: []
  }
}