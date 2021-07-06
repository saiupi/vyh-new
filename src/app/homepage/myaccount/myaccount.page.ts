import { Component, OnInit } from '@angular/core';
import { StaycationPackagesService } from '@app/service-module/staycation-packages.service';
import { environment } from '@environments/environment';
@Component({
  selector: 'app-myaccount',
  templateUrl: './myaccount.page.html',
  styleUrls: ['./myaccount.page.scss'],
})
export class MyaccountPage implements OnInit {
  userDetails: any;
  nameChange = true;
  userName: string;
  iconName: string;
  userNameShow: string;
  production = false;
  partnerBook = false;
  // noRequired: boolean = false;
  constructor(private staycationService: StaycationPackagesService) {
    this.production = environment.production;
    this.staycationService.currentpartnerBooking.subscribe((status) => {
      let partnerNameSet = JSON.parse(localStorage.getItem('partnerName'));
      if (
        partnerNameSet?.length === 0 ||
        partnerNameSet === null ||
        partnerNameSet === undefined ||
        partnerNameSet === ''
      ) {
        this.partnerBook = false;
        console.log(this.partnerBook);
      }
    });

    this.staycationService.currentpartnerAdd.subscribe((status) => {
      let partnerNameSet = JSON.parse(localStorage.getItem('partnerName'));
      if (partnerNameSet?.length > 0) {
        this.partnerBook = true;
        console.log(this.partnerBook);
      }
    });
  }
  ngOnInit() {}
}
