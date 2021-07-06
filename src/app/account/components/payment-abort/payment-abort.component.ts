import { Component, OnInit } from '@angular/core';
import { PaymentService } from '@app/service-module/payment.service';

@Component({
  selector: 'app-payment-abort',
  templateUrl: './payment-abort.component.html',
  styleUrls: ['./payment-abort.component.scss'],
})
export class PaymentAbortComponent implements OnInit {
  bookingType: any;
  constructor(private paymentService: PaymentService) {
    this.bookingType = JSON.parse(localStorage.getItem('merchant_param'));
    // this.bookingType = this.paymentService.getBookingType();
    console.log(this.bookingType);
  }

  ngOnInit() {}

  clearStorage() {
    localStorage.removeItem('merchant_param');
  }
}
