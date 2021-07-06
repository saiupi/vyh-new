import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingServiceService } from '@app/service-module/booking-service.service';
import { CurrentItinerary } from '@ojashub/voyaah-common';

@Component({
  selector: 'app-view-booking',
  templateUrl: './view-booking.component.html',
  styleUrls: ['./view-booking.component.scss'],
})
export class ViewBookingComponent implements OnInit {
  showFlightPrice = false;
  flightButtonName = 'chevron-down-outline';
  totalDays = 0;
  selectedBooking: CurrentItinerary;
  hotelCurrency: string;
  flightCount = 0;
  hotelCount = 0;
  activityCount = 0;
  originCity: any;
  destinationCity: any;
  ticketId: any;
  passengerDetails: any;
  today: Date = new Date();

  customTransactions: any;
  customBookingDetails: any;
  customTravelUpcoming: any = [];
  passengerShow = false;
  passengerShowEdit = false;
  previewItenaryDetails: any;
  randomActiveImage: any[];
  sideImg0: any;
  sideImg1: any;
  sideImg2: any;
  sideImg3: any;
  activityCoverImg: any;
  activityCoverImg2: any;
  paymentDetails: any;
  returnFlight: any;
  isLoading = false;
  loadMess = false;
  constructor(
    private bookingService: BookingServiceService,
    private router: Router
  ) {
    this.bookingService.customBookingRes.subscribe((res) => {
      let customindex = localStorage.getItem('customId');
      this.getCustomDetails(customindex);
    });
  }

  ngOnInit() {}
  trimString(text, range) {
    return text?.length > range ? text.substr(0, range - 1) + '...' : text;
  }

  async getCustomDetails(id) {
    this.customTransactions = [];
    this.isLoading = true;
    this.loadMess = true;
    this.customTransactions = await this.bookingService.getcustomdetailsById(
      id
    );
    this.isLoading = false;
    this.loadMess = false;
    console.log(this.customTransactions);
    this.paymentDetails = JSON.parse(this.customTransactions.paymentDetails);
    this.selectedBooking = JSON.parse(this.customTransactions.bookingDetails);
    this.returnFlight = this.selectedBooking?.returnPlan;
    this.previewItenaryDetails = this.selectedBooking?.dayPlanner;
    console.log(this.customTravelUpcoming, this.paymentDetails);

    console.log(this.selectedBooking, this.previewItenaryDetails);
    console.log(this.selectedBooking, 'customBookingDetails');
    this.totalDays =
      (Date.UTC(
        new Date(this.selectedBooking?.endDate).getFullYear(),
        new Date(this.selectedBooking?.endDate).getMonth(),
        new Date(this.selectedBooking?.endDate).getDate()
      ) -
        Date.UTC(
          new Date(this.selectedBooking?.startDate).getFullYear(),
          new Date(this.selectedBooking?.startDate).getMonth(),
          new Date(this.selectedBooking?.startDate).getDate()
        )) /
      86400000;
    console.log(this.totalDays);

    Loop1: for (let i = 0; i < this.selectedBooking?.dayPlanner?.length; i++) {
      for (
        let j = 0;
        j < this.selectedBooking?.dayPlanner[i].hotelDetails.rooms?.length;
        j++
      ) {
        if (
          this.selectedBooking?.dayPlanner[i].hotelDetails.rooms[j].currency !=
            '' ||
          this.selectedBooking?.dayPlanner[i].hotelDetails.rooms[j].currency !=
            null ||
          this.selectedBooking?.dayPlanner[i].hotelDetails.rooms[j].currency !=
            undefined
        ) {
          this.hotelCurrency = this.selectedBooking?.dayPlanner[
            i
          ].hotelDetails.rooms[j].currency;
          break Loop1;
        }
      }
    }

    //flights count
    for (let i = 0; i < this.selectedBooking?.dayPlanner?.length; i++) {
      if (this.selectedBooking?.dayPlanner[i].flightDetails.sequenceNumber) {
        this.flightCount = this.flightCount + 1;
      }
    }
    //hotels count
    for (let i = 0; i < this.selectedBooking?.dayPlanner?.length; i++) {
      if (this.selectedBooking?.dayPlanner[i].hotelDetails.sessionId) {
        this.hotelCount = this.hotelCount + 1;
      }
    }
    //Activites count
    for (let i = 0; i < this.selectedBooking?.dayPlanner?.length; i++) {
      for (
        let j = 0;
        j < this.selectedBooking?.dayPlanner[i].activityDetails?.length;
        j++
      ) {
        if (
          this.selectedBooking?.dayPlanner[i].activityDetails[j]?.grandtotal
        ) {
          this.activityCount = this.activityCount + 1;
        }
      }
    }
    let activityImages = [];
    let activityImages2 = [];
    let hotelImgages = [];
    let allImages = [];
    for (let i = 0; i < this.previewItenaryDetails?.length; i++) {
      for (
        let j = 0;
        j <
        this.previewItenaryDetails[i]?.hotelDetails.hotelContent?.images
          ?.length;
        j++
      ) {
        allImages.push(
          this.previewItenaryDetails[i]?.hotelDetails.hotelContent?.images[j]
            .url
        );
        hotelImgages.push(
          this.previewItenaryDetails[i]?.hotelDetails.hotelContent?.images[j]
            .url
        );
      }
    }
    allImages = allImages.filter((value) => JSON.stringify(value) !== '{}');
    allImages = allImages.filter((value) => JSON.stringify(value) !== '[]');

    allImages = allImages.filter(function (x) {
      return x !== undefined || null;
    });

    hotelImgages = hotelImgages.filter(
      (value) => JSON.stringify(value) !== '{}'
    );
    hotelImgages = hotelImgages.filter(
      (value) => JSON.stringify(value) !== '[]'
    );

    hotelImgages = hotelImgages.filter(function (x) {
      return x !== undefined || null;
    });
    allImages = allImages.slice(0, 4);
    hotelImgages = hotelImgages
      .sort(() => Math.random() - Math.random())
      .slice(0, 4);
    hotelImgages = hotelImgages.slice(0, 2);
    for (let i = 0; i < this.previewItenaryDetails?.length; i++) {
      for (
        let j = 0;
        j < this.previewItenaryDetails[i].activityDetails?.length;
        j++
      ) {
        allImages.push(
          this.previewItenaryDetails[i]?.activityDetails[j]?.coverImageUrl
        );
        activityImages.push(
          this.previewItenaryDetails[i]?.activityDetails[j]?.coverImageUrl
        );
        activityImages2.push(
          this.previewItenaryDetails[i]?.activityDetails[j]?.coverImageUrl
        );
      }
    }
    allImages = allImages.filter((value) => JSON.stringify(value) !== '{}');
    allImages = allImages.filter((value) => JSON.stringify(value) !== '[]');

    allImages = allImages.filter(function (x) {
      return x !== undefined || null;
    });
    activityImages = activityImages.filter(
      (value) => JSON.stringify(value) !== '{}'
    );
    activityImages = activityImages.filter(
      (value) => JSON.stringify(value) !== '[]'
    );

    activityImages = activityImages.filter(function (x) {
      return x !== undefined || null;
    });
    console.log(allImages);
    this.randomActiveImage = allImages
      .sort(() => Math.random() - Math.random())
      .slice(0, 4);
    console.log(this.randomActiveImage);
    if (this.randomActiveImage[0]?.length > 0) {
      this.sideImg0 = this.randomActiveImage[0];
    } else {
      this.sideImg0 =
        'https://voyaah-package-images-dev.s3.ap-south-1.amazonaws.com/public/about/sea.png';
    }
    if (this.randomActiveImage[1]?.length > 0) {
      this.sideImg1 = this.randomActiveImage[1];
    } else {
      this.sideImg1 =
        'https://voyaah-package-images-dev.s3.ap-south-1.amazonaws.com/public/about/Traveler2.png';
    }
    if (this.randomActiveImage[2]?.length > 0) {
      this.sideImg2 = this.randomActiveImage[2];
    } else {
      this.sideImg2 =
        'https://voyaah-package-images-dev.s3.ap-south-1.amazonaws.com/public/about/huts.png';
    }
    if (this.randomActiveImage[3]?.length > 0) {
      this.sideImg3 = this.randomActiveImage[3];
    } else {
      this.sideImg3 =
        'https://voyaah-package-images-dev.s3.ap-south-1.amazonaws.com/public/about/mountain.png';
    }

    if (activityImages?.length > 0) {
      this.activityCoverImg = activityImages[0];
    } else {
      if (hotelImgages?.length > 0) {
        this.activityCoverImg = hotelImgages[0];
      } else {
        this.activityCoverImg =
          'https://voyaah-package-images-dev.s3.ap-south-1.amazonaws.com/public/about/AboutUsBanner.png';
      }
    }
    if (activityImages2?.length >= 2) {
      this.activityCoverImg2 = activityImages[1];
    } else {
      if (hotelImgages?.length > 0) {
        this.activityCoverImg2 = hotelImgages[1];
      } else {
        this.activityCoverImg2 =
          'https://voyaah-package-images-dev.s3.ap-south-1.amazonaws.com/public/about/previewIti16-9.png';
      }
    }
  }

  FlightTickDetails() {
    this.passengerShow = !this.passengerShow;
  }
  FlightTickDetailsEdit() {
    this.passengerShowEdit = !this.passengerShowEdit;
  }

  toggleFlightPrice() {
    this.showFlightPrice = !this.showFlightPrice;

    // CHANGE THE NAME OF THE BUTTON.
    if (this.showFlightPrice) this.flightButtonName = 'chevron-up-outline';
    else this.flightButtonName = 'chevron-down-outline';
  }
  getFlightStatus(Id) {
    if (this.selectedBooking?.cancelDetails?.flightDetails?.length > 0) {
      for (
        let i = 0;
        i < this.selectedBooking?.cancelDetails?.flightDetails?.length;
        i++
      ) {
        if (Id == this.selectedBooking?.cancelDetails?.flightDetails[i].uuid) {
          return this.selectedBooking?.cancelDetails?.flightDetails[i].status;
        }
      }
    } else {
      return null;
    }
  }
  getHotelStatus(Id) {
    if (this.selectedBooking?.cancelDetails?.hotelDetails?.length > 0) {
      for (
        let i = 0;
        i < this.selectedBooking?.cancelDetails?.hotelDetails?.length;
        i++
      ) {
        if (Id == this.selectedBooking?.cancelDetails?.hotelDetails[i].uuid) {
          return this.selectedBooking?.cancelDetails?.hotelDetails[i].status;
        }
      }
    } else {
      return null;
    }
  }

  getActivityStatus(Id) {
    if (this.selectedBooking?.cancelDetails?.activityDetails?.length > 0) {
      for (
        let i = 0;
        i < this.selectedBooking?.cancelDetails?.activityDetails?.length;
        i++
      ) {
        if (
          Id ==
          this.selectedBooking?.cancelDetails?.activityDetails[i].activityInfo
            .activityId
        ) {
          return this.selectedBooking?.cancelDetails?.activityDetails[i].status;
        }
      }
    } else {
      return null;
    }
  }

  diff(start, end) {
    var startDate = new Date(start);
    var endDate = new Date(end);
    var diff = endDate.getTime() - startDate.getTime();
    var hours = Math.floor(diff / 1000 / 60 / 60);
    diff -= hours * 1000 * 60 * 60;
    var minutes = Math.floor(diff / 1000 / 60);
    if (hours < 0) hours = hours + 24;
    return (
      (hours <= 9 ? '0' : '') +
      hours +
      'h ' +
      (minutes <= 9 ? '0' : '') +
      minutes +
      'm'
    );
  }

  goToContact() {
    this.router.navigate([''], { queryParams: { setcard: 'true' } });
  }
  cancelBooking() {
    this.router.navigate([
      '/custom-cancellation/' + this.customTransactions.id,
    ]);
  }
}
