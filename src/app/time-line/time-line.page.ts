import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import {
  MenuController,
  AngularDelegate,
  ModalController,
} from '@ionic/angular';
import { DestinationsApisService } from './destinations-apis.service';
import { UserItineraryService } from '@app/service-module/user-itinerary.service';
import { DayPlanner } from '@ojashub/voyaah-common';
import { Router } from '@angular/router';
import { UserProfileService } from '@app/service-module/user-profile.service';
import { LoginComponent } from '@app/account/components/login.component';
import { ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaycationPackagesService } from '@app/service-module/staycation-packages.service';
import { TimelinePopupComponent } from './timeline-popup/timeline-popup.component';
@Component({
  selector: 'app-time-line',
  templateUrl: './time-line.page.html',
  styleUrls: ['./time-line.page.scss'],
})
export class TimeLinePage implements OnInit {
  @ViewChild('closeAddExpenseModal') closeAddExpenseModal: ElementRef;
  visableStatus: any;
  count: any;
  message: any;
  show = true;
  bookNow = true;
  BookNow1: DayPlanner;
  bookNowFlag = false;
  packageReference: string;
  userNavigate: boolean;
  partnerForm: FormGroup;
  submitted = false;
  invalidPartner = false;
  partnerNameResp: any;
  partnerView = false;
  PartnerShow = true;
  noPackage = false;
  errorMessageFlag = false;
  constructor(
    private menu: MenuController,
    private data: DestinationsApisService,
    private UserItinerary: UserItineraryService,
    private router: Router,
    private staycationService: StaycationPackagesService,
    private userProfileService: UserProfileService,
    public modalController: ModalController,
    private formBuilder: FormBuilder
  ) {
    this.data.currentVisableStatus.subscribe((x) => {
      this.visableStatus = x;
      console.log(x, 'main', this.show);
    });
    this.userProfileService.currentUserNavigate.subscribe((res) => {
      console.log(res, 'rsep');
      this.userNavigate = res;
    });
    // this.Book();
    // this.data.currentTimeLineData.subscribe((x) => {
    //   this.BookNow1 = x;
    //   console.log(this.BookNow1, UserData.dayPlanner, 'BookNow');
    // });
  }

  leftnav = [true, false, false, false, false, false];
  leftprevclick = 0;
  ngOnInit() {
    this.partnerForm = this.formBuilder.group({
      PartnerName: ['', [Validators.required, Validators.minLength(2)]],
    });
    window.onclick = (e) => {
      if (e.target) {
        this.invalidPartner = false;
        this.noPackage = false;
      }
    };

    this.Book();
    this.UserItinerary.timelineDataChange.subscribe((value) => {
      this.Book();
    });
    console.log(this.BookNow1, 'BookNow');
  }
  openFirst() {
    this.menu.enable(true, 'first');
    this.menu.open('first');
  }
  leftnavclick(leftcurrentclick) {
    this.leftnav[this.leftprevclick] = false;
    this.leftnav[leftcurrentclick] = true;
    this.leftprevclick = leftcurrentclick;
    this.menu.close('first');
    this.UserItinerary.getBooleanValue('tabs');
  }
  Book() {
    let UserData = this.UserItinerary.userItineraryData();
    this.BookNow1 = UserData.dayPlanner;
    let hotelsfound = 0;
    let activityfound = 0;
    let flightfound = 0;
    for (let i = 0; i < this.BookNow1?.length; i++) {
      if (this.BookNow1[i].hotelDetails.hotelContent?.hotelId) {
        hotelsfound = 1;
      }
      if (this.BookNow1[i].activityDetails?.length > 0) {
        activityfound = 1;
      }
      if (this.BookNow1[i].flightDetails?.isRefundable) {
        flightfound = 1;
      }
    }
    if (hotelsfound == 1 || (activityfound == 1 && flightfound == 1)) {
      this.bookNowFlag = true;
    } else {
      this.bookNowFlag = false;
    }
    let count = 0;
    this.errorMessageFlag = false;
    this.BookNow1?.forEach((element) => {
      if (
        element.date.start == null ||
        element.date.end == null ||
        element?.error == true ||
        element?.returnError == true
      ) {
        count++;
        this.errorMessageFlag = true;
      }
    });
    if (count > 0) this.bookNowFlag = false;
  }
  async routeToPreview() {
    if (this.bookNowFlag) {
      if (this.userNavigate === true) {
        this.UserItinerary.PreviewItinerary(true);
        this.packageReference = 'custom';
        this.userProfileService.navigateToTravellers.next('itinerary');
        this.UserItinerary.travelersSelect.next(true);
        localStorage.setItem(
          'packageID',
          JSON.stringify(this.packageReference)
        );
        this.UserItinerary.changeTrip(true);

        this.router.navigate(['/travellers']);
        // this.router.navigate(['/preview']);
      } else if (this.userNavigate === false) {
        const modal = await this.modalController.create({
          component: LoginComponent,
          cssClass: 'login-modal-css',
          componentProps: { value: 123 },
        });
        return await modal.present();
      }
    } else {
      console.log('add soomething');
      const modal = await this.modalController.create({
        component: TimelinePopupComponent,
        cssClass: 'TimelinePopup-modal-css',
        backdropDismiss: false,
        componentProps: {
          errorMessageFlag: this.errorMessageFlag,
        },
      });
      return await modal.present();
    }
  }
  gotohome() {
    this.router.navigateByUrl('');
  }
  navigatePreview() {
    this.UserItinerary.PreviewItinerary(true);
  }
  get f() {
    return this.partnerForm.controls;
  }
  async onSubmit() {
    this.submitted = true;
    try {
      if (this.partnerForm.invalid) {
        return;
      }
      localStorage.setItem('partnerName', this.partnerForm.value.PartnerName);
      await this.staycationService
        .getPartnerData(this.partnerForm.value.PartnerName)
        .then((res) => {
          console.log(res, 'data');
          if (res === 'Invalid Vendor') {
            this.invalidPartner = true;
          } else {
            this.getPartnerDetailsRep();
            this.router.navigateByUrl('/staycation');
          }
        });
    } catch (err) {
      console.log('Partner error submit', err);
    }
  }

  getPartnerDetailsRep() {
    try {
      this.partnerNameResp = this.staycationService.getpackageVenderName();
      console.log(this.partnerNameResp, 'staycationPakage');
      if (
        this.partnerNameResp?.vendorName?.length > 0 &&
        this.partnerNameResp?.travelPackages?.length > 0
      ) {
        this.partnerView = true;
        this.PartnerShow = false;
        this.closeAddExpenseModal.nativeElement.click();
      }
    } catch (err) {
      console.log(err);
    }
  }
}
