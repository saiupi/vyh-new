import { Analytics } from 'aws-amplify';
import { filter } from 'rxjs/operators';
import { async } from '@angular/core/testing';
import { UserProfileDetails, DayPlanner } from '@ojashub/voyaah-common';
import { PaymentService } from './../../service-module/payment.service';
import { Component, OnInit } from '@angular/core';
import { UserItineraryService } from './../../service-module/user-itinerary.service';
import { ModalController, Platform } from '@ionic/angular';
import * as moment from 'moment';
import { LoginComponent } from '../../account/components/login.component';
import { UserProfileService } from '@app/service-module/user-profile.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { TravellersDetails } from '@ojashub/voyaah-common';
import { AwsTranscationSyncService } from '@app/service-module/aws-transcation-sync.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '@app/config.service';
import { CustomBooking } from '@ojashub/voyaah-common';
import { AccountService } from '@app/account/services/account.service';
import { DestinationsApisService } from '@app/time-line/destinations-apis.service';
import { forkJoin } from 'rxjs';
const { v1: uuidv1 } = require('uuid');
// import {AwsTranscationSyncService} from ''
@Component({
  selector: 'app-previewitenerary',
  templateUrl: './previewitenerary.component.html',
  styleUrls: ['./previewitenerary.component.scss'],
})
export class PreviewiteneraryComponent implements OnInit {
  previewItenaryDetails: any;
  fromCity: any;
  totalDate: any;
  TotalPersons: any;

  flighttotalfare: any;
  GrandTotal: number;
  userNavigate: boolean;
  GrandTotalAmount: any;
  show = false;
  buttonName = 'chevron-down-outline';
  taxTypeNames: any;
  taxTypeFilter: any;
  totalTax: string;
  equivFare: string;
  days = 'days';

  params: Params;
  payFali: any;
  failedStatus = false;
  returnFlight: any;
  isLoading = false;
  selectedTravellers: TravellersDetails = {
    adults: [],
    children: [],
    infants: [],
  };
  sourceCode: any;
  flightValid: any;
  totalData: any;
  hotelValid: any;
  PreviewItenary: any;
  newInvalidFlightarray: any;
  flt_policy_error = false;
  apiError = true;
  newInvalidHotelsarray: any;
  noItemSelect = false;
  httpOptions: any;
  travelCity: any;
  travelStartDate: any;
  userDetails: any;
  onAndroidPLatform = false;
  onIOSPlatform = false;
  packageReference: any;
  hotelisValid = false;
  flightisValid = false;
  hotelPriceTotal: any;
  hotelPriceType: any;
  hotelsArray: any = [];
  flightsArray: any = [];
  returnflightsArray: any = [];
  currencyTypeFilterTotal: any;
  flightFareTotalForAllFlights: any;
  flightTaxPriceForAllFlights: any;
  flightEquiFarePriceeForAllFlights: any;
  bothItems = false;
  onlyHotel = false;
  onlyFlight = false;
  arrivalCity: any;
  departureCity: any;
  airlinesName: any;
  totalCurrencyType: any = [];
  GrandTotalCurrency: string;
  activityPrice: any;
  activityPriceCurrency: string;
  activityCoverImg: string;
  activityCoverImg2: string;
  randomActiveImage: any[];
  sideImg0: any;
  sideImg1: any;
  sideImg2: any;
  sideImg3: any;
  activityPriceDetailsfiltered: any[];
  hotelPriceFilter: any[];
  flightFareTotalPriceFilter: any[];
  startingDate: any;
  TravellerInfo: any;
  constructor(
    private UserItinerary: UserItineraryService,
    private userProfileService: UserProfileService,
    private router: Router,
    private pay: PaymentService,
    private route: ActivatedRoute,
    public modalController: ModalController,
    public AwsTranscationSyncService: AwsTranscationSyncService,
    private http: HttpClient,
    private APIservice: ConfigService,
    private awsTranscationSyncService: AwsTranscationSyncService,
    private accountService: AccountService,
    private platform: Platform,
    private userItineraryService: UserItineraryService,
    private destinationsApisService: DestinationsApisService
  ) {
    this.TravellerInfo = JSON.parse(localStorage.getItem('TravellerInfo'));
    this.onAndroidPLatform = this.platform.is('android');
    this.onIOSPlatform = this.platform.is('ios');
    console.log(this.onAndroidPLatform);
    this.userProfileService.currentUserNavigate.subscribe((res) => {
      console.log(res, 'rsep');
      this.userNavigate = res;
    });
    this.userProfileService.faildPayment.subscribe((res) => {
      console.log(res, 'this.payFali ');
      this.payFali = res;
    });
    this.userProfileService.currentUserProfileData.subscribe((res) => {
      this.userDetails = this.userProfileService.getUserDetails();
      console.log(this.userDetails, 'userDetails');
    });
    this.UserItinerary.itineraryChanged.subscribe((r) => {
      this.selectedTravellers = this.UserItinerary.userItineraryData().selectedTravellers;
      console.log(this.selectedTravellers, 'selected travellers');
    });
    console.log(this.TravellerInfo, 'TravellerInfo');
    this.PreviewItenary = this.UserItinerary.userItineraryData();
    if (this.TravellerInfo?.checked === true) {
      const addTravellerInfo = { customDetails: this.TravellerInfo };
      Object.entries(addTravellerInfo).forEach(([key, value]) => {
        this.PreviewItenary[key] = value;
      });
    }
    this.UserItinerary.travelersInfoDelete.subscribe((res) => {
      console.log(res, ' Deletetravellers');
      if (res == true) {
        delete this.PreviewItenary.customDetails;
      }
    });

    console.log(this.PreviewItenary, 'Peview');
    // this.PreviewItenary Object.entries(add).forEach(([key,value]) => { obj[key] = value })
  }
  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = 'chevron-up-outline';
    else this.buttonName = 'chevron-down-outline';
  }

  close_pay() {
    this.payFali = false;
  }
  async ngOnInit() {
    window.onclick = (e) => {
      if (e.target) {
        this.payFali = false;
        this.hotelisValid = false;
        this.flightisValid = false;
        this.apiError = true;
        this.noItemSelect = false;
        this.bothItems = false;
      }
    };

    this.params = this.route.snapshot.queryParams;
    console.log(this.params);
    this.failedStatus = this.params.status === 'failed';

    this.selectedTravellers = this.PreviewItenary.selectedTravellers;
    console.log(this.selectedTravellers, 'selected travellers');
    this.fromCity = this.PreviewItenary.originCity.cityName;
    this.startingDate = this.PreviewItenary?.startDate;
    //Total Days

    this.totalDate =
      (Date.UTC(
        new Date(this.PreviewItenary?.endDate).getFullYear(),
        new Date(this.PreviewItenary?.endDate).getMonth(),
        new Date(this.PreviewItenary?.endDate).getDate()
      ) -
        Date.UTC(
          new Date(this.PreviewItenary?.startDate).getFullYear(),
          new Date(this.PreviewItenary?.startDate).getMonth(),
          new Date(this.PreviewItenary?.startDate).getDate()
        )) /
      86400000;

    console.log(this.totalDate, 'totalDuration');
    //Total Travelers
    this.TotalPersons =
      this.PreviewItenary.travellers.adultCount +
      this.PreviewItenary.travellers.childCount +
      this.PreviewItenary.travellers.infantCount;
    console.log(this.TotalPersons, this.flighttotalfare, 'TotalPersons');

    this.UserItinerary.currentitinerary.subscribe((res) => {
      console.log(res, 'rsep');
      this.PreviewItenary = this.UserItinerary.userItineraryData();
      this.previewItenaryDetails = this.PreviewItenary.dayPlanner;
      console.log('PreviewItenary', this.PreviewItenary);
      this.FlightsInfo();
      this.HotelInfo();
      this.ActivityInfo();
      this.Images();
      this.grandTotalOfItems();
      this.revalidating();
    });
    this.travelCity = this.PreviewItenary.dayPlanner[0].cityName;
    this.travelStartDate = this.PreviewItenary.dayPlanner[0].date.start;

    // this.randomActiveImage = [
    //   'https://voyaah-package-images-dev.s3.ap-south-1.amazonaws.com/public/about/sea.png',
    //   'https://voyaah-package-images-dev.s3.ap-south-1.amazonaws.com/public/about/Traveler2.png',
    //   'https://voyaah-package-images-dev.s3.ap-south-1.amazonaws.com/public/about/huts.png',
    //   'https://voyaah-package-images-dev.s3.ap-south-1.amazonaws.com/public/about/mountain.png',
    // ];

    console.log(
      this.travelCity,
      this.travelStartDate,
      this.previewItenaryDetails,
      this.GrandTotal,
      this.userDetails,
      'Previewtt'
    );
  }
  revalidating() {
    let FlightsValidateArray = [];

    if (this.PreviewItenary.returnPlan?.length > 0) {
      let returnFlightsDetails = {
        uuid: this.PreviewItenary.returnPlan[0]?.flightDetails?.uuid,
        fareSourceCode: this.PreviewItenary.returnPlan[0]?.flightDetails
          ?.fareSourceCode,
        arrivalCity: this.PreviewItenary.returnPlan[0]?.flightDetails
          ?.flightSegments[0].airlineInfo.arrivalCity,
        departureCity: this.PreviewItenary.returnPlan[0]?.flightDetails
          ?.flightSegments[0].airlineInfo.departureCity,
        airlineName: this.PreviewItenary.returnPlan[0]?.flightDetails
          ?.flightSegments[0].airlineInfo.name,
      };
      FlightsValidateArray.push(returnFlightsDetails);
      console.log(FlightsValidateArray);
    }
    let FlightsDetails;
    for (let i = 0; i < this.previewItenaryDetails?.length; i++) {
      for (
        let j = 0;
        j < this.previewItenaryDetails[i]?.flightDetails.flightSegments?.length;
        j++
      ) {
        this.arrivalCity = this.previewItenaryDetails[
          i
        ]?.flightDetails.flightSegments[j].airlineInfo.arrivalCity;
        this.departureCity = this.previewItenaryDetails[
          i
        ]?.flightDetails.flightSegments[j].airlineInfo.departureCity;
        this.airlinesName = this.previewItenaryDetails[
          i
        ]?.flightDetails.flightSegments[j].airlineInfo.name;
      }
    }
    for (let i = 0; i < this.previewItenaryDetails?.length; i++) {
      if (
        this.previewItenaryDetails[i]?.flightDetails?.uuid?.length > 0 &&
        this.previewItenaryDetails[i]?.flightDetails?.fareSourceCode?.length > 0
      ) {
        FlightsDetails = {
          uuid: this.previewItenaryDetails[i]?.flightDetails?.uuid,
          fareSourceCode: this.previewItenaryDetails[i]?.flightDetails
            ?.fareSourceCode,
          arrivalCity: this.arrivalCity,
          departureCity: this.departureCity,
          airlineName: this.airlinesName,
        };
      }
    }
    FlightsValidateArray.push(FlightsDetails);
    console.log(FlightsValidateArray);

    let HotelValidateArray = [];
    for (let i = 0; i < this.PreviewItenary.dayPlanner?.length; i++) {
      let hotelcode = {
        sessionId: this.PreviewItenary.dayPlanner[i]?.hotelDetails?.sessionId,
        productId: this.PreviewItenary.dayPlanner[i]?.hotelDetails?.selectedRoom
          ?.productId,
        tokenId: this.PreviewItenary.dayPlanner[i]?.hotelDetails?.tokenId,
        rateBasisId: this.PreviewItenary.dayPlanner[i]?.hotelDetails
          ?.selectedRoom?.rateBasisId,
        hotelId: this.PreviewItenary.dayPlanner[i]?.hotelDetails?.hotelContent
          ?.hotelId,
        uuid: this.PreviewItenary.dayPlanner[i]?.hotelDetails?.uuid,
        hotelCity: this.PreviewItenary.dayPlanner[i]?.hotelDetails?.hotelContent
          ?.city,
        hotelName: this.PreviewItenary.dayPlanner[i]?.hotelDetails?.hotelContent
          ?.name,
      };
      HotelValidateArray.push(hotelcode);
      HotelValidateArray = HotelValidateArray.filter(
        (value) => JSON.stringify(value) !== '{}'
      );
    }
    console.log(HotelValidateArray, 'hotelFare');
    this.totalData = {
      flights: FlightsValidateArray,
      hotels: HotelValidateArray,
    };
  }
  FlightsInfo() {
    function sum(a) {
      return (a.length && parseFloat(a[0]) + sum(a.slice(1))) || 0;
    }
    //Flights
    let flightFare = [];
    let flightTaxPrice = [];
    let flightEquiFarePrice = [];
    let currencyType = [];

    let taxType = this.previewItenaryDetails?.map(
      (h) => h.flightDetails?.fareDetails
    );
    if (taxType?.length > 0) {
      this.taxTypeFilter = taxType?.filter(function (x) {
        return x !== undefined || null;
      });
      if (this.taxTypeFilter[0]) {
        this.taxTypeNames = Object.keys(this.taxTypeFilter[0]);
      }
    }

    console.log(this.taxTypeNames, 'taxTypeNames');

    // return Flights
    this.returnFlight = this.PreviewItenary.returnPlan;
    for (let i = 0; i < this.PreviewItenary.returnPlan?.length; i++) {
      this.returnflightsArray.push(
        this.PreviewItenary.returnPlan[i]?.flightDetails
      );
      currencyType.push(
        this.PreviewItenary.returnPlan[i]?.flightDetails?.fareDetails?.totalFare
          .currencyCode
      );
      flightFare.push(
        this.PreviewItenary.returnPlan[i]?.flightDetails?.fareDetails?.totalFare
          .amount
      );
      flightTaxPrice.push(
        this.PreviewItenary.returnPlan[i]?.flightDetails?.fareDetails?.totalTax
          .amount
      );
      flightEquiFarePrice.push(
        this.PreviewItenary.returnPlan[i]?.flightDetails?.fareDetails?.equivFare
          .amount
      );
    }
    console.log(this.returnflightsArray);
    // Normal Flights
    for (let i = 0; i < this.previewItenaryDetails?.length; i++) {
      this.flightsArray.push(this.previewItenaryDetails[i]?.flightDetails);
      currencyType.push(
        this.previewItenaryDetails[i]?.flightDetails?.fareDetails?.totalFare
          .currencyCode
      );
      flightFare.push(
        this.previewItenaryDetails[i]?.flightDetails?.fareDetails?.totalFare
          .amount
      );
      flightTaxPrice.push(
        this.previewItenaryDetails[i]?.flightDetails?.fareDetails?.totalTax
          .amount
      );
      flightEquiFarePrice.push(
        this.previewItenaryDetails[i]?.flightDetails?.fareDetails?.equivFare
          .amount
      );

      this.flightsArray = this.flightsArray.filter(
        (value) => Object.keys(value).length !== 0
      );
      console.log(this.flightsArray);
      let currencyTypeFilter = currencyType.filter(function (x) {
        return x !== undefined || null;
      });
      this.flightFareTotalPriceFilter = flightFare.filter(function (x) {
        return x !== undefined || null;
      });
      let flightTaxPriceFilter = flightTaxPrice.filter(function (x) {
        return x !== undefined || null;
      });
      let flightEquiFarePriceFilter = flightEquiFarePrice.filter(function (x) {
        return x !== undefined || null;
      });

      if (currencyTypeFilter?.length > 0) {
        this.currencyTypeFilterTotal = currencyTypeFilter[0];
      }

      if (this.flightFareTotalPriceFilter?.length === 1) {
        if (
          this.flightFareTotalPriceFilter[0] == undefined ||
          this.flightFareTotalPriceFilter[0] == null
        ) {
          this.flightFareTotalForAllFlights = 0;
        } else {
          this.flightFareTotalForAllFlights = this.flightFareTotalPriceFilter[0];
        }
      } else {
        this.flightFareTotalForAllFlights = sum(
          this.flightFareTotalPriceFilter
        ).toFixed(1);
      }
      if (flightTaxPriceFilter?.length === 1) {
        if (
          flightTaxPriceFilter[0] == undefined ||
          flightTaxPriceFilter[0] == null
        ) {
          this.flightTaxPriceForAllFlights = 0;
        } else {
          this.flightTaxPriceForAllFlights = flightTaxPriceFilter[0];
        }
      } else {
        this.flightTaxPriceForAllFlights = sum(flightTaxPriceFilter).toFixed(1);
      }

      if (flightEquiFarePriceFilter?.length === 1) {
        if (
          flightEquiFarePriceFilter[0] == undefined ||
          flightEquiFarePriceFilter[0] == null
        ) {
          this.flightEquiFarePriceeForAllFlights = 0;
        } else {
          this.flightEquiFarePriceeForAllFlights = flightEquiFarePriceFilter[0];
        }
      } else {
        this.flightEquiFarePriceeForAllFlights = sum(
          flightEquiFarePriceFilter
        ).toFixed(1);
      }
      let Tax = this.taxTypeNames?.includes('totalTax');
      let Fare = this.taxTypeNames?.includes('equivFare');
      if (Tax === true) {
        this.totalTax = 'Tax';
      }
      if (Fare === true) {
        this.equivFare = 'Fare';
      }
      if (this.returnFlight?.length > 0) {
        if (this.returnFlight[0]?.flightDetails.fareDetails.totalTax) {
          this.totalTax = 'Tax';
        }
        if (this.returnFlight[0]?.flightDetails.fareDetails.equivFare) {
          this.equivFare = 'Fare';
        }
      }
      this.totalCurrencyType.push(this.currencyTypeFilterTotal);
      console.log(
        this.currencyTypeFilterTotal,
        this.flightFareTotalPriceFilter
      );
      console.log(this.flightFareTotalForAllFlights);
      console.log(this.flightTaxPriceForAllFlights);
      console.log(this.flightEquiFarePriceeForAllFlights);
    }
  }

  goToContact() {
    this.router.navigate([''], { queryParams: { setcard: 'true' } });
  }

  HotelInfo() {
    function sum(a) {
      return (a.length && parseFloat(a[0]) + sum(a.slice(1))) || 0;
    }
    //Hotels
    let hotelPrice = [];
    for (let i = 0; i < this.previewItenaryDetails?.length; i++) {
      this.hotelsArray?.push(this.previewItenaryDetails[i]?.hotelDetails);
      this.hotelsArray = this.hotelsArray.filter(
        (value) => Object.keys(value).length !== 0
      );
      console.log(this.hotelsArray);
      hotelPrice.push(
        this.previewItenaryDetails[i].hotelDetails?.selectedRoom?.netPrice
      );

      this.hotelPriceFilter = hotelPrice.filter(function (x) {
        return x !== undefined || null;
      });
      console.log(this.hotelPriceFilter);

      if (this.hotelPriceFilter?.length === 1) {
        if (
          this.hotelPriceFilter[0] == undefined ||
          this.hotelPriceFilter[0] == null
        ) {
          this.flightEquiFarePriceeForAllFlights = 0;
        } else {
          this.hotelPriceTotal = this.hotelPriceFilter[0];
        }
      } else {
        this.hotelPriceTotal = sum(this.hotelPriceFilter).toFixed(1);
      }
      this.hotelPriceType = this.previewItenaryDetails[
        i
      ].hotelDetails?.selectedRoom?.netPrice?.currency;
      this.totalCurrencyType.push(this.hotelPriceType);
      console.log(this.hotelPriceType, this.hotelPriceTotal);
    }
  }

  ActivityInfo() {
    function sum(a) {
      return (a.length && parseFloat(a[0]) + sum(a.slice(1))) || 0;
    }
    let activityPriceDetails = [];
    // let activityPriceType = [];
    for (let i = 0; i < this.previewItenaryDetails?.length; i++) {
      for (
        let j = 0;
        j < this.previewItenaryDetails[i].activityDetails?.length;
        j++
      ) {
        // activityPriceType.push(this.previewItenaryDetails[i]?.activityDetails[j]?.activityData?.originalRetailPrice.currency);
        activityPriceDetails.push(
          this.previewItenaryDetails[i]?.activityDetails[j]?.grandtotal
        );
      }
      this.activityPriceDetailsfiltered = activityPriceDetails.filter(function (
        x
      ) {
        return x !== undefined || null;
      });
      // var activityPriceTypefiltered = activityPriceType.filter(function (
      //   x
      // ) {
      //   return x !== undefined || null;
      // });
      if (this.activityPriceDetailsfiltered.length === 1) {
        if (
          this.activityPriceDetailsfiltered[0] == undefined ||
          this.activityPriceDetailsfiltered[0] == null
        ) {
          this.activityPrice = 0;
        } else {
          this.activityPrice = this.activityPriceDetailsfiltered[0];
        }
      } else {
        this.activityPrice = sum(this.activityPriceDetailsfiltered).toFixed(1);
      }
      console.log(this.activityPriceDetailsfiltered);
      console.log(this.activityPrice);
      //this.totalCurrencyType.push(this.activityPriceCurrency);
    }
  }

  Images() {
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

  grandTotalOfItems() {
    function sum(a) {
      return (a.length && parseFloat(a[0]) + sum(a.slice(1))) || 0;
    }
    this.GrandTotalAmount = [
      this.flightFareTotalForAllFlights,
      this.hotelPriceTotal?.toString(),
      this.activityPrice?.toString(),
    ];
    console.log(this.GrandTotalAmount);
    var totalCurrency = this.totalCurrencyType.filter(function (x) {
      return x !== undefined || null;
    });

    let totalCurrencyreturn = totalCurrency?.every(
      (currentval) => currentval === 'INR'
    );
    console.log(totalCurrency, totalCurrencyreturn);
    if (totalCurrencyreturn === true) {
      this.GrandTotalCurrency = 'INR';
    }
    var grandtotalfilter = this.GrandTotalAmount.filter(function (x) {
      return x !== undefined || null;
    });

    if (grandtotalfilter.length === 1) {
      this.GrandTotal = grandtotalfilter[0];
    } else {
      this.GrandTotal = sum(grandtotalfilter).toFixed(1);
    }
    console.log(this.GrandTotal);
  }

  getCommonFlights(array1, array2) {
    var common = []; // Initialize array to contain common items

    for (var i = 0; i < array1.length; i++) {
      for (var j = 0; j < array2.length; j++) {
        if (array1[i].uuid == array2[j].uuid) {
          // If item is present in both arrays
          common.push(array1[i]); // Push to common array
        }
      }
    }

    return common; // Return the common items
  }

  Test_close() {
    this.router.navigate(['/time-line']);
    this.payFali = false;
    this.hotelisValid = false;
    this.flightisValid = false;
    this.apiError = true;
    this.noItemSelect = false;
    this.bothItems = false;
  }

  trimString(text, range) {
    return text.length > range ? text.substr(0, range - 1) + '...' : text;
  }
  Network_close() {
    this.apiError = true;
  }
  flightPoicyErrorClose() {
    this.flt_policy_error = false;
  }
  navigateTimeline() {
    this.payFali = false;
    this.hotelisValid = false;
    this.flightisValid = false;
    this.apiError = true;
    this.noItemSelect = false;
    this.bothItems = false;
  }
  // getDate(date) {
  //   let startDate1 = moment(this.startingDate).utc().format('MM/DD/YYYY');
  //   let startDate2 = moment(date.start).utc().format('MM/DD/YYYY');
  //   if (startDate1 == startDate2) {
  //     return 1;
  //   } else {
  //     var diffInDays = moment(date.end).diff(moment(date.start), 'days');
  //     return diffInDays;
  //   }
  // }

  async revalidatingApi() {
    this.userProfileService.currentUserProfileData.subscribe((res) => {
      this.userDetails = this.userProfileService.getUserDetails();
      console.log(this.userDetails, 'userDetails');
    });
    const authToken = await this.accountService.getAccessToken();

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: authToken,
      }),
    };

    console.log(this.httpOptions, ' this.httpOptions');
    this.isLoading = true;
    this.http
      .post<any>(
        this.APIservice.apiUrl.revalidate,
        this.totalData,
        this.httpOptions
      )
      .subscribe({
        next: async (data) => {
          this.sourceCode = data;
          console.log(this.sourceCode, 'sourceCode');
          let flightcheckArray = this.sourceCode?.flights?.map(
            (x) => x.isValid
          );
          let hotelValidArray = this.sourceCode?.hotels?.map((x) => x.isValid);

          console.log(flightcheckArray, hotelValidArray, 'flightValid');
          if (flightcheckArray?.length === 0) {
            flightcheckArray.push('false');
          }
          if (hotelValidArray?.length === 0) {
            hotelValidArray.push('false');
          }
          this.flightValid = flightcheckArray?.every(
            (currentval) => currentval === 'true'
          );
          this.hotelValid = hotelValidArray?.every(
            (currentval) => currentval === 'true'
          );

          console.log(this.flightValid, this.hotelValid, 'this.flightValid2');
          if (
            this.sourceCode?.flights?.length === 0 &&
            this.sourceCode?.hotels?.length > 0 &&
            this.hotelValid === true
          ) {
            this.onlyHotel = true;
            this.hotelisValid = false;
            this.flightisValid = false;
            this.bothItems = false;
          }
          if (this.sourceCode?.flights?.length > 0) {
            if (this.flightValid === false) {
              this.flightisValid = true;
              this.isLoading = false;
            }
          }
          if (this.sourceCode?.hotels?.length > 0) {
            if (this.hotelValid === false) {
              this.hotelisValid = true;
              this.isLoading = false;
            }
          }
          if (
            this.sourceCode?.hotels?.length > 0 &&
            this.sourceCode?.flights?.length > 0
          ) {
            if (this.flightValid === false && this.hotelValid === false) {
              this.bothItems = true;
              this.isLoading = false;
            }
          }

          if (
            this.sourceCode?.flights?.length > 0 &&
            this.flightValid === true &&
            this.sourceCode?.hotels?.length === 0
          ) {
            this.onlyFlight = true;
          }
          if (
            this.sourceCode?.flights?.length > 0 &&
            this.flightValid === true &&
            this.sourceCode?.hotels?.length > 0 &&
            this.hotelValid === false
          ) {
            this.onlyFlight = false;
          }
          if (
            (this.flightValid === true && this.hotelValid === true) ||
            this.onlyHotel === true ||
            this.onlyFlight === true
          ) {
            const dayPlan = this.PreviewItenary.dayPlanner.slice();
            let temp = [];
            let flightPresentDestinations = [];
            dayPlan.forEach((day, index) => {
              if (day.flightDetails?.fareSourceCode) {
                temp.push(
                  this.destinationsApisService.getflightcancellationpolicy(
                    day.flightDetails.fareSourceCode
                  )
                );
                flightPresentDestinations.push(index);
              }
            });
            if (flightPresentDestinations.length > 0) {
              forkJoin(temp).subscribe(
                (res) => {
                  console.log(res);
                  flightPresentDestinations.forEach((value, index) => {
                    this.PreviewItenary.dayPlanner[
                      value
                    ].flightDetails.flightPolicies = res[index];
                  });
                  console.log(this.PreviewItenary);
                  this.isLoading = false;
                  const id = uuidv1();
                  let currentTransction: CustomBooking = {
                    id: id,
                    username: '', //updated at aws-transaction-sync.service
                    itineraryName: '',
                    bookingType: 'Booking',
                    bookingStatus: 'paymentPending',
                    travelStartDate: this.travelStartDate,
                    bookingDetails: this.PreviewItenary,
                    email: this.userDetails.email,
                    mobileNo: this.userDetails.mobileNo,
                    travelCity: this.travelCity,
                  };
                  let custdobdate: Date = this.userDetails?.dateOfBirth;
                  let custdobdatestring = custdobdate.toString();
                  console.log(custdobdatestring);
                  if (custdobdatestring?.length > 0) {
                    var timeDiff = Math.abs(
                      Date.now() - new Date(custdobdate).getTime()
                    );
                  }
                  Analytics.record({
                    name: 'Booking',
                    attributes: {
                      package: '',
                      duration:
                        this.PreviewItenary.dayPlanner[0].date.start.toString() +
                        ' to ' +
                        this.PreviewItenary.dayPlanner[0].date?.end.toString(),
                      partner: '',
                      ticketsize: (
                        this.selectedTravellers?.adults?.length +
                        this.selectedTravellers?.children?.length +
                        this.selectedTravellers?.infants?.length
                      ).toString(),
                      traveldate: this.travelStartDate?.toString(),
                      location: this.travelCity,
                      age: Math.floor(
                        timeDiff / (1000 * 3600 * 24) / 365
                      ).toString(),
                      birthday: this.userDetails?.dateOfBirth?.toString(),
                      device:
                        this.onAndroidPLatform || this.onIOSPlatform
                          ? 'mobile or tab'
                          : 'web',
                    },
                  });
                  this.awsTranscationSyncService
                    .saveTranscationData(currentTransction)
                    .then((data) => {
                      if (
                        this.onIOSPlatform == true ||
                        this.onAndroidPLatform == true
                      ) {
                        let platform = '';
                        if (this.onIOSPlatform == true) {
                          platform = 'ios';
                        } else {
                          platform = 'android';
                        }
                        this.pay.redirectToPayment(
                          currentTransction.id,
                          this.GrandTotal,
                          'INR',
                          'EN',
                          'custom-travel',
                          platform
                        );
                        console.log(
                          'PaymentResponseComponent: saveTransactionData ',
                          data
                        );
                        this.pay.customPaymentGuard.next(true);
                        this.router.navigateByUrl('/confirmation');
                      } else {
                        this.pay.redirectToPayment(
                          currentTransction.id,
                          this.GrandTotal,
                          'INR',
                          'EN',
                          'custom-travel',
                          'browser',
                          window.location.origin
                        );
                      }
                    })
                    .catch((err) => {
                      console.log('Exception in saving Trasaction: ', err);
                    });
                },
                (error) => {
                  console.log(error);
                  this.isLoading = false;
                  this.flt_policy_error = true;
                }
              );
            } else {
              this.isLoading = false;
              const id = uuidv1();
              let currentTransction: CustomBooking = {
                id: id,
                username: '', //updated at aws-transaction-sync.service
                itineraryName: '',
                bookingType: 'Booking',
                bookingStatus: 'paymentPending',
                travelStartDate: this.travelStartDate,
                bookingDetails: this.PreviewItenary,
                email: this.userDetails.email,
                mobileNo: this.userDetails.mobileNo,
                travelCity: this.travelCity,
              };
              let custdobdate: Date = this.userDetails?.dateOfBirth;
              let custdobdatestring = custdobdate.toString();
              console.log(custdobdatestring);
              if (custdobdatestring?.length > 0) {
                var timeDiff = Math.abs(
                  Date.now() - new Date(custdobdate).getTime()
                );
              }
              Analytics.record({
                name: 'Booking',
                attributes: {
                  package: '',
                  duration:
                    this.PreviewItenary.dayPlanner[0].date.start.toString() +
                    ' to ' +
                    this.PreviewItenary.dayPlanner[0].date?.end.toString(),
                  partner: '',
                  ticketsize: (
                    this.selectedTravellers?.adults?.length +
                    this.selectedTravellers?.children?.length +
                    this.selectedTravellers?.infants?.length
                  ).toString(),
                  traveldate: this.travelStartDate?.toString(),
                  location: this.travelCity,
                  age: Math.floor(
                    timeDiff / (1000 * 3600 * 24) / 365
                  ).toString(),
                  birthday: this.userDetails?.dateOfBirth?.toString(),
                  device:
                    this.onAndroidPLatform || this.onIOSPlatform
                      ? 'mobile or tab'
                      : 'web',
                },
              });
              this.awsTranscationSyncService
                .saveTranscationData(currentTransction)
                .then((data) => {
                  if (
                    this.onIOSPlatform == true ||
                    this.onAndroidPLatform == true
                  ) {
                    let platform = '';
                    if (this.onIOSPlatform == true) {
                      platform = 'ios';
                    } else {
                      platform = 'android';
                    }
                    this.pay.redirectToPayment(
                      currentTransction.id,
                      this.GrandTotal,
                      'INR',
                      'EN',
                      'custom-travel',
                      platform
                    );
                    console.log(
                      'PaymentResponseComponent: saveTransactionData ',
                      data
                    );
                    this.pay.customPaymentGuard.next(true);
                    this.router.navigateByUrl('/confirmation');
                  } else {
                    this.pay.redirectToPayment(
                      currentTransction.id,
                      this.GrandTotal,
                      'INR',
                      'EN',
                      'custom-travel',
                      'browser',
                      window.location.origin
                    );
                  }
                })
                .catch((err) => {
                  console.log('Exception in saving Trasaction: ', err);
                });
            }
          }
        },
        error: (error) => {
          console.error('PreviewIntinerary: Revalidation API: Failed!', error);
          this.isLoading = false;
          this.apiError = false;
        },
      });
  }
  async pushFlightsPolicies() {
    const dayPlan = this.PreviewItenary.dayPlanner.slice();
    let temp = [];
    let flightPresentDestinations = [];
    dayPlan.forEach((day, index) => {
      if (day.flightDetails?.fareSourceCode) {
        temp.push(
          this.destinationsApisService.getflightcancellationpolicy(
            day.flightDetails.fareSourceCode
          )
        );
        flightPresentDestinations.push(index);
      }
    });
    if (flightPresentDestinations.length > 0) {
      forkJoin(temp).subscribe(
        (res) => {
          console.log(res);
          flightPresentDestinations.forEach((value, index) => {
            this.PreviewItenary.dayPlanner[value].flightDetails.flightPolicies =
              res[index];
          });
          console.log(this.PreviewItenary);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }
  async presentLogin() {
    if (this.userNavigate === true) {
      if (
        this.selectedTravellers?.adults.length +
          this.selectedTravellers?.children.length +
          this.selectedTravellers?.infants.length >
        0
      ) {
        this.revalidatingApi();
      } else {
        this.gototravellers();
      }
    } else if (this.userNavigate === false) {
      const modal = await this.modalController.create({
        component: LoginComponent,
        cssClass: 'login-modal-css',
        componentProps: { value: 123 },
      });
      return await modal.present();
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

  gototravellers() {
    this.packageReference = 'custom';
    this.userProfileService.navigateToTravellers.next('itinerary');
    this.userProfileService.travellerSelectionData.next(true);
    this.userItineraryService.travelersSelect.next(true);
    localStorage.setItem('packageID', JSON.stringify(this.packageReference));
    this.router.navigate(['/travellers']);
  }

  cancelBooking() {
    this.router.navigate(['/custom-cancellation']);
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy(): void {
    this.PreviewItenary = null;
    this.TravellerInfo = null;
  }
}
