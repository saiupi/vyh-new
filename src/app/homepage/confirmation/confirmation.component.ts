import { Analytics } from 'aws-amplify';
import { Component, OnInit } from '@angular/core';
import { UserItineraryService } from '@app/service-module/user-itinerary.service';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { FORMERR } from 'dns';
import { SubSink } from 'subsink';
import { UserProfileService } from '@app/service-module/user-profile.service';
import { BookingServiceService } from '@app/service-module/booking-service.service';
import { AwsTranscationSyncService } from '../../service-module/aws-transcation-sync.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { promise } from 'protractor';
import { PaymentService } from '@app/service-module/payment.service';
@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
})
export class ConfirmationComponent implements OnInit {
  private subs = new SubSink();
  flightCountLength: any;
  hotelCountLength: any;
  ActivityCountLength: any;
  AcivityPreferanceNew: any;
  ActivePreferance: any;
  randomActiveImage: any[];
  totalDate: any;
  TotalPersons: any;
  stars = [1, 2, 3, 4, 5];

  dailyplan: any;
  booking: any;
  hotelRooms: any;
  userName: any;
  userDetails: any;
  data: any;

  hoteldetail: any;
  flightdetail: any;
  transactions: any;
  isLoading = false;
  dayPlannerDetails: any;

  flightDetails: any;

  bookingFail = false;
  successTranscation = false;
  loadMess = false;
  partialSuccessTranscation = false;
  reloadFails = false;
  reloadPage: any;
  flightFali = false;
  flightSuccess = false;
  hotelFali = false;
  hotelSuccess = false;
  bookingStatus: any;
  polling = true;
  countTime = 0;

  sideImg0: any;
  sideImg1: any;
  sideImg2: any;
  sideImg3: any;
  activityCoverImg2: any;
  activityCoverImg: any;
  returnflightsArray: any = [];
  returnFlight: any;
  paymentDetails: any;

  showFlightPrice = false;
  flightButtonName = 'chevron-down-outline';
  transactionsDetails: any[];
  TransactionPriceDetails: any;
  constructor(
    private UserItinerary: UserItineraryService,
    private bookingService: BookingServiceService,
    private userProfileService: UserProfileService,
    private AwsTranscationSyncService: AwsTranscationSyncService,
    private router: Router,
    private paymentService: PaymentService
  ) {
    this.getTransactionsId();
  }

  async ngOnInit(): Promise<void> {
    // this.AwsTranscationSyncService.checkUser$.subscribe(
    //   (message) => (this.reloadPage = message)
    // );
    // if (this.reloadPage === true) {

    //  }
    // let transactionts = await this.bookingService.getBookingHistoryTranscation();
    // console.log('transactions', transactionts);

    this.paymentService.customPaymentGuard.next(false);
  }
  trimString(text, range) {
    return text.length > range ? text.substr(0, range - 1) + '...' : text;
  }
  async getTransactionsId() {
    try {
      this.isLoading = true;
      this.loadMess = true;
      this.transactions = await this.bookingService.getBookingHistoryTranscation();
      console.log('transactions', this.transactions);
      this.bookingStatus = this.transactions?.bookingStatus;
      this.paymentDetails = JSON.parse(this.transactions?.paymentDetails);
      console.log(this.paymentDetails);
      if (this.bookingStatus === 'completedSuccess') {
        this.completedSuccess();
        this.getIndividualDetails();
        this.bookingFail = false;
        localStorage.removeItem('TravellerInfo');
        this.UserItinerary.travelersDelete(true);
      }
      if (this.bookingStatus === 'completedFailed') {
        this.completedFailed();
        this.getIndividualDetails();
        localStorage.removeItem('TravellerInfo');
        this.UserItinerary.travelersDelete(true);
      }
      if (this.bookingStatus === 'paymentSuccess') {
        this.isLoading = true;
        this.loadMess = true;
        this.getStatus();
      }
      if (this.bookingStatus === 'paymentPending') {
        this.isLoading = true;
        this.loadMess = true;
        this.getStatus();
      }
      if (this.bookingStatus === 'partialSuccess') {
        this.partiaSuccess();
        this.getIndividualDetails();
        this.bookingFail = false;
      }

      //TODO: Filter only recent trasaction and show in confirmaiton page
      //TODO: bookingService.getCurrentTransaction()
    } catch (error) {
      console.log(error);
    }
  }
  toggleFlightPrice() {
    this.showFlightPrice = !this.showFlightPrice;
    // CHANGE THE NAME OF THE BUTTON.
    if (this.showFlightPrice) this.flightButtonName = 'chevron-up-outline';
    else this.flightButtonName = 'chevron-down-outline';
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
  getIndividualDetails() {
    this.transactionsDetails = [];
    let activityImages = [];
    let activityImages2 = [];
    let hotelImgages = [];
    let allImages = [];
    this.transactionsDetails.push(JSON.parse(this.transactions.bookingDetails));
    console.log(this.transactionsDetails, 'transactions');

    for (let i = 0; i < this.transactionsDetails.length; i++) {
      this.totalDate =
        (Date.UTC(
          new Date(this.transactionsDetails[i]?.endDate).getFullYear(),
          new Date(this.transactionsDetails[i]?.endDate).getMonth(),
          new Date(this.transactionsDetails[i]?.endDate).getDate()
        ) -
          Date.UTC(
            new Date(this.transactionsDetails[i]?.startDate).getFullYear(),
            new Date(this.transactionsDetails[i]?.startDate).getMonth(),
            new Date(this.transactionsDetails[i]?.startDate).getDate()
          )) /
        86400000;
      console.log(this.totalDate, 'totalDuration');
      this.TotalPersons =
        this.transactionsDetails[i]?.selectedTravellers.adults?.length +
        this.transactionsDetails[i]?.selectedTravellers.children?.length +
        this.transactionsDetails[i]?.selectedTravellers.infants?.length;
      console.log(this.TotalPersons, 'TotalPersons');
      if (this.transactionsDetails?.length > 0) {
        this.TransactionPriceDetails = this.transactionsDetails[0];
      }
      console.log(this.TransactionPriceDetails, 'TransactionPriceDetails');
      this.dayPlannerDetails = this.transactionsDetails[i].dayPlanner;
      this.returnflightsArray.push(
        this.transactionsDetails[i].returnPlan?.flightDetails
      );
      this.returnFlight = this.transactionsDetails[i].returnPlan;
    }

    for (let i = 0; i < this.dayPlannerDetails.length; i++) {
      for (
        let j = 0;
        j <
        this.dayPlannerDetails[i]?.hotelDetails.hotelContent?.images?.length;
        j++
      ) {
        allImages.push(
          this.dayPlannerDetails[i]?.hotelDetails.hotelContent?.images[j].url
        );
        hotelImgages.push(
          this.dayPlannerDetails[i]?.hotelDetails.hotelContent?.images[j].url
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
    for (let i = 0; i < this.dayPlannerDetails?.length; i++) {
      for (
        let j = 0;
        j < this.dayPlannerDetails[i].activityDetails?.length;
        j++
      ) {
        allImages.push(
          this.dayPlannerDetails[i]?.activityDetails[j]?.coverImageUrl
        );
        activityImages.push(
          this.dayPlannerDetails[i]?.activityDetails[j]?.coverImageUrl
        );
        activityImages2.push(
          this.dayPlannerDetails[i]?.activityDetails[j]?.coverImageUrl
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
    console.log(this.dayPlannerDetails, 'transactions');
  }

  goToContact() {
    this.router.navigate([''], { queryParams: { setcard: 'true' } });
  }
  completedFailed() {
    console.log('failed');
    this.isLoading = true;
    this.bookingFail = true;
    this.UserItinerary.removeData('failed');
  }
  Dismissbookingfail() {
    this.isLoading = false;
    this.bookingFail = false;
  }
  partiaSuccess() {
    this.isLoading = true;
    this.loadMess = false;
    this.partialSuccessTranscation = true;
    localStorage.removeItem('itinerary-storage');
    sessionStorage.removeItem('timeline-Data');
    this.UserItinerary.copy();
    this.UserItinerary.removeData('delete');
    setTimeout(async () => {
      this.isLoading = false;
    }, 3000);
  }
  completedSuccess() {
    console.log('Success');

    this.isLoading = true;
    this.loadMess = false;
    this.successTranscation = true;
    localStorage.removeItem('itinerary-storage');
    sessionStorage.removeItem('timeline-Data');
    this.UserItinerary.copy();
    this.UserItinerary.removeData('delete');

    setTimeout(async () => {
      this.isLoading = false;
    }, 3000);
  }

  async getStatus() {
    setTimeout(async () => {
      this.countTime++;
      this.transactions = await this.bookingService.getBookingHistoryTranscation();
      console.log('transactions', this.transactions);
      if (
        this.bookingStatus === 'paymentPending' ||
        this.bookingStatus === 'paymentSuccess'
      ) {
        console.log(this.countTime, 'countTime');
        await this.getTransactionsId();
      }
    }, 5000);
  }

  Test_close() {
    this.router.navigate([''], { queryParams: { setcard: 'true' } });
  }

  getUserNumber(): void {
    let userDetail = JSON.parse(localStorage.getItem('user'));
    this.userName = userDetail?.username;

    this.userDetails = this.userProfileService.getUserDetails();
    console.log(this.userDetails.mobileNo, 'this.userDetails');

    let booking = this.UserItinerary.userItineraryData();
    console.log(booking, 'Itenary');

    const flightDetails = booking.dayPlanner.map((x) => x.flightDetails);

    let flightsNotNull = flightDetails.filter(function (x) {
      return x !== undefined || null;
    });

    var newArrayFlights = flightsNotNull.filter(
      (value) => JSON.stringify(value) !== '{}'
    );

    console.log(newArrayFlights, 'newArrayFlights');

    let flightdata = [];
    for (let i = 0; i < newArrayFlights.length; i++) {
      this.flightdetail = {
        areaCode: '415',
        countryCode: '01',
        firstName: '',
        lastName: 'adultname',
        title: 'Mr<br>Mr',
        emailId: 'john@gmail.com',
        mobileNumber: '7338557899',
        dob: '',
        gender: 'M<br>F',
        issueCountry: 'India<br>India',
        passportExpiry: '',
        passportNumber: '',
        type: 'Public',
        isPassportMandatory: false,
        adultFlight: 1,
        childFlight: 0,
        infantFlight: 0,
        frequentFlyrNumber: '',
        adultMealPlan: '',
        childDOB: '',
        childGender: '',
        childTitle: '',
        childFirstName: '',
        childLastName: '',
        childPassportExpiryDate: '',
        childPassportNumber: '',
        childFrequestFlyrNumber: '',
        childMealPlan: '',
        infantDOB: '',

        infantGender: '',
        infantFirstName: '',
        infantLastName: '',
        infantTitle: '',
        infantMealPlan: '',
        fareSourceCode: newArrayFlights[i].fareSourceCode,
        postCode: 560061,
      };
      flightdata.push(this.flightdetail);
    }

    const hotelDetails = booking.dayPlanner.map((x) => x.hotelDetails);
    let hotelsRooms = hotelDetails.filter(function (x) {
      return x !== undefined || null;
    });
    var newArrayHotel = hotelsRooms.filter(
      (value) => JSON.stringify(value) !== '{}'
    );
    //let hotelsRooms2 = hotelsRooms.reduce((acc, val) => acc.concat(val), []);
    console.log(newArrayHotel, 'hotelDetailsPost');
    let hoteldata = [];
    for (let i = 0; i < newArrayHotel.length; i++) {
      this.hoteldetail = {
        sessionId: newArrayHotel[i].sessionId,
        productId: newArrayHotel[i].productId,
        tokenId: 'eolfFtHLCIgrDBW1b40K',
        rateBasisId: newArrayHotel[i].rateBasisId,
        clientRef: '12345',
        customerEmail: this.userName,
        customerPhone: this.userDetails.mobileNo,
        bookingNote: 'shivanote',
        paxDetails: [
          {
            roomNo: 1,
            adult: {
              title: ['Mr'],
              firstName: ['first1'],
              lastName: ['last1'],
            },
            child: {
              title: ['Mr'],
              firstName: ['first1'],
              lastName: ['last1'],
            },
          },
        ],
      };
      hoteldata.push(this.hoteldetail);
    }
    // this.subs.sink = this.bookingService
    //   .bookingDetails(flightdata, hoteldata)
    //   .subscribe((res) => {
    //     console.log(res);
    //   });
  }
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy() {
    // this.subs.unsubscribe();
  }
}
