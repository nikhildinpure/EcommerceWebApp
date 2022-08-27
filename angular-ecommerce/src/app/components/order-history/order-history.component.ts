import { Component, OnInit } from '@angular/core';
import { OrderHistory } from 'src/app/common/order-history';
import { OrderHistoryServiceService } from 'src/app/services/order-history-service.service';

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {

  orderHistoryList : OrderHistory[] = [];
  storage : Storage = sessionStorage;

  constructor(private orderHistoryService: OrderHistoryServiceService) { }

  ngOnInit(): void {
    this.handleOrderHistoryList();
  }

  handleOrderHistoryList() {
    let userEmail =  JSON.parse(this.storage.getItem('userEmail') || '');

    this.orderHistoryService.getOrderHistory(userEmail).subscribe(
      data => {
        this.orderHistoryList = data._embedded.orders;
      }
    )
  }

}
