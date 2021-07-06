import { TransactionModel } from '@ojashub/voyaah-common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AwsTranscationSyncService } from '@app/service-module/aws-transcation-sync.service';
import { PaymentService } from '@app/service-module/payment.service';
type merchant_param1 = 'custom-travel' | 'staycation';
@Component({
  selector: 'app-payment-response',
  templateUrl: './payment-response.component.html',
  styleUrls: ['./payment-response.component.scss'],
})
export class PaymentResponseComponent implements OnInit {
  params: Params;
  idForTransaction: any;
  reloadPage = true;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private TransactionService: AwsTranscationSyncService,
    private paymentService: PaymentService
  ) {
    this.idForTransaction = localStorage.getItem('IdofBooking');
  }

  ngOnInit() {
    this.params = this.route.snapshot.queryParams;
    const merchant_param1 = this.params.merchant_param1 as merchant_param1;
    const order_status = this.params.order_status;
    let cancelRes = {
      merchantParam : this.params.merchant_param1,
      reason:this.params.status_message
    }
    localStorage.setItem('merchant_param', JSON.stringify(cancelRes));
    this.paymentService.setBookingType(merchant_param1)
    console.log(this.params, 'this.params');
    if (merchant_param1 === 'custom-travel') {
      if(order_status === 'Success')
      {
        this.paymentService.customPaymentGuard.next(true);
        this.router.navigateByUrl('/confirmation');
        this.TransactionService.createData(this.reloadPage);
      }
      if(order_status === 'Aborted') {
         this.router.navigateByUrl('/payment-abort');
      }
    }

    if (merchant_param1 === 'staycation') {

      if(order_status === 'Success')
      {
        this.paymentService.staycationPaymentGuard.next(true);
        this.router.navigateByUrl('/staycation-payment');
      }
      if(order_status === 'Aborted'){
        this.router.navigateByUrl('/payment-abort');
      }
    }
  }
}
