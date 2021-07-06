import { Analytics } from 'aws-amplify';
import { error } from 'protractor';
import { TravelPackage } from '@ojashub/voyaah-common';
import { Component, OnInit, ViewChild, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserProfileService } from '@app/service-module/user-profile.service';
import { ModalController, Platform } from '@ionic/angular';
import { LoginComponent } from '@app/account/components/login.component';
import { UserItineraryService } from '@app/service-module/user-itinerary.service';
import { TravellersDetails } from '@ojashub/voyaah-common';
import { PaymentService } from '@app/service-module/payment.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonSlides } from '@ionic/angular';
import { strict } from 'assert';
import { DestinationsApiService } from '@app/destination/destinations-api.service';
import { DateAdapter } from '@angular/material/core';
import {
  MatDateRangeSelectionStrategy,
  DateRange,
  MAT_DATE_RANGE_SELECTION_STRATEGY,
} from '@angular/material/datepicker';
import { StaycationPackagesService } from '@app/service-module/staycation-packages.service';
import { CanceltripService } from '@app/service-module/canceltrip.service';
import { AccountService } from '@app/account/services';
import { AgmMap } from '@agm/core/public-api';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { localizedString } from '@angular/compiler/src/output/output_ast';
@Injectable()
export class FiveDayRangeSelectionStrategy<D>
  implements MatDateRangeSelectionStrategy<D> {
  days = 0;
  constructor(
    private _dateAdapter: DateAdapter<D>,
    private staycationService: StaycationPackagesService
  ) {
    this.days = Number(this.staycationService.noOfDays) - 1;
  }

  selectionFinished(date: D | null): DateRange<D> {
    return this._createFiveDayRange(date);
  }

  createPreview(activeDate: D | null): DateRange<D> {
    return this._createFiveDayRange(activeDate);
  }

  private _createFiveDayRange(date: D | null): DateRange<D> {
    if (date) {
      const start = this._dateAdapter.addCalendarDays(date, 0);
      const end = this._dateAdapter.addCalendarDays(date, this.days);
      return new DateRange<D>(start, end);
    }

    return new DateRange<D>(null, null);
  }
}
@Component({
  selector: 'app-staycation-preview',
  templateUrl: './staycation-preview.component.html',
  styleUrls: ['./staycation-preview.component.scss'],
  providers: [
    {
      provide: MAT_DATE_RANGE_SELECTION_STRATEGY,
      useClass: FiveDayRangeSelectionStrategy,
    },
  ],
})
export class StaycationCitiesComponent implements OnInit {
  @ViewChild('agmMap', { static: true }) agmMap: AgmMap;
  actualPackagePrice;
  packagePrice: number;
  roomSatus = [];
  sliderIndex = 0;
  days = 6;
  minDate = new Date();
  myFilter: any;
  myHolidayDates: any;
  showTourPlan = true;
  showLocation = false;
  staycationPreviewData: TravelPackage;
  values: any;
  traveler_messages: any = [];
  packages: TravelPackage[];
  packageReference: string;
  vendor = 'voyaah.com';
  item_qty: any;
  userLoggedIn: boolean;
  adultscount = 1;
  childrencount = 0;
  infantscount = 0;
  stayCationTravellersDetails: TravellersDetails;
  isLoading = false;
  onAndroidPLatform = false;
  onIOSPlatform = false;
  dateForm: FormGroup;
  form: FormGroup;
  submitted = false;
  couponCoderes: any;
  couponResponce: any;
  activeTab = 'overView';
  display = 'none';
  displayHotel = 'none';
  displayGalleryImages = 'none';
  // userData: any = [];
  //@ViewChild(IonSlides) slides: IonSlides;
  @ViewChild('slides', { read: IonSlides }) slides: IonSlides;
  roomsData: any = [];
  roomAmenitiesList: any = [];
  coupon_code = false;
  couponCodeprice: any;
  couponValid = false;
  actualPrice: any;
  invalidCouponCode = false;
  invalidCouponCodeMessage: any;
  successCouponCode: any;
  discountPrice = false;
  stycationPackagePrice: any;
  totalDeceased: any;
  checkRoomModalDisplay = false;
  checkRoomSelectRoomModal = false;
  checkRoomRoomavilable = false;
  modalDisplay = false;
  validationModal = false;
  selectRoomModal = false;
  errorWhileValidation = false;
  errorWhileBooking = false;
  errorText = 'error';
  roomtype: any;
  loading = false;
  couponData: any;
  couponCodefail: any;
  roomsAmenitiesInformation: any;
  hotelroomtype: any;
  lat: number;
  lng: number;
  zoom = 16;
  zoom1 = 2;
  allLocations: any[] = [];
  allLocationsforMultidestination: any[] = [];
  previewData: any;
  show = 'destination';
  btnText = 'Select Room';
  btnDisabled = false;
  isDateSelectionValid = false;
  img = {
    icon:
      'https://www.iconfinder.com/data/icons/curious-shop-1/80/curiosshop-02-512.png',
  };

  public renderOptions = {
    suppressMarkers: true,
    suppressPolylines: false,
    geodesic: true,
    polylineOptions: { strokeColor: '#4C97FF' },
  };
  public markerOptions = {
    origin: {
      icon: '../../../assets/images/Mapdot.PNG',
    },
    destination: {
      //icon: '../../../assets/images/mapMarker.png',
    },
    waypoints: [],
  };

  todayDate =
    new Date().getFullYear() +
    '-' +
    ('0' + (new Date().getMonth() + 1)).slice(-2) +
    '-' +
    ('0' + new Date().getDate()).slice(-2);
  hoteRoomlImages: any;
  dateInvalid = false;
  imageZoomModel: any;
  roomavilable = false;
  dateLength: any;
  discountedPrice: any;
  discountedValue: any;
  worngCoupon = false;
  couponCodeError = false;
  selectedItem: any;
  imagesModalList: any;
  bookingDetails = true;
  partnerData: any;
  selectedValue: any;
  travelDates: any;
  roomSelection: boolean;
  vendorNamePackges: any;
  copyOfVendorNamePackges = [];
  vendorNames: any;
  vendorCondition: boolean;
  bookVendorName: any;
  transactionDetails: any;
  transactionStatus: any;
  transactionDetailsTotal: any;
  travelStartDate: any;
  travelEndDate: any;
  travelDetails: any;
  myHolidayFilter: (d: Date) => boolean;
  selectedRoom;
  minAvailableDate = new Date();
  maxAvailableDate;
  calendarDatesLoading = false;
  noRoomsAvailable = false;
  unAvailableDates;
  vendorString: any;
  staycationBooking: any = {};
  constructor(
    private staycationService: StaycationPackagesService,
    private route: ActivatedRoute,
    private router: Router,
    private userProfileService: UserProfileService,
    public modalController: ModalController,
    private userItineraryService: UserItineraryService,
    private pay: PaymentService,
    private platform: Platform,
    private formBuilder: FormBuilder,
    private destinationService: DestinationsApiService,
    private canceltripService: CanceltripService
  ) {
    var vendorName;
    vendorName = localStorage.getItem('vendorName');
    this.sliderIndex = 0;
    this.route.params.subscribe((params) => {
      var packageReferenceId = params.packageReference;
      if (packageReferenceId?.length > 0) {
        var fields = packageReferenceId.split('Id');
        this.packageReference = fields[0];
        this.vendorString = fields[1];
        if (this.vendorString?.length > 0) {
          this.bookingDetails = false;
          this.getBookDetails();
        }
      }
      this.vendorNames = params.vendor;
      this.vendor = params.vendor;
      if (this.vendor?.length > 0) {
        this.bookingDetails = true;
        localStorage.removeItem('staycationId');
        var split_string = this.vendor.split('Id');
        var strMatch = split_string[0];
        var numMatches = split_string[1];
        if (numMatches?.length > 0) {
          console.log(numMatches);
          this.vendorString = numMatches;
          this.bookingDetails = false;
          this.vendorNames = strMatch;
          this.getBookDetails();
        }
        if (strMatch?.length > 0) {
          console.log(strMatch);
          this.vendorNames = strMatch;
        }
        console.log(this.vendorNames);
        localStorage.removeItem('partnerName');
        this.staycationService.partnerName(true);
        this.staycationService.clearPartnerData();
      }

      console.log(params);
      if (this.vendor == undefined) {
        this.vendor = 'voyaah.com';
      }
      this.staycationService.setVendorName(this.vendorNames);
      this.staycationService.packageReference.next(this.packageReference);
      console.log('promise this.vendorNames', this.vendorNames);
      this.getPackages();
      this.onAndroidPLatform = this.platform.is('android');
      this.onIOSPlatform = this.platform.is('ios');
      this.item_qty = 0;
    });

    this.staycationService.currentpartnerAdd.subscribe((status) => {
      vendorName = localStorage.getItem('vendorName');
    });
    if (vendorName?.length > 0) {
      this.vendorNames = vendorName;
    }
    this.staycationService.currentpartnerBooking.subscribe((status) => {
      let partnerNameSet = JSON.parse(localStorage.getItem('partnerName'));
      if (
        partnerNameSet?.length === 0 ||
        partnerNameSet === null ||
        partnerNameSet === undefined ||
        partnerNameSet === ''
      ) {
        this.vendorNames = '';
      }
    });

    this.getBookDetails();
    this.getCouponData();
    this.staycationService.changeCouponData.subscribe((res) => {
      if (res) {
        this.getCouponData();
      }
    });
  }

  ngOnInit() {
    this.previewData = this.staycationService.getpreviewOption();
    this.dateForm = this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
    this.form = this.formBuilder.group({
      couponcode: ['', Validators.required],
    });
    this.userProfileService.currentUserNavigate.subscribe((res) => {
      this.userLoggedIn = res;
    });

    this.staycationService.staycationTravellersChanged.subscribe(
      (travellers: TravellersDetails) => {
        this.stayCationTravellersDetails = travellers;
      }
    );
    this.staycationService.selectedStartDate.subscribe((res) => {
      if (res != undefined) {
        this.dateForm.controls.startDate.setValue(res.startDate);
        this.dateForm.controls.endDate.setValue(res.endDate);
      }
    });

    window.onclick = (e) => {
      if (e.target) {
        this.checkRoomModalDisplay = false;
      }
    };
    this.noRoomsAvailable = false;
    // this.vendorName();
    // this.ionViewDidLoad();
    // this.getcal();
  }
  backtoPage() {
    window.history.back();
  }
  async getcal(availableDates) {
    this.myHolidayDates = availableDates;
    // this.myHolidayDates = [
    //   '2021-05-19T18:30:00.000Z',
    //   '2021-05-21T18:30:00.000Z',
    //   '2021-05-25T18:30:00.000Z',
    //   '2021-05-28T18:30:00.000Z',
    //   '2021-05-31T18:30:00.000Z',
    //   '2021-06-04T18:30:00.000Z',
    // ];
    this.myHolidayDates = await this.myHolidayDates.map((date) => {
      return new Date(date);
    });

    this.unAvailableDates = await this.myHolidayDates.reduce(
      (function (hash) {
        return function (p, c) {
          var missingDaysNo = (Date.parse(c) - hash.prev) / (1000 * 3600 * 24);
          if (hash.prev && missingDaysNo > 1) {
            for (var i = 1; i < missingDaysNo; i++) {
              p.push(
                new Date(hash.prev + i * (1000 * 3600 * 24)).setHours(
                  0,
                  0,
                  0,
                  0
                )
              );
            }
          }
          hash.prev = Date.parse(c);
          return p;
        };
      })(Object.create(null)),
      []
    );

    console.log('result second', this.unAvailableDates);
    this.myHolidayFilter = (d: Date | null): boolean => {
      const time = d.getTime();
      return !this.unAvailableDates.find((x) => x == time);
    };
    this.calendarDatesLoading = false;
  }

  getCalenderDetails(data) {
    this.calendarDatesLoading = true;
    this.noRoomsAvailable = false;
    let roomName = '';
    let packageType = '';
    if (data.packageType == 'Multi') {
      packageType = 'Multi';
      roomName = '';
    } else {
      packageType = 'Single';
      roomName = this.selectedRoom;
    }

    this.staycationService
      .getcalenderDates(packageType, data.id, roomName)
      .subscribe((res) => {
        if (res) {
          console.log('result---------------------', res.availableDates);
          if (res.availableDates.length > 0) {
            this.calendarDatesLoading = false;
            this.minAvailableDate = res.startDate;
            this.maxAvailableDate = res.endDate;
            this.getcal(res.availableDates);
          } else {
            this.calendarDatesLoading = false;
            this.noRoomsAvailable = true;
            this.minAvailableDate = new Date();
            this.maxAvailableDate = new Date();
            this.maxAvailableDate.setDate(this.minAvailableDate.getDate() - 1);
          }
        }
      });
  }

  getCouponData() {
    this.couponData = this.staycationService.getOption();

    console.log(this.couponData, 'couponData');
    if (this.couponData?.discountedPrice?.length > 0) {
      this.couponCodeprice = this.couponData.discountedPrice;
      this.discountPrice = true;
      this.getPriceDetails();
      this.couponValid = true;
      this.invalidCouponCode = false;
      this.couponCoderes = this.couponData.couponCode;
      this.actualPrice = this.couponData.actualPrice;
      this.totalDeceased =
        this.couponData.actualPrice - this.couponData.discountedPrice;

      this.discountedPrice = this.couponData.discountedPrice;
      this.discountedValue = this.couponData.discountValue;
      if (this.discountedPrice > this.actualPrice) {
        this.worngCoupon = true;
      }
    } else {
      this.discountPrice = false;
    }
  }
  get f() {
    return this.form.controls;
  }
  selectedDate() {
    this.isDateSelectionValid = false;
    this.dateLength = this.dateForm.controls.startDate.value.toString();
    if (this.dateLength.length > 0) {
      this.dateInvalid = false;
    } else {
      this.dateInvalid = true;
      return;
    }
    for (
      var d = new Date(this.dateForm.value.startDate);
      d <= this.dateForm.value.endDate;
      d.setDate(d.getDate() + 1)
    ) {
      let isExists = this.unAvailableDates.includes(d.getTime());
      if (isExists || d.getTime() > new Date(this.maxAvailableDate).getTime()) {
        this.isDateSelectionValid = true;
        return;
      }
    }

    this.staycationService.startDate.next({
      startDate: this.dateForm.value.startDate,
      endDate: this.dateForm.value.endDate,
    });
  }

  Checkroom() {
    this.checkRoomModalDisplay = true;
    if (
      this.dateForm.controls.startDate.value == undefined ||
      this.dateForm.controls.startDate.value == ''
    ) {
      this.dateInvalid = true;
      this.checkRoomModalDisplay = false;
    } else {
      this.dateInvalid = false;
      this.checkRoomModalDisplay = true;
      this.checkRoomRoomavilable = false;
      this.checkRoomSelectRoomModal = false;

      this.staycationService
        .validateStaycationBooking(
          this.staycationPreviewData.id,
          this.dateForm.controls.startDate.value
        )
        .then((res) => {
          this.checkRoomModalDisplay = true;
          this.checkRoomRoomavilable = false;
          this.checkRoomSelectRoomModal = false;
          if (res.status == 'success') {
            this.checkRoomModalDisplay = true;
            this.checkRoomRoomavilable = true;
            this.checkRoomSelectRoomModal = false;
          } else {
            this.checkRoomModalDisplay = true;
            this.checkRoomRoomavilable = false;
            this.checkRoomSelectRoomModal = true;
            console.log('failed');
          }
        });
    }
  }
  async onSubmit() {
    this.loading = true;
    this.submitted = true;
    if (this.form.invalid) {
      this.loading = false;
      return;
    }
    let couponDate = {
      couponCode: this.f.couponcode.value,
      price: this.packagePrice,
      packageId: this.staycationPreviewData.id,
      vendorName: this.vendor,
    };
    try {
      this.staycationService.getCouponCode(couponDate).subscribe(
        (result) => {
          this.couponResponce = result;
          if (this.couponResponce) {
            this.loading = false;
            this.couponValid = true;
          }
          if (this.couponResponce.status === 'failed') {
            this.invalidCouponCode = true;
            this.invalidCouponCodeMessage = this.couponResponce.message;
            this.discountPrice = false;
            this.couponCodefail = this.f.couponcode.value;
            this.getPriceDetails();
          }
          this.couponCoderes = this.couponResponce.couponCode;
          this.actualPrice = this.couponResponce.actualPrice;
          this.couponCodeprice = this.couponResponce.discountedPrice;

          this.successCouponCode = this.couponResponce.status;

          if (this.successCouponCode === 'success') {
            this.packagePrice = this.couponResponce.discountedPrice;
            this.staycationService.setStaycationPrice(this.packagePrice);
            this.discountPrice = true;
            this.actualPackagePrice = this.staycationService.getActualStaycationPrice();
            this.getPriceDetails();
            this.invalidCouponCode = false;
            this.totalDeceased = this.actualPrice - this.couponCodeprice;
          }
          this.staycationService.setOption(this.couponResponce);
          // return result;
        },
        (error) => {
          this.loading = false;
          this.couponCodeError = true;
          console.log(error);
        }
      );
    } catch (error) {
      this.loading = false;
      this.couponCodeError = true;
      console.log('while getting data is err', error);
    }
  }
  getPriceDetails() {
    this.stycationPackagePrice = this.packagePrice;
  }
  get startDateControl() {
    return this.dateForm.controls;
  }
  removeSelectedFromVendorPackages() {
    this.copyOfVendorNamePackges.forEach((value, index) => {
      if (value.packageReference == this.packageReference)
        this.copyOfVendorNamePackges.splice(index, 1);
    });
    console.log('copy', this.copyOfVendorNamePackges, this.vendorNamePackges);
  }
  async getPackages() {
    try {
      if (this.vendorNames) {
        this.packages = await this.vendorName();
        console.log('promiseResult', this.packages);
        this.removeSelectedFromVendorPackages();
      } else {
        this.packages = await this.staycationService.stacationListpreview();
      }
      console.log(this.packages, 'packages');
      this.packages.map((data) => {
        if (data.packageReference === this.packageReference) {
          this.staycationPreviewData = data;
          this.packagePrice = this.staycationPreviewData?.packageValues?.fare?.totalFare;
          this.selectedValue = this.staycationPreviewData?.packageValues?.hotel.rating;
          this.staycationService.setNoOfDays(
            this.staycationPreviewData.packageValues?.numberOfDays
          );
          this.staycationBooking = {
            packageName: this.staycationPreviewData.packagename,
            packageCity: this.staycationPreviewData.packageValues.cityName,
            packageCountry: this.staycationPreviewData.packageValues
              .countryName,
            packageImages: this.staycationPreviewData.packageValues
              .additionalImages,
            packageReference: this.packageReference,
          };
          this.getLocationDetails();
          this.getPriceDetails();
          console.log(
            this.packagePrice,
            this.staycationPreviewData,
            'staycationPreviewData'
          );
          this.assignMinimumCount();
          if (this.staycationPreviewData.packageValues?.activities.length === 0)
            this.showTourPlan = false;
        }
      });

      if (this.staycationPreviewData?.packageValues?.hotel.rooms.length > 0) {
        this.roomsData = [];
        this.staycationPreviewData.packageValues?.hotel.rooms.map(
          (ele, index) => {
            // this.roomsData.push(ele.roomAmenities);
            if (index == 0) {
              this.roomSatus.push(true);
            } else {
              this.roomSatus.push(false);
            }
            this.roomsData.push(ele);

            return this.roomsData;
          }
        );
        this.roomsData.sort((a, b) => a.roomPrice - b.roomPrice);
        if (this.staycationService.getSelectedRoom()) {
          this.selectedRoom = this.staycationService.getSelectedRoom();
        } else {
          this.selectedRoom = this.roomsData[0].roomtype;
        }
        this.staycationService.setSelectedRoom(this.selectedRoom);
        this.getCalenderDetails(this.staycationPreviewData);
        this.staycationService.setStaycationPrice(this.packagePrice);
        this.staycationService.setActualStaycationPrice(this.packagePrice);
        console.log('roomsDataaaaaaaaaaaaaaaaaa', this.roomsData);
      }
    } catch (error) {
      console.log(error);
    }
  }

  buttonClick1(data, index) {
    this.roomSatus.map((value, i) => {
      if (i == index) {
        if (this.roomSatus[i]) {
          return;
        }
        this.packagePrice = data.roomPrice;
        console.log('packagePrice', data);
        this.selectedRoom = this.roomsData[index].roomtype;
        this.staycationService.setSelectedRoom(this.roomsData[index].roomtype);
        this.getCalenderDetails(this.staycationPreviewData);
        this.staycationService.setStaycationPrice(
          this.roomsData[index].roomPrice
        );
        this.staycationService.setActualStaycationPrice(
          this.roomsData[index].roomPrice
        );
        this.staycationService.setOption(undefined);
        this.staycationService.roomChanged.next(true);
        this.form.reset();
        this.roomSatus[i] = true;
        this.dateForm.reset();
      } else {
        this.roomSatus[i] = false;
      }
    });
    if (!this.platform.is('mobile')) {
      document.getElementById('travelsDate').scrollIntoView();
    }
    this.couponValid = false;
  }
  assignMinimumCount() {
    this.adultscount = this.staycationPreviewData.packageValues?.travellers.minAdults;
    this.childrencount = this.staycationPreviewData.packageValues?.travellers.minChildren;
  }
  async processBooking() {
    try {
      this.travelDates = {
        startDate: this.dateForm.value.startDate,
        endDate: this.dateForm.value.endDate,
      };
      console.log(this.travelDates);
      localStorage.setItem('travelDates', JSON.stringify(this.travelDates));
      if (
        !this.dateForm.controls.startDate.value ||
        !this.dateForm.controls.startDate.value
      ) {
        this.dateInvalid = true;
      }
      console.log('this.dateInvalid', this.dateInvalid);
      console.log('this.isDateSelectionValid', this.isDateSelectionValid);
      if (this.dateForm.invalid || this.isDateSelectionValid) {
        return;
      }
      this.userItineraryService.updateTravellers({
        adultCount: this.adultscount,
        childCount: this.childrencount,
        infantCount: this.infantscount,
      });
      if (this.userLoggedIn === true) {
        this.modalDisplay = true;
        this.validationModal = true;
        this.selectRoomModal = false;
        await this.staycationService
          .validateStaycationBooking(
            this.staycationPreviewData.id,
            this.dateForm.controls.startDate.value
          )
          .then(
            (res) => {
              this.modalDisplay = true;
              this.validationModal = true;
              if (res.status == 'success') {
                this.modalDisplay = false;
                console.log('success');
                this.router.navigate(['/travellers'], {
                  queryParams: { vendor: this.vendorNames },
                });
                localStorage.setItem(
                  'packageID',
                  JSON.stringify(this.packageReference)
                );
                this.userItineraryService.changeTrip(true);
                this.userProfileService.navigateToTravellers.next(
                  'fromstaycations'
                );
                this.userItineraryService.travelersSelect.next(true);
              } else {
                this.validationModal = false;
                this.selectRoomModal = true;
                console.log('failed');
              }
            },
            (err) => {
              console.log(err.statusText);
              this.errorText = err.statusText;
              this.modalDisplay = true;
              this.validationModal = false;
              this.errorWhileValidation = true;
            }
          );

        //  else {
        //   this.router.navigate(['/travellers']);
        //   this.userProfileService.navigateToTravellers.next('fromstaycations');
        //   this.userItineraryService.travelersSelect.next(true);
        //   localStorage.setItem(
        //     'packageID',
        //     JSON.stringify(this.packageReference)
        //   );
        // }
      } else {
        Analytics.record({ name: 'LoginForBooking' });
        const modal = await this.modalController.create({
          component: LoginComponent,
          cssClass: 'login-modal-css',
          componentProps: { value: 123 },
        });
        return await modal.present();
      }
    } catch (error) {
      this.modalDisplay = false;
      console.log(error);
    }
  }
  openRoomSelection() {
    this.modalDisplay = false;
    this.validationModal = false;
    this.selectRoomModal = false;
    this.errorWhileValidation = false;
    this.errorWhileBooking = false;
  }
  Roomscontact() {
    this.router.navigate([''], { queryParams: { setcard: 'true' } });
  }
  adultCountChange(type) {
    if (type == 'decrease') {
      if (
        this.adultscount >
        this.staycationPreviewData.packageValues?.travellers.minAdults
      ) {
        this.adultscount--;
      }
    } else {
      if (
        this.adultscount <
        this.staycationPreviewData.packageValues?.travellers.maxAdults
      ) {
        this.adultscount++;
      }
    }
  }
  Copancode() {
    this.coupon_code = true;
  }
  Coponcodeclose() {
    this.staycationService.couponClose(true);
    this.submitted = false;
    this.form.reset();
    this.staycationService.setOption(null);
    this.coupon_code = false;
  }
  CoponcodecloseInvalid() {
    this.actualPackagePrice = this.staycationService.getActualStaycationPrice();
    this.couponValid = false;
    this.coupon_code = false;
    this.submitted = false;
    this.discountPrice = false;
    this.packagePrice = this.actualPackagePrice;
    this.staycationService.setOption(null);
    this.form.reset();
  }
  childCountChange(type) {
    if (type == 'decrease') {
      if (
        this.childrencount >
        this.staycationPreviewData.packageValues?.travellers.minChildren
      ) {
        this.childrencount--;
      }
    } else {
      if (
        this.childrencount <
        this.staycationPreviewData.packageValues?.travellers.maxChildren
      ) {
        this.childrencount++;
      }
    }
  }
  gototravellers() {
    this.userItineraryService.PreviewItinerary(true);
    this.userProfileService.navigateToTravellers.next('fromstaycations');
    this.userItineraryService.travelersSelect.next(true);
    localStorage.setItem('packageID', this.packageReference);
    this.router.navigate(['/travellers']);
  }
  setdataOfcoupon() {
    this.couponData = this.staycationService.getOption();
    if (this.couponData?.discountedPrice.length > 0) {
      this.discountedPrice = this.couponData.discountedPrice;
      this.discountedValue = this.couponData.discountValue;
    } else {
      this.discountedPrice = 'NA';
      this.discountedValue = 'NA';
    }
  }
  async bookStaycation() {
    await this.setdataOfcoupon();
    this.isLoading = true;
    await this.staycationService
      .bookStaycations(
        this.staycationPreviewData,
        this.couponCoderes,
        this.stayCationTravellersDetails,
        this.dateForm.controls.startDate.value,
        this.discountedPrice,
        this.discountedValue,
        this.vendorNames,
        this.staycationBooking
      )
      .then((returnvalue) => {
        var id = this.staycationService.getStaycationBookingId();
        let platform = 'Web';
        if (this.onAndroidPLatform) {
          platform = 'Android';
        } else if (this.onIOSPlatform) {
          platform = 'IOS';
        }
        Analytics.record({
          name: 'StaycationBooking',
          attributes: {
            package: this.staycationPreviewData?.packagename,
            duration:
              this.dateForm.controls?.startDate?.value?.toString() +
              ' to ' +
              this.dateForm.controls?.endDate?.value?.toString(),
            partner: '',
            ticketsize: (
              this.stayCationTravellersDetails?.adults?.length +
              this.stayCationTravellersDetails?.children?.length +
              this.stayCationTravellersDetails?.infants?.length
            ).toString(),
            traveldate: this.dateForm.controls?.startDate?.value?.toString(),
            location: this.staycationPreviewData?.packageValues?.cityName,
            device: platform,
            price: this.staycationPreviewData?.packageValues?.fare?.totalFare?.toString(),
          },
        });
        if (this.onIOSPlatform == true || this.onAndroidPLatform == true) {
          let platform = '';
          if (this.onIOSPlatform == true) {
            platform = 'ios';
          } else {
            platform = 'android';
          }
          this.pay.redirectToPayment(
            id,
            this.stycationPackagePrice,
            'INR',
            'EN',
            'staycation',
            platform
          );
          this.pay.staycationPaymentGuard.next(true);
          this.router.navigateByUrl('/staycation-payment');
        } else {
          this.pay.redirectToPayment(
            id,
            this.stycationPackagePrice,
            'INR',
            'EN',
            'staycation',
            'browser',
            window.location.origin
          );
        }
      })
      .catch((error) => {
        console.log(error);
        this.isLoading = false;
        this.modalDisplay = true;
        this.validationModal = false;
        this.selectRoomModal = false;
        this.errorWhileValidation = false;
        this.errorWhileBooking = true;
      });
  }

  async getBookDetails() {
    this.packages = await this.staycationService.stacationListpreview();
    this.packages.map((data) => {
      if (data.packageReference === this.packageReference) {
        this.staycationPreviewData = data;
      }
    });
    try {
      this.staycationService
        .getUsersStaycationBooking()
        .then((transactions) => {
          let bookDetails = transactions;
          for (let i = 0; i < bookDetails?.length; i++) {
            if (bookDetails[i].paymentDetails != null) {
              console.log(transactions);
              if (bookDetails[i].id === this.vendorString) {
                this.transactionStatus = bookDetails[i].bookingStatus;
                this.transactionDetailsTotal = bookDetails[i];
                this.transactionDetails = JSON.parse(
                  bookDetails[i].paymentDetails
                );
                this.travelDetails = JSON.parse(bookDetails[i].bookingDetails);
                this.travelStartDate = bookDetails[i]?.travelStartDate;
                let travelEndDateSet = new Date(
                  bookDetails[i]?.travelStartDate
                );
                this.travelEndDate = travelEndDateSet.setDate(
                  travelEndDateSet.getDate() +
                    this.staycationPreviewData?.packageValues.numberOfDays -
                    1
                );
                console.log(this.travelEndDate, this.travelDetails);

                console.log(
                  this.transactionDetailsTotal,
                  this.transactionDetails
                );
              }
            }
          }
        });
    } catch (error) {
      console.log(error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  imagesPackages = [
    {
      city: 'Yoga and Wellness ',
      packages: '65+packages',
      imageUrl: '../../assets/images/NoPath - Copy (13).png',
    },
    {
      city: 'Lakes and Rivers',
      packages: '30+packages',
      imageUrl: '../../assets/images/NoPath - Copy (64).png',
    },
    {
      city: 'History and Culture ',
      packages: '18+packages',
      imageUrl: '../../assets/images/NoPath - Copy (13).png',
    },
    {
      city: 'Lakes and River ',
      packages: '40+packages',
      imageUrl: '../../assets/images/NoPath - Copy (64).png',
    },
  ];
  // eslint-disable-next-line @typescript-eslint/member-ordering
  currentRate = 2;

  amenitiesPreview(data) {
    this.hotelroomtype = data['roomtype'];
    this.hoteRoomlImages = data['images'];
    this.roomsAmenitiesInformation = data['roomAmenities'];
  }
  async getLocationDetails() {
    const requestForCooridnates: any = [];
    let requestForCooridnate2: any = [];
    requestForCooridnates.push(
      this.destinationService.getlatNlondestinationtostacations(
        this.staycationPreviewData.packageValues.hotel.address.city,
        this.staycationPreviewData.packageValues.hotel.address.country,
        this.staycationPreviewData.packageValues.hotel.address.houseNumber,
        this.staycationPreviewData.packageValues.hotel.address.landMark,
        this.staycationPreviewData.packageValues.hotel.address.state,
        this.staycationPreviewData.packageValues.hotel.address.street
      )
    );
    if (this.staycationPreviewData.packageValues.packageType == 'Multi') {
      for (
        let i = 0;
        i < this.staycationPreviewData.packageValues.multidestinations.length;
        i++
      ) {
        requestForCooridnate2.push(
          this.destinationService.getlatNlondestinationtostacations(
            this.staycationPreviewData.packageValues.multidestinations[i]
              .hotelroom.address.city,
            this.staycationPreviewData.packageValues.multidestinations[i]
              .hotelroom.address.country,
            this.staycationPreviewData.packageValues.multidestinations[i]
              .hotelroom.address.houseNumber,
            this.staycationPreviewData.packageValues.multidestinations[i]
              .hotelroom.address.landMark,
            this.staycationPreviewData.packageValues.multidestinations[i]
              .hotelroom.address.state,
            this.staycationPreviewData.packageValues.multidestinations[i]
              .hotelroom.address.street
          )
        );
        Promise.all(requestForCooridnate2)
          .then((responses) => {
            let geoResponse: any = {};
            for (let i = 0; i < responses.length; i++) {
              geoResponse = responses[i];
              const data: any = geoResponse.results[0];
              this.allLocationsforMultidestination.push(data.geometry.location);
            }
          })
          .catch((error) => {
            console.log('Exception in getting geo locations ', error);
          });
      }
    }
    Promise.all(requestForCooridnates)
      .then((responses) => {
        let geoResponse: any = {};
        for (let i = 0; i < responses.length; i++) {
          geoResponse = responses[i];
          const data: any = geoResponse.results[0];
          this.allLocations.push(data.geometry.location);
        }
      })
      .catch((error) => {
        console.log('Exception in getting geo locations ', error);
      });
  }

  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy() {
    this.couponData = undefined;
    this.staycationService.setOption(null);
  }

  overView(activeTab) {
    this.activeTab = activeTab;
  }
  accommodation(activeTab) {
    this.activeTab = activeTab;
  }
  location(activeTab) {
    this.activeTab = activeTab;
  }
  gallery(activeTab) {
    this.activeTab = activeTab;
  }
  listClick(event, newValue, imgIndex) {
    this.selectedItem = newValue;
    this.sliderIndex = imgIndex;
  }

  imageList2(data, imgIndex) {
    console.error('data', data);
    this.displayHotel = 'block';
    this.imagesModalList = data;
    this.selectedItem = data[imgIndex];
  }

  // openModal() {
  //   this.display = 'block';
  // }
  // onCloseHandled() {
  //   this.display = 'none';
  // }
  // openModalHotel() {
  //   this.displayHotel = 'block';
  // }
  onCloseHandledHotel() {
    this.displayHotel = 'none';
  }
  cancelTrip() {
    try {
      this.modalDisplay = true;
      this.validationModal = true;
      this.canceltripService.getRefundDetails().then(
        (result) => {
          this.modalDisplay = false;
          this.validationModal = false;
          this.canceltripService.setRefundDetailsResponse(result);
          this.router.navigate(['/cancel-trip']);
        },
        (error) => {
          console.log(error);
          this.modalDisplay = false;
          this.validationModal = false;
        }
      );
    } catch (error) {
      console.log(error);
      this.modalDisplay = false;
      this.validationModal = false;
    }
  }
  onCloseGallery() {
    this.displayGalleryImages = 'none';
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  slideOptsOne = {
    initialSlide: 1,
    slidesPerView: 6,
    spaceBetween: 5,
  };
  imageList(data, imgIndex) {
    this.displayHotel = 'block';
    this.imagesModalList = data.images;
    this.selectedItem = this.imagesModalList[imgIndex];
    this.sliderIndex = imgIndex;
  }
  slidePrev() {
    if (
      this.sliderIndex <= this.imagesModalList.length &&
      this.sliderIndex > 0
    ) {
      this.sliderIndex = this.sliderIndex - 1;
      this.selectedItem = this.imagesModalList[this.sliderIndex];
    }
  }

  slideNex() {
    if (this.sliderIndex < this.imagesModalList.length - 1) {
      this.sliderIndex = this.sliderIndex + 1;
      this.selectedItem = this.imagesModalList[this.sliderIndex];
    }
  }
  imageZoom(image, t) {
    this.displayGalleryImages = 'block';
    this.imageZoomModel = image;
    this.selectedItem = this.imageZoomModel[t];
    this.sliderIndex = t;
  }
  slidePrevious() {
    if (
      this.sliderIndex <= this.imageZoomModel.length &&
      this.sliderIndex > 0
    ) {
      this.sliderIndex = this.sliderIndex - 1;
      this.selectedItem = this.imageZoomModel[this.sliderIndex];
    }
  }
  slideNext() {
    if (this.sliderIndex < this.imageZoomModel.length - 1) {
      this.sliderIndex = this.sliderIndex + 1;
      this.selectedItem = this.imageZoomModel[this.sliderIndex];
    }
  }
  goToContact() {
    this.router.navigate([''], { queryParams: { setcard: 'true' } });
  }
  async vendorName() {
    try {
      if (this.vendorNames) {
        this.vendorNamePackges = await this.staycationService.vendorStaycations(
          this.vendorNames
        );
        console.log('promiseResult', this.vendorNamePackges);
        this.vendorCondition = true;
        this.copyOfVendorNamePackges = [...this.vendorNamePackges];
        return this.vendorNamePackges;
      }
    } catch (error) {
      console.log('while getting data is err', error);
    }
  }

  goToStyacationPage() {
    this.router.navigate(['/staycation'], {
      queryParams: { vendor_name: this.vendorNames },
    });
  }

  ionViewDidLoad() {
    this.agmMap.triggerResize();
  }

  getexclusive_offer(i) {
    console.log(i);
    window.open(i, '_blank');
  }
  partnerPackage(reference) {
    this.copyOfVendorNamePackges = [];
    this.copyOfVendorNamePackges = [...this.vendorNamePackges];
    console.log('copy', this.copyOfVendorNamePackges);
    Analytics.record({
      name: 'SelctedStaycationPackage',
      attributes: { click: reference.toString() },
    });
    let travellers: TravellersDetails = {
      adults: [],
      children: [],
      infants: [],
    };
    this.staycationService.packageReference.next(reference);
    this.staycationService.startDate.next('');
    this.staycationService.staycationTravellers.next(travellers);
    this.userProfileService.travellerSelectionData.next(undefined);
    this.staycationService.setOption(undefined);
    this.staycationService.couponDetails.next(true);
    this.router.navigate(['/staycation/', reference, this.vendorNames]);
    localStorage.setItem('packageID', reference);
  }
}
