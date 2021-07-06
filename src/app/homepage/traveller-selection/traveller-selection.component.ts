import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';
import { TravellerCount, TravellersDetails } from '@ojashub/voyaah-common';
import { UserItineraryService } from '@app/service-module/user-itinerary.service';
import { UserProfileDetails } from '@ojashub/voyaah-common';
import { UserProfileService } from '@app/service-module/user-profile.service';
import { PopoverController } from '@ionic/angular';
import * as moment from 'moment';
import { ModalController, Platform } from '@ionic/angular';
import { AddTravellersSlideMenuComponent } from '../myaccount/add-travellers-slide-menu/add-travellers-slide-menu.component';
import {
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  FormBuilder,
  ValidatorFn,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { StaycationPackagesService } from '@app/service-module/staycation-packages.service';
import { TravelPackage } from '@app/staycation/staycation.types';
import { LoginComponent } from '@app/account/components';
import { Analytics } from 'aws-amplify';
import { PaymentService } from '@app/service-module/payment.service';
import { AccountService } from '@app/account/services';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigService } from '@app/config.service';
import { CustomBooking } from '@ojashub/voyaah-common';
import { AwsTranscationSyncService } from '@app/service-module/aws-transcation-sync.service';
declare var $;
const { v1: uuidv1 } = require('uuid');
import { Location } from '@angular/common';
import { runInThisContext } from 'vm';
@Component({
  selector: 'app-traveller-selection',
  templateUrl: './traveller-selection.component.html',
  styleUrls: ['./traveller-selection.component.scss'],
})
export class TravellerSelectionComponent implements OnInit {
  registerFormForTraveller: FormGroup;
  registerFormForTravellerStaycation: FormGroup;
  finalPackagePrice;
  actualPackagePrice;
  totalDate: any;
  TotalPersons: any;
  submitted = false;
  editFormSubmitted = false;
  travellersList: UserProfileDetails[] = [];
  adults: UserProfileDetails[] = [];
  children: UserProfileDetails[] = [];
  infants: UserProfileDetails[] = [];
  adultSelectedIndexes: number[] = [];
  childSelectedIndexes: number[] = [];
  infantSelectedIndexes: number[] = [];
  userDetails: UserProfileDetails;
  registerForm: FormGroup;
  minDate = moment(new Date()).format('YYYY-MM-DD');
  homeSelectedCount: TravellerCount = {
    adultCount: 1,
    childCount: 0,
    infantCount: 0,
  };
  stayCationTravellersDetails: TravellersDetails;
  dynamicForm: FormGroup;
  adultDisplay: boolean[] = [];
  childDisplay: boolean[] = [];
  infantDisplay: boolean[] = [];
  passportRequired = false;
  navFrom: string;
  editTravellerId: any;
  editTravellerRelationToUser: any;
  packageReference: any;
  selectedTravellersData: any;
  staycationPreviewData: any;
  packages: any[];
  userLoggedIn: boolean;
  modalDisplay = false;
  selectRoomModal = false;
  validationModal = false;
  errorText: any;
  errorWhileValidation = false;
  errorWhileBooking = false;
  stayCationTravellersDate: any;
  isLoading = false;
  isLoadingcustom = false;
  onAndroidPLatform = false;
  onIOSPlatform = false;
  couponCoderes: any;
  discountedPrice: any;
  discountedValue: any;
  couponData: any;
  couponCodeprice: any;
  discountPrice = false;
  stycationPackagePrice: any;
  errorChange = false;
  noTravellers = false;
  totalDeceased: any;
  PreviewItenary: any;
  customBook = false;
  payFali: any;
  previewItenaryDetails: any;
  show = false;
  passportShow = false;
  activityshow = false;
  buttonName = 'chevron-down-outline';
  activitybuttonName = 'chevron-down-outline';
  selectedTravellers: any;
  taxTypeFilter: any;
  taxTypeNames: any;
  returnFlightFare: any;
  totalTax: any;
  equivFare: any;
  returnFlight: any;
  returnflightsArray: any;
  flightsArray: any;
  currencyTypeFilterTotal: any;
  flightFareTotalForAllFlights: any;
  flightTaxPriceForAllFlights: any;
  flightEquiFarePriceeForAllFlights: any;
  hotelsArray: any;
  hotelPriceTotal: any;
  hotelPriceType: any;
  GrandTotalAmount: any;
  GrandTotal: any;
  totalCurrencyType: any = [];
  GrandTotalCurrency: string;
  activityPrice: any;
  activityPriceCurrency: string;
  serviceTax: string;
  travellers: TravellersDetails = {
    adults: [],
    children: [],
    infants: [],
  };
  userPresent = false;
  submittedTraveller = false;
  submittedTravellerStaycation = false;
  emailPattern = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  hideForm = false;
  hideFormStaycation = false;
  showTravellerInfo = true;
  showDetails = true;
  showDetailsStaycation = true;
  TravellerInfo: any;
  TravellerInfoStaycation: any;
  vendorNamePackges: Promise<any>;
  vendorNames: any;
  staycationBooking: any = {};
  vendorNameget: any;
  vendorNameLocal: any;

  constructor(
    private itineraryService: UserItineraryService,
    private userProfileService: UserProfileService,
    public popoverController: PopoverController,
    private formBuilder: FormBuilder,
    private router: Router,
    private pay: PaymentService,
    public modalController: ModalController,
    private staycationService: StaycationPackagesService,
    private _location: Location,
    private platform: Platform,
    private route: ActivatedRoute
  ) {
    this.vendorNameget = this.route.snapshot.queryParamMap.get('vendor');
    this.vendorNames = this.vendorNameget;
    this.vendorName();
    this.onAndroidPLatform = this.platform.is('android');
    this.onIOSPlatform = this.platform.is('ios');
    this.itineraryService.currentitinerary.subscribe((res) => {
      console.log('itineraryService.currentitinerary');
      this.PreviewItenary = this.itineraryService.userItineraryData();
      this.previewItenaryDetails = this.PreviewItenary.dayPlanner;
      console.log(this.PreviewItenary);
      this.previewDetails();
      this.getPackages();
      this.checkPassportMandatory();
    });
    this.itineraryService.currentitinerary.subscribe(async (res) => {
      this.getPackages();
      console.log(res, 'rsep');
    });
    this.itineraryService.selectTravellerChange.subscribe(async (res) => {
      let packageID = await JSON.parse(localStorage.getItem('packageID'));
      this.packageReference = packageID;
      console.log('itineraryService.selectTravellerChange');
      if (this.packageReference == 'custom') {
        this.customBook = true;
        this.previewDetails();
        this.setTravellerInfo();
      } else {
        this.customBook = false;
        this.getPackages();
        this.setTravellerInfoStaycation();
      }
    });
    this.vendorNameLocal;
    this.vendorNameLocal = localStorage.getItem('vendorName');
    this.staycationService.currentpartnerAdd.subscribe((status) => {
      this.vendorNameLocal = localStorage.getItem('vendorName');
    });
    if (this.vendorNameget?.length == 0 || this.vendorNameget == undefined) {
      if (this.vendorNameLocal?.length > 0) {
        this.vendorNames = this.vendorNameLocal;
      }
    }

    this.userProfileService.routeToTravellers.subscribe((from) => {
      console.log('userProfileService.routeToTravellers');
      this.navFrom = from;
    });

    this.userProfileService.currentUserNavigate.subscribe((res) => {
      console.log('userProfileService.currentUserNavigate');
      this.userLoggedIn = res;
    });
    this.staycationService.staycationTravellersChanged.subscribe(
      (travellers: TravellersDetails) => {
        console.log('staycationService.staycationTravellersChanged');
        this.stayCationTravellersDetails = travellers;
      }
    );

    this.staycationService.selectedStartDate.subscribe((Date) => {
      this.stayCationTravellersDate = JSON.parse(
        localStorage.getItem('travelDates')
      );
      console.log('staycationService.selectedStartDate');
    });
    this.getCouponData();
    this.staycationService.triggerRoomDataChange.subscribe((res) => {
      console.log('staycationService.triggerRoomDataChange');
      if (res) {
        this.getCouponData();
      }
    });
    this.staycationService.currentCouponClose?.subscribe((res) => {
      console.log('staycationService.currentCouponClose');
      if (res === true) {
        this.discountPrice = false;
        this.couponData = null;
      }
    });

    // router.events.subscribe((val) => {
    //        console.log(this.PreviewItenary,"this.PreviewItenary",val);
    //        if(this.PreviewItenary?.selectedTravellers?.adults && this.PreviewItenary?.selectedTravellers?.adults.length>0){
    //         let {adults} =this.PreviewItenary?.selectedTravellers
    //         if(adults.length>0){
    //           this.aduultError=false;
    //         }
    //        }
    // }
    // aduultError&&
    // )
  }

  ngOnInit() {
    console.log('oninit');
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      gender: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      countryCode: ['+91', Validators.required],
      mobileNo: ['', [Validators.required, Validators.minLength(10)]],
      dateOfBirth: ['', Validators.required],
      passport: this.formBuilder.group({
        number: ['', Validators.required],
        country: ['', Validators.required],
        expiry: ['', Validators.required],
      }),
    });
    window.onclick = (e) => {
      if (e.target) {
        $('#adultCollapse-0').collapse('hide');
        $('#infantCollapse-0').collapse('hide');
        $('#childrenCollapse-0').collapse('hide');
      }
    };
    this.registerFormForTraveller = this.formBuilder.group({
      countryCode: ['+91', Validators.required],
      mobileNo: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    });
    this.registerFormForTravellerStaycation = this.formBuilder.group({
      countryCode: ['+91', Validators.required],
      mobileNo: ['', [Validators.required, Validators.minLength(10)]],
      email: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
    });
    this.itineraryService.travelersSelect.next(false);
    this.dynamicForm = this.formBuilder.group({
      adultsInput: new FormArray([]),
      childrenInput: new FormArray([]),
      infantsInput: new FormArray([]),
    });

    console.log('navfrom', this.navFrom);
    this.userProfileService.currentUserProfileData.subscribe(async (res) => {
      console.log('userProfileService.currentUserProfileData');
      this.userDetails = this.userProfileService.getUserDetails();
      if (this.userDetails.firstName?.length > 0) {
        this.userPresent = false;
      }
      this.travellersList = this.userProfileService.getFamilyDetails();
      console.log(this.userDetails, this.travellersList);
      await this.devideIntoCatogories();
      let indexesData = await this.userProfileService.getTravellerIndexesData();
      await this.assignPreviouslySelectedTravellers(indexesData);
      // this.popoverController.dismiss();
    });
    this.itineraryService.itineraryChanged.subscribe((r) => {
      console.log('itineraryService.itineraryChanged');
      this.homeSelectedCount = this.itineraryService.userItineraryData().travellers;
      this.devideIntoCatogories();
    });
    this.homeSelectedCount = this.itineraryService.userItineraryData().travellers;
    this.travellersList = this.userProfileService.getFamilyDetails();
    this.devideIntoCatogories();
    this.userProfileService.selectedTravellersData.subscribe((result) => {
      console.log('userProfileService.selectedTravellersData');
      if (result) {
        let indexesData = this.userProfileService.getTravellerIndexesData();
        this.assignPreviouslySelectedTravellers(indexesData);
      }
    });
  }
  disableDate() {
    return false;
  }
  get t() {
    return this.registerFormForTraveller.controls;
  }
  get ts() {
    return this.registerFormForTravellerStaycation.controls;
  }
  get f() {
    return this.dynamicForm.controls;
  }

  get adultsInput(): FormArray {
    return this.dynamicForm.get('adultsInput') as FormArray;
  }
  adultAt(index) {
    return (<FormArray>this.dynamicForm.get('adultsInput')).at(index);
  }
  get childrenInput(): FormArray {
    return this.dynamicForm.get('childrenInput') as FormArray;
  }
  childAt(index) {
    return (<FormArray>this.dynamicForm.get('childrenInput')).at(index);
  }
  get infantsInput(): FormArray {
    return this.dynamicForm.get('infantsInput') as FormArray;
  }
  infantAt(index) {
    return (<FormArray>this.dynamicForm.get('infantsInput')).at(index);
  }
  onSubmitTraveller() {
    this.submittedTraveller = true;
    if (this.registerFormForTraveller.invalid) {
      return;
    }
    const travellerDataObj = {
      checked: this.hideForm,
      travellerEmail: this.registerFormForTraveller.controls.email.value,
      travellerMobile:
        this.registerFormForTraveller.controls.countryCode.value +
        this.registerFormForTraveller.controls.mobileNo.value,
    };
    localStorage.setItem('TravellerInfo', JSON.stringify(travellerDataObj));
    this.showTravellerInfo = true;
    this.setTravellerInfo();
  }

  onSubmitTravellerStaycation() {
    this.submittedTravellerStaycation = true;
    if (this.registerFormForTravellerStaycation.invalid) {
      return;
    }
    const travellerDataObj = {
      checked: this.hideFormStaycation,
      travellerEmail: this.registerFormForTravellerStaycation.controls.email
        .value,
      travellerMobile:
        this.registerFormForTravellerStaycation.controls.countryCode.value +
        this.registerFormForTravellerStaycation.controls.mobileNo.value,
    };
    localStorage.setItem(
      'TravellerInfoStaycation',
      JSON.stringify(travellerDataObj)
    );
    this.showTravellerInfo = true;
    this.setTravellerInfoStaycation();
  }
  onTraveller(element) {
    console.log(this.hideForm);
    if (this.hideForm == false) {
      localStorage.removeItem('TravellerInfo');
      this.submittedTraveller = false;
      this.registerFormForTraveller.controls.email.setValue('');
      this.registerFormForTraveller.controls.mobileNo.setValue('');
      this.showDetails = true;
      this.hideForm = false;
      this.itineraryService.travelersDelete(true);
    }
  }
  onTravellerStaycation(element) {
    console.log(this.hideFormStaycation);
    if (this.hideFormStaycation == false) {
      this.travellerInfo();
      localStorage.removeItem('TravellerInfoStaycation');
      this.submittedTravellerStaycation = false;
      this.registerFormForTravellerStaycation.controls.email.setValue('');
      this.registerFormForTravellerStaycation.controls.mobileNo.setValue('');
      this.showDetailsStaycation = true;
    }
  }
  async setTravellerInfo() {
    this.TravellerInfo = await JSON.parse(
      localStorage.getItem('TravellerInfo')
    );
    console.log(this.TravellerInfo);
    if (this.TravellerInfo?.checked === true) {
      this.hideForm = true;
      this.showDetails = false;
    }
  }

  async setTravellerInfoStaycation() {
    this.TravellerInfoStaycation = await JSON.parse(
      localStorage.getItem('TravellerInfoStaycation')
    );
    console.log(this.TravellerInfoStaycation);
    if (this.TravellerInfoStaycation?.checked === true) {
      this.hideFormStaycation = true;
      this.showDetailsStaycation = false;
      const addTravellerInfo = { customDetails: this.TravellerInfoStaycation };

      Object.entries(addTravellerInfo).forEach(([key, value]) => {
        this.stayCationTravellersDetails[key] = value;
      });
      console.log(this.stayCationTravellersDetails);
    }
  }

  travellerInfo() {
    delete this.stayCationTravellersDetails.customDetails;
    console.log(this.stayCationTravellersDetails);
  }
  get registerFormControl() {
    return this.registerForm.controls;
  }
  modelChangeFn(value) {
    if (value) {
      this.passportShow = true;
    } else if (value == '') {
      this.passportShow = false;
    }
  }
  onReset() {
    this.registerForm.controls['firstName'].reset();
    this.registerForm.controls['email'].reset();
    this.registerForm.controls['mobileNo'].reset();
    this.registerForm.controls['gender'].setValue('');
    this.registerForm.controls['dateOfBirth'].reset();
    this.registerForm.controls['passport'].reset();
    this.registerForm.get('passport').get('country').setValue('');
  }
  async onSaveEditTraveller() {
    this.editFormSubmitted = true;
    if (this.registerForm.invalid) {
      $('#editTraveller').modal('show');
      return;
    }
    $('#editTraveller').modal('hide');
    if (this.editTravellerRelationToUser != 'self') {
      let traveller: UserProfileDetails = {
        firstName: this.registerForm.value.firstName,
        dateOfBirth: this.registerForm.value.dateOfBirth,
        gender: this.registerForm.value.gender,
        mobileNo:
          this.registerForm.value.countryCode +
          this.registerForm.value.mobileNo,
        email: this.registerForm.value.email,
        idDetails: [
          {
            idType: 'passport',
            idNumber: this.registerForm.controls['passport'].value.number,
            expiryDate: moment(
              this.registerForm.controls['passport'].value.expiry
            ).toISOString(),
            countryName: this.registerForm.controls['passport'].value.country,
            cityName: '',
          },
        ],
      };
      console.log(traveller);
      await this.userProfileService.editFamilyDetails(
        traveller,
        this.editTravellerId
      );
    } else {
      this.userDetails.firstName = this.registerForm.value.firstName;
      this.userDetails.dateOfBirth = this.registerForm.value.dateOfBirth;
      this.userDetails.gender = this.registerForm.value.gender;
      this.userDetails.mobileNo = this.registerForm.value.mobileNo;
      this.userDetails.email = this.registerForm.value.email;
      this.userDetails.idDetails = [
        {
          idType: 'passport',
          idNumber: this.registerForm.controls['passport'].value.number,
          expiryDate: moment(
            this.registerForm.controls['passport'].value.expiry
          ).toISOString(),
          countryName: this.registerForm.controls['passport'].value.country,
          cityName: '',
        },
      ];
      console.log('userDetails', this.userDetails);
      this.userProfileService.updateUserProfile(this.userDetails);
    }
  }
  checkPassportMandatory() {
    this.previewItenaryDetails.every((element) => {
      if (element?.flightDetails?.isPassportMandatory == 'true') {
        this.passportRequired = true;
        return false;
      }
      return true;
    });
    console.log('passportRequired', this.passportRequired);
  }
  passportValidator(index, travellers, ageGroup): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let forbidden = true;
      if (!this.passportRequired || !this.customBook) {
        return null;
      }
      if (ageGroup == 'adult') {
        travellers[this.adultSelectedIndexes[index]]?.idDetails.every(
          (idDetails) => {
            if (
              idDetails.idType == 'passport' &&
              idDetails.idNumber.length > 0
            ) {
              forbidden = false;
              return false;
            }
            return true;
          }
        );
      } else if (ageGroup == 'child') {
        travellers[this.childSelectedIndexes[index]]?.idDetails.every(
          (idDetails) => {
            if (
              idDetails.idType == 'passport' &&
              idDetails.idNumber.length > 0
            ) {
              forbidden = false;
              return false;
            }
            return true;
          }
        );
      } else {
        travellers[this.infantSelectedIndexes[index]]?.idDetails.every(
          (idDetails) => {
            if (
              idDetails.idType == 'passport' &&
              idDetails.idNumber.length > 0
            ) {
              forbidden = false;
              return false;
            }
            return true;
          }
        );
      }
      return forbidden
        ? { passportValidator: { value: 'passportNotFound' } }
        : null;
    };
  }
  getValidity(i, age) {
    if (age == 'adult') {
      return (<FormArray>this.dynamicForm.get('adultsInput')).controls[i]
        .invalid;
    }
    if (age == 'child') {
      return (<FormArray>this.dynamicForm.get('childrenInput')).controls[i]
        .invalid;
    }
    if (age == 'infant') {
      return (<FormArray>this.dynamicForm.get('infantsInput')).controls[i]
        .invalid;
    }
  }
  createFormFields() {
    this.adultSelectedIndexes = [];
    this.childSelectedIndexes = [];
    this.infantSelectedIndexes = [];
    const adultControl = <FormArray>this.dynamicForm.controls.adultsInput;
    adultControl.controls = [];
    const childControl = <FormArray>this.dynamicForm.controls.childrenInput;
    childControl.controls = [];
    const infantControl = <FormArray>this.dynamicForm.controls.infantsInput;
    infantControl.controls = [];
    for (let i = 0; i < this.homeSelectedCount.adultCount; i++) {
      this.adultsInput.push(
        new FormControl('', [
          Validators.required,
          this.passportValidator(i, this.adults, 'adult'),
        ])
      );
      this.adultSelectedIndexes.push(undefined);
    }
    for (let i = 0; i < this.homeSelectedCount.childCount; i++) {
      this.childrenInput.push(
        new FormControl('', [
          Validators.required,
          this.passportValidator(i, this.children, 'child'),
        ])
      );
      this.childSelectedIndexes.push(undefined);
    }
    for (let i = 0; i < this.homeSelectedCount.infantCount; i++) {
      this.infantsInput.push(
        new FormControl('', [
          Validators.required,
          this.passportValidator(i, this.infants, 'infant'),
        ])
      );
      this.infantSelectedIndexes.push(undefined);
    }
    console.log('createFormFields');
  }

  async devideIntoCatogories() {
    this.adults = [];
    this.children = [];
    this.infants = [];
    // logged in user category
    let loggedInUserAge = this.age(this.userDetails.dateOfBirth);
    if (loggedInUserAge >= 12) {
      this.adults.push(this.userDetails);
      this.adultDisplay.push(true);
    } else if (loggedInUserAge >= 2 && loggedInUserAge < 12) {
      this.children.push(this.userDetails);
      this.childDisplay.push(true);
    } else {
      this.infants.push(this.userDetails);
      this.infantDisplay.push(true);
    }

    //family category
    for (let i = 0; i < this.travellersList.length; i++) {
      let age = this.age(this.travellersList[i].dateOfBirth);
      if (age >= 12) {
        this.adults.push(this.travellersList[i]);
        this.adultDisplay.push(true);
      }
      if (age >= 2 && age < 12) {
        this.children.push(this.travellersList[i]);
        this.childDisplay.push(true);
      }
      if (age < 2) {
        this.infants.push(this.travellersList[i]);
        this.infantDisplay.push(true);
      }
    }
    console.log('adults', this.adults);
    await this.createFormFields();
  }
  age(dob) {
    const age = moment().diff(dob, 'years');
    return age;
  }
  async getPackages() {
    try {
      if (this.vendorNames?.length > 0) {
        this.packages = await this.vendorName();
        console.log('promiseResult', this.packages);
      } else {
        this.packages = await this.staycationService.stacationListpreview();
        console.log('staycations', this.packages);
      }

      this.packages?.map((data) => {
        if (data.packageReference === this.packageReference) {
          this.staycationPreviewData = data;
          this.finalPackagePrice = this.staycationPreviewData.packageValues?.fare?.totalFare;
          this.actualPackagePrice = this.staycationPreviewData.packageValues?.fare?.totalFare;
          this.getPriceDetails();
          this.staycationBooking = {
            packageName: this.staycationPreviewData.packagename,
            packageCity: this.staycationPreviewData.packageValues.cityName,
            packageCountry: this.staycationPreviewData.packageValues
              .countryName,
            packageImages: this.staycationPreviewData.packageValues
              .additionalImages,
            packageReference: this.packageReference,
          };
          console.log(this.staycationPreviewData, 'staycationPreviewData');
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async vendorName() {
    console.log(this.vendorNames);
    try {
      if (this.vendorNames?.length > 0) {
        this.vendorNamePackges = await this.staycationService.vendorStaycations(
          this.vendorNames
        );
        console.log('promiseResult', this.vendorNamePackges);
        return this.vendorNamePackges;
      }
    } catch (error) {
      console.log('while getting data is err', error);
    }
  }
  getPriceDetails() {
    if (this.discountPrice == false) {
      this.stycationPackagePrice = this.staycationPreviewData.packageValues.fare.totalFare;
      console.log(this.stycationPackagePrice);
    }
    if (this.discountPrice == true) {
      this.stycationPackagePrice = this.couponCodeprice;
      console.log(this.stycationPackagePrice);
    }
  }
  getCouponData() {
    this.couponData = this.staycationService.getOption();

    console.log(this.couponData, 'couponData');
    if (this.couponData?.discountedPrice?.length > 0) {
      this.couponCodeprice = this.couponData.discountedPrice;
      this.discountPrice = true;
      this.couponCoderes = this.couponData.couponCode;
      this.discountedPrice = this.couponData.discountedPrice;
      this.discountedValue = this.couponData.discountValue;
      this.getPriceDetails();
      this.totalDeceased =
        this.couponData.actualPrice - this.couponData.discountedPrice;
    } else {
      this.discountPrice = false;
    }
  }
  assignPreviouslySelectedTravellers(selectedTravellers) {
    if (selectedTravellers) {
      this.adultSelectedIndexes =
        selectedTravellers.selectedIndexes?.adultSelectedIndexes;
      this.childSelectedIndexes =
        selectedTravellers.selectedIndexes?.childSelectedIndexes;
      this.infantSelectedIndexes =
        selectedTravellers.selectedIndexes?.infantSelectedIndexes;
      this.addRemoveFromDropDown('adult');
      this.addRemoveFromDropDown('child');
      this.addRemoveFromDropDown('infant');
      this.adultSelectedIndexes.map((selectedIndex, index) => {
        this.adultsInput
          .at(index)
          .setValue(this.adults[selectedIndex]?.firstName);
        this.adultsInput.at(index).updateValueAndValidity();
        this.adultAt(index).markAsDirty();
      });
      this.childSelectedIndexes.map((selectedIndex, index) => {
        this.childrenInput
          .at(index)
          .setValue(this.children[selectedIndex]?.firstName);
        this.childrenInput.at(index).updateValueAndValidity();
        this.childAt(index).markAsDirty();
      });
      this.infantSelectedIndexes.map((selectedIndex, index) => {
        this.infantsInput
          .at(index)
          .setValue(this.infants[selectedIndex]?.firstName);
        this.infantsInput.at(index).updateValueAndValidity();
        this.infantAt(index).markAsDirty();
      });
    }
  }
  adultSelect(value, formIndex, adultIndex) {
    $('#adultCollapse-' + formIndex).collapse('hide');
    console.log(value, formIndex, adultIndex);
    console.log(this.userDetails);

    this.adultsInput.at(formIndex).setValue(value.firstName);
    if (this.adultSelectedIndexes.includes(adultIndex)) {
      console.log('already present');
    } else {
      this.adultSelectedIndexes[formIndex] = adultIndex;
      this.addRemoveFromDropDown('adult');
    }
    console.log(
      'adultSelect',
      this.homeSelectedCount.adultCount,
      this.adultSelectedIndexes
    );
    if (
      this.adultSelectedIndexes?.length == this.homeSelectedCount.adultCount
    ) {
      this.noTravellers = false;
    }
    this.adultsInput.at(formIndex).updateValueAndValidity();
    this.adultAt(formIndex).markAsDirty();
    console.log('idDetails', this.adultSelectedIndexes);
  }
  childSelect(value, formIndex, childIndex) {
    $('#childrenCollapse-' + formIndex).collapse('hide');
    console.log(value, formIndex, childIndex);

    this.childrenInput.at(formIndex).setValue(value.firstName);
    if (this.childSelectedIndexes.includes(childIndex)) {
      console.log('already present');
    } else {
      this.childSelectedIndexes[formIndex] = childIndex;
      this.addRemoveFromDropDown('child');
    }
    console.log('childSelect', this.childSelectedIndexes);
    if (
      this.childSelectedIndexes?.length == this.homeSelectedCount.childCount
    ) {
      this.noTravellers = false;
    }
    this.childrenInput.at(formIndex).updateValueAndValidity();
    this.childAt(formIndex).markAsDirty();
  }
  infantSelect(value, formIndex, infantIndex) {
    $('#infantCollapse-' + formIndex).collapse('hide');
    console.log(value, formIndex, infantIndex);

    this.infantsInput.at(formIndex).setValue(value.firstName);
    if (this.infantSelectedIndexes.includes(infantIndex)) {
      console.log('already present');
    } else {
      this.infantSelectedIndexes[formIndex] = infantIndex;
      this.addRemoveFromDropDown('infant');
    }
    console.log('infantSelect', this.infantSelectedIndexes);
    if (
      this.infantSelectedIndexes?.length == this.homeSelectedCount.infantCount
    ) {
      this.noTravellers = false;
    }
    this.infantsInput.at(formIndex).updateValueAndValidity();
    this.infantAt(formIndex).markAsDirty();
  }
  addRemoveFromDropDown(ageGroup) {
    if (ageGroup == 'adult') {
      this.adultDisplay = [];
      this.adults.map((r) => {
        this.adultDisplay.push(true);
      });
      for (let i = 0; i < this.adultSelectedIndexes.length; i++) {
        if (this.adultSelectedIndexes[i] != undefined) {
          this.adultDisplay[this.adultSelectedIndexes[i]] = false;
          console.log('this.adultDisplay', this.adultDisplay);
        }
      }
    } else if (ageGroup == 'child') {
      this.childDisplay = [];
      this.children.map((r) => {
        this.childDisplay.push(true);
      });
      for (let i = 0; i < this.childSelectedIndexes.length; i++) {
        if (this.childSelectedIndexes[i] != undefined) {
          this.childDisplay[this.childSelectedIndexes[i]] = false;
        }
      }
    } else {
      this.infantDisplay = [];
      this.infants.map((r) => {
        this.infantDisplay.push(true);
      });
      for (let i = 0; i < this.infantSelectedIndexes.length; i++) {
        if (this.infantSelectedIndexes[i] != undefined) {
          this.infantDisplay[this.infantSelectedIndexes[i]] = false;
        }
      }
    }
    console.log(
      'debug',
      this.adultSelectedIndexes,
      this.adults,
      this.adultDisplay
    );
    this.saveSelectedData();
  }
  async openModel(ageGroup) {
    console.log('user details', this.userDetails);
    if (
      this.userDetails.email.length == 0 &&
      this.userDetails.mobileNo.length == 0
    ) {
      this.presentPopover('common', 'own');
    } else {
      this.presentPopover(ageGroup, 'family');
    }
  }
  async presentPopover(selectedAgeGroup, profileType) {
    const popover = await this.popoverController.create({
      component: AddTravellersSlideMenuComponent,
      cssClass: 'addTravellerPopover',
      componentProps: {
        ageGroup: selectedAgeGroup,
        profileType: profileType,
      },
      backdropDismiss: false,
      translucent: true,
      showBackdrop: true,
    });
    return await popover.present();
  }
  saveSelectedData() {
    let travellersData = {
      selectedIndexes: {
        adultSelectedIndexes: this.adultSelectedIndexes,
        childSelectedIndexes: this.childSelectedIndexes,
        infantSelectedIndexes: this.infantSelectedIndexes,
      },
    };
    this.userProfileService.setTravellerIndexesData(travellersData);
  }

  async paymentProceed() {
    // this.submitted = true;
    if (this.userDetails.firstName?.length === 0) {
      this.userPresent = true;
      return;
    }
    await this.travellersSave();
    this.staycationService.staycationTravellers.next(this.travellers);
    try {
      if (this.userLoggedIn === true) {
        if (this.userDetails.firstName?.length > 0) {
          this.modalDisplay = true;
          this.validationModal = true;
          this.selectRoomModal = false;
          console.log('travellers selected');
          await this.staycationService
            .validateStaycationBooking(
              this.staycationPreviewData.id,
              this.stayCationTravellersDate.startDate
            )
            .then(
              (res) => {
                this.modalDisplay = true;
                this.validationModal = true;
                console.log(res);
                if (res.status == 'success') {
                  this.modalDisplay = false;
                  console.log('success');
                  this.bookStaycation();
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
                this.selectRoomModal = true;
                console.log('failed');
              }
            );
        }
        //   this.userProfileService.navigateToTravellers.next('fromstaycations');
        //   this.itineraryService.travelersSelect.next(true);
        //   this.router.navigate(['/travellers']);
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

  goBack() {
    this.router.navigate(['/time-line']);
  }

  goBackStaycation() {
    this._location.back();
  }

  async onSubmit() {
    this.submitted = true;

    if (this.dynamicForm.invalid) {
      console.log('invaid');
      return;
    }
    await this.travellersSave();
    if (this.navFrom != 'fromstaycations') {
      this.itineraryService.setTravellers(this.travellers);
      this.router.navigate(['/preview']);
    } else {
      this.staycationService.staycationTravellers.next(this.travellers);
      this.router.navigate(['/staycation/', this.packageReference]);
    }
  }
  travellersSave() {
    this.saveSelectedData();
    this.travellers = {
      adults: [],
      children: [],
      infants: [],
    };
    // this.adultSelectedIndexes.sort();
    // this.childSelectedIndexes.sort();
    // this.infantSelectedIndexes.sort();
    for (let i = 0; i < this.adultSelectedIndexes.length; i++) {
      this.travellers.adults.push(this.adults[this.adultSelectedIndexes[i]]);
    }
    for (let i = 0; i < this.childSelectedIndexes.length; i++) {
      this.travellers.children.push(
        this.children[this.childSelectedIndexes[i]]
      );
    }
    for (let i = 0; i < this.infantSelectedIndexes.length; i++) {
      this.travellers.infants.push(this.infants[this.infantSelectedIndexes[i]]);
    }
  }
  setdataOfcoupon() {
    this.couponData = this.staycationService.getOption();
    console.log(this.couponData, 'couponData');
    if (this.couponData?.discountedPrice.length > 0) {
      this.discountedPrice = this.couponData.discountedPrice;
      this.discountedValue = this.couponData.discountValue;
      console.log(this.discountedPrice, this.discountedValue);
    } else {
      this.discountedPrice = 'NA';
      this.discountedValue = 'NA';
    }
  }
  async bookStaycation() {
    this.TravellerInfoStaycation = await JSON.parse(
      localStorage.getItem('TravellerInfoStaycation')
    );
    console.log(this.TravellerInfoStaycation);
    if (this.TravellerInfoStaycation?.checked === true) {
      this.showDetails = false;
      const addTravellerInfo = {
        customDetails: this.TravellerInfoStaycation,
      };
      Object.entries(addTravellerInfo).forEach(([key, value]) => {
        this.stayCationTravellersDetails[key] = value;
      });
      console.log(this.stayCationTravellersDetails);
    }
    this.stayCationTravellersDetails.adults = this.stayCationTravellersDetails.adults?.filter(
      function (x) {
        return x !== undefined || null;
      }
    );

    this.stayCationTravellersDetails.children = this.stayCationTravellersDetails.children?.filter(
      function (x) {
        return x !== undefined || null;
      }
    );

    this.stayCationTravellersDetails.infants = this.stayCationTravellersDetails.infants?.filter(
      function (x) {
        return x !== undefined || null;
      }
    );

    if (
      this.stayCationTravellersDetails.adults?.length +
        this.stayCationTravellersDetails.children?.length +
        this.stayCationTravellersDetails.infants?.length ===
      0
    ) {
      let userList = {
        dateOfBirth: this.userDetails.dateOfBirth,
        email: this.userDetails.email,
        firstName: this.userDetails.firstName,
        gender: this.userDetails.gender,
        id: this.userDetails.id,
        idDetails: [
          {
            cityName: this.userDetails.idDetails[0].cityName,
            countryName: this.userDetails.idDetails[0].countryName,
            expiryDate: this.userDetails.idDetails[0].expiryDate,
            idNumber: this.userDetails.idDetails[0].idNumber,
            idType: this.userDetails.idDetails[0].idType,
          },
        ],
        isEmailVerified: this.userDetails.isEmailVerified,
        isMobileVerified: this.userDetails.isMobileVerified,
        mobileNo: this.userDetails.mobileNo,
      };
      if (this.customBook === false) {
        let userage = this.age(this.userDetails.dateOfBirth);
        if (userage >= 12) {
          this.stayCationTravellersDetails?.adults.push(userList);
        }
        if (userage >= 2 && userage < 12) {
          this.stayCationTravellersDetails?.children.push(userList);
        }
        if (userage < 2) {
          this.stayCationTravellersDetails?.infants.push(userList);
        }
      }
    }
    await this.setdataOfcoupon();
    this.isLoading = true;
    await this.staycationService
      .bookStaycations(
        this.staycationPreviewData,
        this.couponCoderes,
        this.stayCationTravellersDetails,
        this.stayCationTravellersDate.startDate,
        this.discountedPrice,
        this.discountedValue,
        this.vendorNames,
        this.staycationBooking
      )
      .then((returnvalue) => {
        console.log('return_in_stay_preview', returnvalue);
        var id = this.staycationService.getStaycationBookingId();
        Analytics.record({
          name: 'StaycationBooking',
          attributes: {
            package: this.staycationPreviewData?.packagename,
            duration:
              this.stayCationTravellersDate.startDate?.value?.toString() +
              ' to ' +
              this.stayCationTravellersDate.endDate?.value?.toString(),
            partner: '',
            ticketsize: (
              this.stayCationTravellersDetails?.adults?.length +
              this.stayCationTravellersDetails?.children?.length +
              this.stayCationTravellersDetails?.infants?.length
            ).toString(),
            traveldate: this.stayCationTravellersDate?.startDate?.value?.toString(),
            location: this.staycationPreviewData?.packageValues?.cityName,
            // age: Math.floor(timeDiff / (1000 * 3600 * 24) / 365).toString(),
            // birthday: this.userDetails?.dateOfBirth?.toString(),
            device:
              this.onAndroidPLatform || this.onIOSPlatform
                ? 'mobile or tab'
                : 'web',
            price: this.staycationPreviewData?.packageValues.fare?.totalFare?.toString(),
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
  toggle() {
    this.show = !this.show;
    if (this.show) this.buttonName = 'chevron-up-outline';
    else this.buttonName = 'chevron-down-outline';
  }
  activitytoggle() {
    this.activityshow = !this.activityshow;
    if (this.activityshow) this.activitybuttonName = 'chevron-up-outline';
    else this.activitybuttonName = 'chevron-down-outline';
  }
  previewDetails() {
    this.itineraryService.currentitinerary.subscribe((res) => {
      console.log(res, 'rsep');
      this.PreviewItenary = this.itineraryService.userItineraryData();
      this.previewItenaryDetails = this.PreviewItenary.dayPlanner;
      console.log(this.PreviewItenary);
    });
    function sum(a) {
      return (a?.length && parseFloat(a[0]) + sum(a.slice(1))) || 0;
    }
    if (this.previewItenaryDetails?.length > 0) {
      this.selectedTravellers = this.PreviewItenary.selectedTravellers;
      this.returnFlightFare = this.PreviewItenary.returnPlan;
      console.log(this.selectedTravellers, 'selected travellers');

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
      console.log(this.TotalPersons, 'TotalPersons');
    }
    //Flights
    let flightFare = [];
    let flightTaxPrice = [];
    let flightEquiFarePrice = [];
    let currencyType = [];

    let taxType = this.previewItenaryDetails?.map(
      (h) => h.flightDetails?.fareDetails
    );
    this.taxTypeFilter = taxType?.filter(function (x) {
      return x !== undefined || null;
    });
    if (this.taxTypeFilter?.length > 0) {
      this.taxTypeNames = Object.keys(this.taxTypeFilter[0]);
    }
    console.log(this.taxTypeNames, 'taxTypeNames');

    let Tax = this.taxTypeNames?.includes('totalTax');
    let Fare = this.taxTypeNames?.includes('equivFare');
    if (Tax === true) {
      this.totalTax = 'Tax';
    }
    if (Fare === true) {
      this.equivFare = 'Fare';
    }
    if (this.returnFlightFare?.length > 0) {
      if (this.returnFlightFare[0]?.flightDetails.fareDetails.totalTax) {
        this.totalTax = 'Tax';
      }
      if (this.returnFlightFare[0]?.flightDetails.fareDetails.equivFare) {
        this.equivFare = 'Fare';
      }
    }
    // return Flights
    this.returnFlight = this.PreviewItenary.returnPlan;
    for (let i = 0; i < this.PreviewItenary.returnPlan?.length; i++) {
      this.returnflightsArray?.push(
        this.PreviewItenary.returnPlan[i]?.flightDetails
      );
      currencyType?.push(
        this.PreviewItenary.returnPlan[i]?.flightDetails?.fareDetails?.totalFare
          .currencyCode
      );
      flightFare?.push(
        this.PreviewItenary.returnPlan[i]?.flightDetails?.fareDetails?.totalFare
          .amount
      );
      flightTaxPrice?.push(
        this.PreviewItenary.returnPlan[i]?.flightDetails?.fareDetails?.totalTax
          .amount
      );
      flightEquiFarePrice?.push(
        this.PreviewItenary.returnPlan[i]?.flightDetails?.fareDetails?.equivFare
          .amount
      );
    }
    console.log(this.returnflightsArray);
    // Normal Flights
    for (let i = 0; i < this.previewItenaryDetails?.length; i++) {
      this.flightsArray?.push(this.previewItenaryDetails[i]?.flightDetails);
      currencyType?.push(
        this.previewItenaryDetails[i]?.flightDetails?.fareDetails?.totalFare
          .currencyCode
      );
      flightFare?.push(
        this.previewItenaryDetails[i]?.flightDetails?.fareDetails?.totalFare
          .amount
      );
      flightTaxPrice?.push(
        this.previewItenaryDetails[i]?.flightDetails?.fareDetails?.totalTax
          .amount
      );
      flightEquiFarePrice?.push(
        this.previewItenaryDetails[i]?.flightDetails?.fareDetails?.equivFare
          .amount
      );

      this.flightsArray = this.flightsArray?.filter(
        (value) => Object.keys(value).length !== 0
      );
      console.log(this.flightsArray);
      let currencyTypeFilter = currencyType?.filter(function (x) {
        return x !== undefined || null;
      });
      let flightFareTotalPriceFilter = flightFare?.filter(function (x) {
        return x !== undefined || null;
      });
      let flightTaxPriceFilter = flightTaxPrice?.filter(function (x) {
        return x !== undefined || null;
      });
      let flightEquiFarePriceFilter = flightEquiFarePrice?.filter(function (x) {
        return x !== undefined || null;
      });

      if (currencyTypeFilter?.length > 0) {
        this.currencyTypeFilterTotal = currencyTypeFilter[0];
      }
      if (flightFareTotalPriceFilter?.length === 1) {
        if(flightFareTotalPriceFilter[0] == undefined || flightFareTotalPriceFilter[0] == null)
        {
          this.flightFareTotalForAllFlights = 0;
        }
        else {
          this.flightFareTotalForAllFlights = flightFareTotalPriceFilter[0];
        }
      } else {
        this.flightFareTotalForAllFlights = sum(
          flightFareTotalPriceFilter
        ).toFixed(1);
      }
      if (flightTaxPriceFilter?.length === 1) {
        if(flightTaxPriceFilter[0] !== undefined || flightTaxPriceFilter[0] !== null)
        {
          this.flightTaxPriceForAllFlights = 0;
        }
        else
        {
          this.flightTaxPriceForAllFlights = flightTaxPriceFilter[0];
        }
      } else {
        this.flightTaxPriceForAllFlights = sum(flightTaxPriceFilter).toFixed(1);
      }

      if (flightEquiFarePriceFilter?.length === 1) {
        if(flightEquiFarePriceFilter[0] !== undefined || flightEquiFarePriceFilter[0] !== null)
        {
          this.flightEquiFarePriceeForAllFlights = 0;
        }
        else
        {
          this.flightEquiFarePriceeForAllFlights = flightEquiFarePriceFilter[0];
        }
      } else {
        this.flightEquiFarePriceeForAllFlights = sum(
          flightEquiFarePriceFilter
        ).toFixed(1);
      }
      this.totalCurrencyType.push(this.currencyTypeFilterTotal);
      console.log(this.currencyTypeFilterTotal);
      console.log(this.flightFareTotalForAllFlights);
      console.log(this.flightTaxPriceForAllFlights);
      console.log(this.flightEquiFarePriceeForAllFlights);
    }
    //Hotels
    let hotelPrice = [];
    for (let i = 0; i < this.previewItenaryDetails?.length; i++) {
      this.hotelsArray?.push(this.previewItenaryDetails[i]?.hotelDetails);
      this.hotelsArray = this.hotelsArray?.filter(
        (value) => Object.keys(value).length !== 0
      );
      console.log(this.hotelsArray);
      hotelPrice.push(
        this.previewItenaryDetails[i].hotelDetails?.selectedRoom?.netPrice
      );

      let hotelPriceFilter = hotelPrice?.filter(function (x) {
        return x !== undefined || null;
      });
      console.log(hotelPriceFilter);

      if (hotelPriceFilter?.length === 1) {
        if(hotelPriceFilter[0] == undefined || hotelPriceFilter[0] == null)
        {
          this.hotelPriceTotal = 0;
        }
        else
        {
          this.hotelPriceTotal = hotelPriceFilter[0];
        }
      } else {
        this.hotelPriceTotal = sum(hotelPriceFilter)?.toFixed(1);
      }
      this.hotelPriceType = this.previewItenaryDetails?.hotelDetails?.selectedRoom?.currency;
      this.totalCurrencyType.push(this.hotelPriceType);
      console.log(
        this.totalCurrencyType,
        this.hotelPriceTotal,
        this.hotelPriceType
      );
    }
    ///Activites
    let activityPriceDetails = [];
    for (let i = 0; i < this.previewItenaryDetails?.length; i++) {
      for (
        let j = 0;
        j < this.previewItenaryDetails[i].activityDetails?.length;
        j++
      ) {
        activityPriceDetails.push(
          this.previewItenaryDetails[i]?.activityDetails[j]?.grandtotal
        );
      }
      var activityPriceDetailsfiltered = activityPriceDetails.filter(function (
        x
      ) {
        return x !== undefined || null;
      });
      if (activityPriceDetailsfiltered.length === 1) {
        if(activityPriceDetailsfiltered[0] == undefined || activityPriceDetailsfiltered[0] == null)
        {
          this.activityPrice = 0;
        }
        else
        {
          this.activityPrice = activityPriceDetailsfiltered[0];
        }
      } else {
        this.activityPrice = sum(activityPriceDetailsfiltered).toFixed(1);
      }
      console.log(activityPriceDetailsfiltered);
      console.log(this.activityPrice, this.activityPriceCurrency);
    }

    ///GrandTotal

    var totalCurrency = this.totalCurrencyType?.filter(function (x) {
      return x !== undefined || null;
    });

    let totalCurrencyreturn = totalCurrency?.every(
      (currentval) => currentval === 'INR'
    );
    console.log(totalCurrency, totalCurrencyreturn);
    if (totalCurrencyreturn === true) {
      this.GrandTotalCurrency = 'INR';
    }
    this.GrandTotalAmount = [
      this.flightFareTotalForAllFlights,
      this.hotelPriceTotal?.toString(),
      this.activityPrice?.toString(),
    ];
    console.log(totalCurrency, this.GrandTotalAmount);
    var grandtotalfilter = this.GrandTotalAmount.filter(function (x) {
      return x !== undefined || null;
    });

    if (grandtotalfilter.length === 1) {
      this.GrandTotal = grandtotalfilter[0];
    } else {
      this.GrandTotal = sum(grandtotalfilter).toFixed(1);
    }
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

  async revalidatingApi() {
    this.submitted = true;
    if (this.dynamicForm.invalid) {
      this.noTravellers = true;
      return;
    }
    this.onSubmit();
  }

  openRoomSelection() {
    this.modalDisplay = false;
    this.validationModal = false;
    this.selectRoomModal = false;
    this.errorWhileValidation = false;
    this.errorWhileBooking = false;
  }
  editTraveller(member) {
    console.log('member', member);
    this.registerForm.controls.firstName.setValue(member.firstName);
    this.registerForm.controls.gender.setValue(member.gender);
    this.registerForm.controls.email.setValue(member.email);
    let mobileNo = member.mobileNo.slice(-10);
    this.registerForm.controls.mobileNo.setValue(mobileNo);
    if (member.mobileNo.includes('+91')) {
      this.registerForm.controls.countryCode.setValue('+91');
    }
    if (member.mobileNo.includes('+1')) {
      this.registerForm.controls.countryCode.setValue('+1');
    }
    if (member.relationshipToUser == 'self') {
      this.registerForm.controls.dateOfBirth.setValue(
        member.dateOfBirth.toISOString().split('T')[0]
      );
    } else {
      this.registerForm.controls.dateOfBirth.setValue(
        member.dateOfBirth.split('T')[0]
      );
    }
    if (member.idDetails[0]?.idNumber.length > 0) {
      this.registerForm
        .get('passport.number')
        .setValue(member.idDetails[0].idNumber);
      this.registerForm
        .get('passport.country')
        .setValue(member.idDetails[0].countryName);
      this.registerForm
        .get('passport.expiry')
        .setValue(member.idDetails[0].expiryDate.split('T')[0]);
    }

    console.log(member);
    this.editTravellerId = member.id;
    this.editTravellerRelationToUser = member.relationshipToUser;
    $('#editTraveller').modal('show');
    // for (let i = 0; i < this.travellersList.length; i++) {
    //   if (id == this.travellersList[i].id) {
    //     this.selectedtraveller = i;
    //     break;
    //   }
    // }
  }
}
