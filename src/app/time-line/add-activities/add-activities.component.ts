import { Component, OnInit } from '@angular/core';
import {
  DestinationsApisService,
  Activities,
} from '../destinations-apis.service';
import { ModalController } from '@ionic/angular';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { UserItineraryService } from '@app/service-module/user-itinerary.service';

@Component({
  selector: 'app-add-activities',
  templateUrl: './add-activities.component.html',
  styleUrls: ['./add-activities.component.scss'],
})
export class AddActivitiesComponent implements OnInit {
  cityid: number;
  activitiesData: Activities[];
  activitiesDatares: Activities[];
  cityname: string;
  errorMessage: string;
  selectedactivitiesString = '';
  isErroractivity = false;
  isLoadingactivity = false;
  showdata = false;
  showviewmoredata = false;
  selectedActivity = [];
  activitylist_data = [];
  selectedActivityNames = [];
  startdateformodal: Date;
  enddateformodal: Date;
  timeslotdataarray: any;
  showRightPart: string;
  aBooleanValueforActivityPreference = false;
  filterDatadates: any = [];
  monthNyear: Date;
  timeslotsData: any = [];
  activitySlotdata: any = [];
  pickupointsarray: any = [];
  vouchercount = [];
  cartarray: any = [];
  showaddCart = false;
  activityfeatures: any;
  timelineData: any;
  productsdata = [];
  productsarray = [];
  addactivitystatus = false;
  productinfocount = 0;
  voucherform = this.formBuilder.group({
    voucherType: ['', [Validators.required]],
    voucher: ['', [Validators.required]],
    pickUp: ['', [Validators.required]],
    language: ['', [Validators.required]],
  });

  customerInfoform = this.formBuilder.group({
    email: ['', [Validators.required]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
  });

  productsInfoform = this.formBuilder.group({
    productFormArray: this.formBuilder.array([]),
  });
  activityObject: any;
  activitydetailsbyid: any;
  showcheckavailability = false;
  minDate: Date;
  maxDate: Date;
  shownoslots: boolean;
  resultDatabyApi: any;
  booleanvalue = false;
  showfromvalidationerror: boolean;
  selectedCityId;
  productResult: any;
  showspinnerProceed = false;
  showcustomerInfo = false;
  showinvalidcustomerInfoform: boolean;
  notFound: boolean;
  stepcount = 0;
  totalcount = 0;
  showsteps: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private destinationsApisService: DestinationsApisService,
    public modalController: ModalController,
    public destinationservice: DestinationsApisService,
    private UserItinerary: UserItineraryService
  ) {
    this.activityfeatures = {
      pickup: '',
      activityName: '',
      activityCity: '',
      activityCountry: '',
      activityDate: '',
      products: [],
      grandtotal: 0,
      currency: '',
    };
  }

  ngOnInit() {
    console.log('well', this.voucherform.value.voucher);
    let currentDate = new Date();
    this.minDate = new Date(currentDate);
    this.maxDate = new Date(currentDate.getFullYear() + 1, 11, 31);
    this.getcityfromtimeline();
    this.showviewmoredata = false;
  }

  getcityfromtimeline() {
    this.destinationsApisService.getthedatafromtimeline.subscribe((res: {}) => {
      if (res) {
        this.getCtyIdFromCityData(res);
      }
    });
  }

  getCtyIdFromCityData(timelinedata: {}) {
    this.selectedCityId = this.destinationsApisService.getSelectedCityId();
    this.showviewmoredata = false;
    const timelinedataObject: any = timelinedata;
    try {
      if (timelinedataObject === undefined) {
        throw 'undefined city object from time line';
      }
      if (!timelinedataObject) {
        throw 'incorrect city object from time line';
      }
      this.startdateformodal = timelinedataObject?.date?.start;
      this.enddateformodal = timelinedataObject?.date?.end;
      this.getdatafromapi(
        timelinedataObject?.cityName,
        timelinedataObject?.latitude,
        timelinedataObject?.longitude,
        timelinedataObject?.date?.start,
        timelinedataObject?.date?.end
      );
    } catch (error) {
      console.error('NO ID Found To the CITY');
      this.isErroractivity = true;
      this.errorMessage = 'No activity found';
      this.showdata = false;
    }
  }

  getdatafromapi(
    cityName: string,
    lat: string,
    lng: string,
    startDate: Date,
    endDate: Date
  ) {
    this.activitiesData = [];
    this.isLoadingactivity = true;
    this.isErroractivity = false;
    if (cityName) {
      this.destinationsApisService.showShowActivityPreferenseBooleanValue.subscribe(
        (res) => {
          this.aBooleanValueforActivityPreference = res;
        }
      );
      let activitydata = JSON.parse(
        sessionStorage.getItem('activityPreference')
      );
      if (activitydata != null) {
        console.log('dudeeeeee eyy', activitydata);
        for (let i = 0; i < activitydata.length; i++) {
          this.selectedactivitiesString =
            this.selectedactivitiesString + activitydata[i]?.categoryCode + ',';
        }
      }
      if (this.aBooleanValueforActivityPreference === true) {
        this.destinationsApisService.latestActivityPreference.subscribe(
          (res) => {
            this.selectedActivity = res;
            for (let i = 0; i < this.selectedActivity.length; i++) {
              this.selectedActivityNames.push(this.selectedActivity[i]?.name);
            }
            for (let i = 0; i < this.selectedActivity.length; i++) {
              this.selectedactivitiesString =
                this.selectedactivitiesString +
                this.selectedActivity[i]?.categoryCode +
                ',';
            }
          }
        );
      } else {
        if (this.selectedactivitiesString == '') {
          this.selectedactivitiesString = '';
        }
      }
      this.destinationsApisService
        .getactivitiesbasedonselectedcity(
          lat,
          lng,
          this.selectedactivitiesString.slice(0, -1),
          startDate,
          endDate
        )
        .subscribe(
          (res): any => {
            if (res) {
              this.isLoadingactivity = false;
              if (res.length === 0) {
                this.errorMessage = 'No Data Found';
                this.isErroractivity = true;
              } else {
                this.isErroractivity = false;
                this.showdata = true;
              }
              this.activitiesData = res;
              this.activitylist_data = this.activitiesData;
            }
            this.selectedactivitiesString = '';
          },
          (err) => {
            this.isErroractivity = true;
            this.selectedactivitiesString = '';
            this.isLoadingactivity = false;
            this.showdata = false;
            if (err.statusText) {
              this.errorMessage = 'No activity found in ' + cityName;
            } else {
              this.errorMessage = 'No Data Found';
            }
          }
        );
    }
  }

  activitiesTab() {
    this.destinationsApisService.changeViewStatus('ActivitiesPref');
  }

  act_back() {
    this.destinationsApisService.changeViewStatus('');
  }

  Searchactivities(e: any) {
    let searchdata: any[];
    // let searchdata1: any[];
    // let searchdata2: any[];
    if (e.target.value.length > 0) {
      searchdata = this.activitylist_data.filter((res) => {
        return (
          res.activityName
            .toLocaleLowerCase()
            .includes(e.target.value.toLocaleLowerCase()) ||
          res.city
            .toLocaleLowerCase()
            .includes(e.target.value.toLocaleLowerCase()) ||
          res.country
            .toLocaleLowerCase()
            .includes(e.target.value.toLocaleLowerCase())
        );
      });

      // searchdata1 = this.activitylist_data.filter((res) => {
      //   return res.city
      //     .toLocaleLowerCase()
      //     .includes(e.target.value.toLocaleLowerCase());
      // });
      // searchdata2 = this.activitylist_data.filter((res) => {
      //   return res.country
      //     .toLocaleLowerCase()
      //     .includes(e.target.value.toLocaleLowerCase());
      // });
      console.log(searchdata, 'searchdata');
      this.activitiesData = searchdata;
      if (searchdata.length == 0) {
        this.notFound = true;
      } else {
        this.notFound = false;
      }
      // if (searchdata1.length !== 0) this.activitiesData = searchdata1;
      // if (searchdata2.length !== 0) this.activitiesData = searchdata2;
    } else {
      this.activitiesData = this.activitylist_data;
    }
  }

  viewMore(activitiesData) {
    this.showsteps = false;
    this.showdata = false;
    this.isLoadingactivity = true;
    const activityObject = {
      activitiesPreferences: this.selectedActivityNames,
      activityData: activitiesData,
      startdate: new Date(this.startdateformodal),
      enddate: new Date(this.enddateformodal),
      activityfeature: '',
    };
    this.activityObject = activityObject;
    this.destinationservice
      .getactivitydetailsbyid(activityObject?.activityData.uuid)
      .subscribe(
        (res) => {
          if (res) {
            this.isLoadingactivity = false;
            this.isErroractivity = false;
            this.activitydetailsbyid = res;
            this.showdata = false;
            this.showviewmoredata = true;
          }
        },
        (err) => {
          this.isErroractivity = true;
          this.errorMessage = err;
        }
      );
    this.getcityfromtimelinetomodel();
    this.monthNyear = activityObject.startdate;
    this.filterDatadates = [];
    this.pickupointsarray = [];
    this.destinationservice
      .gettimeslotstoactivities(activityObject?.activityData.uuid)
      .subscribe((res) => {
        let data: any = [];
        data = res;
        let dateStringfrom =
          activityObject.startdate.getFullYear() +
          '-' +
          ('0' + (activityObject.startdate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + activityObject.startdate.getDate()).slice(-2);
        let dateStringto =
          activityObject.enddate.getFullYear() +
          '-' +
          ('0' + (activityObject.enddate.getMonth() + 1)).slice(-2) +
          '-' +
          ('0' + activityObject.enddate.getDate()).slice(-2);
        data.map((res) => {
          let dataDate = new Date(res.day);
          let dataDateString =
            dataDate.getFullYear() +
            '-' +
            ('0' + (dataDate.getMonth() + 1)).slice(-2) +
            '-' +
            ('0' + dataDate.getDate()).slice(-2);
          if (
            dataDateString >= dateStringfrom &&
            dataDateString <= dateStringto
          ) {
            this.filterDatadates.push(res);
          }
        });

        this.minDate = new Date(this.filterDatadates[0].day);
        this.maxDate = new Date(
          this.filterDatadates[this.filterDatadates.length - 1].day
        );
      });
    this.destinationservice
      .getpickuppointstoactivities(activityObject?.activityData.uuid)
      .subscribe((res) => {
        this.pickupointsarray = res;
      });
  }

  getcityfromtimelinetomodel() {
    this.timelineData = {};
    this.destinationservice.getthedatafromtimeline.subscribe((res: {}) => {
      if (res) {
        // this.getCtyIdFromCityData(res);
        this.timelineData = res;
      }
    });
  }

  getDatetotimeslots(day) {
    this.productinfocount = 0;
    this.timeslotsData = [];
    this.activitySlotdata = [];
    this.timeslotdataarray = [];
    this.activityfeatures.activityDate = day;
    this.activityfeatures.activityName = this.activityObject?.activityData.activityName;
    this.activityfeatures.activityCity = this.timelineData.id;
    this.destinationservice
      .getlanguageresultstoactivites(
        this.activityObject?.activityData.uuid,
        day
      )
      .subscribe(
        (res) => {
          if (res) {
            this.shownoslots = false;
            this.timeslotdataarray = res;
            this.timeslotsData = this.timeslotdataarray[0]?.groups[0]?.slots;
            let new_activity_Data = this.timeslotsData.map((h) => {
              let activityObject = h;
              activityObject.status = false;
              return activityObject;
            });
            this.timeslotsData = new_activity_Data;
          } else {
            this.shownoslots = true;
          }
        },
        (err) => {
          this.shownoslots = true;
        }
      );
  }

  getactivitySlot(i, num) {
    this.stepcount = 3;
    this.cartarray = [];
    this.voucherform.reset();
    i.status = !i.status;
    this.timeslotsData.map((res, id) => {
      if (id != num) {
        res.status = false;
      }
    });
    this.activitySlotdata = [];
    if (i.status == true) {
      this.activitySlotdata = i;
      let itenaryData = this.UserItinerary.userItineraryData();

      itenaryData.destinationCities.map((res) => {
        if (res.cityName == this.timelineData.id) {
          this.activityfeatures.activityCountry = res.countryName;
        }
      });
    }
  }

  trimString(text, range) {
    return text?.length > range ? text.substr(0, range - 1) + '...' : text;
  }

  getvouchertype(e) {
    this.showaddCart = false;
    this.vouchercount = [];
    this.productsdata = [];
    let data = [];
    this.activitySlotdata?.products.map((res) => {
      if (res.name == e.target.value) {
        data.push(res);
      }
    });
    this.productsdata = data;
    for (let i = data[0].minBuy; i <= data[0].maxBuy; i++) {
      this.vouchercount.push(i);
    }
  }

  getvoucherval() {
    this.showaddCart = true;
    this.addactivitystatus = false;
  }
  addtocart() {
    this.stepcount = 4;
    if (this.voucherform.value.pickUp && this.voucherform.value.language) {
      this.showfromvalidationerror = false;
      let val = 1;
      if (this.cartarray.length < 1) {
        let lang = '';
        this.activitySlotdata.languages.map((res) => {
          if (this.voucherform.value.language === res.code) {
            lang = res.name;
          }
        });
        let valData = {
          type: this.productsdata[0].type,
          productIdentifier: this.productsdata[0].productId,
          quantity: parseInt(this.voucherform.value.voucher),
          language: this.voucherform.value.language,
          pickup: this.voucherform.value.pickUp,
          languageName: lang,
          price: this.productsdata[0].retailPrice.value,
          totalprice:
            this.productsdata[0].retailPrice.value *
            parseInt(this.voucherform.value.voucher),
          currency: this.productsdata[0].retailPrice.currency,
        };
        this.activityfeatures.pickup = this.voucherform.value.pickUp;
        this.cartarray.push(this.voucherform.value);
        this.productsarray.push(valData);
        val = 0;
        this.voucherform.reset();
        this.showaddCart = false;
        this.addactivitystatus = true;
      } else {
        this.cartarray.map((res) => {
          if (res.voucherType === this.voucherform.value.voucherType) {
            val = 0;
          }
        });
      }
      if (val == 1) {
        let lang2 = '';
        this.activitySlotdata.languages.map((res) => {
          if (this.voucherform.value.language === res.code) {
            lang2 = res.name;
          }
        });
        let valData = {
          type: this.productsdata[0].type,
          productIdentifier: this.productsdata[0].productId,
          quantity: parseInt(this.voucherform.value.voucher),
          language: this.voucherform.value.language,
          pickup: this.voucherform.value.pickUp,
          languageName: lang2,
          price: this.productsdata[0].retailPrice.value,
          totalprice:
            this.productsdata[0].retailPrice.value *
            parseInt(this.voucherform.value.voucher),
          currency: this.productsdata[0].retailPrice.currency,
        };
        this.activityfeatures.pickup = this.voucherform.value.pickUp;
        this.cartarray.push(this.voucherform.value);
        this.productsarray.push(valData);
        this.voucherform.reset();
        this.showaddCart = false;
        this.addactivitystatus = true;
      }
    } else {
      this.showfromvalidationerror = true;
    }
  }

  deletecart(p) {
    this.cartarray.splice(p, 1);

    if (this.cartarray.length === 0) {
      this.addactivitystatus = false;
    }
  }

  // use it for navigation
  showactivity() {
    this.productinfocount = 0;
    this.showdata = true;
    this.showviewmoredata = false;
    // use below elements for the activity data
    this.cartarray = [];
    this.showfromvalidationerror = false;
    this.shownoslots = false;
    this.timeslotsData = [];
    this.activitySlotdata = [];
    this.productResult = [];
    this.productsarray = [];
    this.voucherform.reset();
    this.showcustomerInfo = false;
    this.customerInfoform.reset();
  }

  checkavailability() {
    this.cartarray = [];
    this.showcheckavailability = !this.showcheckavailability;
    this.showfromvalidationerror = false;
    this.shownoslots = false;
    this.timeslotsData = [];
    this.activitySlotdata = [];
    this.productResult = [];
    this.productsarray = [];
    this.voucherform.reset();
    this.showcustomerInfo = false;
    this.customerInfoform.reset();
    this.stepcount = 1;
    this.totalcount = 6;
    this.showsteps = true;
  }

  onChangeEvent(event) {
    this.timeslotsData = [];
    this.activitySlotdata = [];
    let date = new Date(event.value);
    let dataDate =
      date.getFullYear() +
      '-' +
      ('0' + (date.getMonth() + 1)).slice(-2) +
      '-' +
      ('0' + date.getDate()).slice(-2);
    this.getDatetotimeslots(dataDate);
    this.stepcount = 2;
  }

  creatCart_Api() {
    this.stepcount = 5;
    this.addactivitystatus = false;
    this.showspinnerProceed = true;
    let data = {
      activityName: this.activityfeatures.activityName,
      activityCity: this.timelineData.cityName,
      activityCountry: this.timelineData.countryName,
      activityDate: this.activityfeatures.activityDate,
      grandtotal: 0,
      productsInfo: [],
    };

    let i = 0;
    while (i < this.productsarray.length) {
      let prod = {
        pickup: this.productsarray[i].pickup,
        type: this.productsarray[i].type,
        productIdentifier: this.productsarray[i].productIdentifier,
        quantity: this.productsarray[i].quantity,
        language: this.productsarray[i].language,
        price: this.productsarray[i].price,
        totalprice: this.productsarray[i].totalprice,
      };
      i++;
      data.productsInfo.push(prod);
    }
    let sum = 0;
    this.productsarray.map((res) => {
      sum = sum + res.totalprice;
    });

    data.grandtotal = sum;
    this.destinationservice.createCartAPI(data).subscribe((res) => {
      if (res) {
        let resdata: any;
        resdata = res;
        this.resultDatabyApi = resdata;
        this.getallcartvalues(data, res);
        console.log('res', res);
      }
    });
  }

  get f() {
    return this.productsInfoform.controls;
  }
  get t() {
    return this.f.productFormArray as FormArray;
  }

  get productsInfoformfun() {
    return this.productsInfoform.get('productFormArray') as FormArray;
  }

  addactivity() {
    this.stepcount = 6;
    if (!this.customerInfoform.invalid) {
      this.showinvalidcustomerInfoform = false;
      this.productResult.refundPolicies = this.activitydetailsbyid?.refundPolicies;
      this.productResult.customerInfo.requiredFields = this.customerInfoform.value;
      this.destinationsApisService.setSelectedCityId(this.selectedCityId);
      this.activityfeatures.products = this.productsarray;
      let sum = 0;
      this.activityfeatures.products.map((res) => {
        sum = sum + res.totalprice;
      });
      this.activityfeatures.grandtotal = sum;
      this.activityfeatures.currency = this.productsarray[0].currency;
      // activityObject used as Data Model but not as end Data Object...!!
      this.activityObject.activityfeature = this.productResult;
      //ToDo: use this this.activitySlotdata
      console.log('well p', this.productResult);
      this.destinationservice.selected_activities(true, this.productResult);
      this.showviewmoredata = false;
      this.showdata = true;
      if (window.screen.width < 992) {
        this.destinationservice.changeViewStatus('');
      }
      this.showcustomerInfo = false;
      this.customerInfoform.reset();
      // ToDo : use it if needed
      sessionStorage.removeItem('activityPreference');
    } else {
      this.showinvalidcustomerInfoform = true;
    }
    this.showsteps = false;
  }

  getallcartvalues(data, res) {
    let time = '';
    this.timeslotsData.map((res) => {
      if (res.status == true) {
        time = res.time;
      }
    });
    let sum = 0;
    this.productsarray.map((res) => {
      sum = sum + res.totalprice;
    });
    let new_Data = res.productsInfo.map((h, i) => {
      let resResult = h;
      resResult.productName = this.cartarray[i].voucherType;
      resResult.pickup = this.cartarray[i].pickUp;
      resResult.language = this.cartarray[i].language;
      resResult.price = this.productsarray[i].price;
      resResult.totalprice = this.productsarray[i].totalprice;
      return resResult;
    });
    res.productsInfo = new_Data;
    let result = {
      cartId: res.cartId,
      activityName: data.activityName,
      activityCity: data.activityCity,
      activityCountry: data.activityCountry,
      activityDate: data.activityDate,
      activityId: this.activitydetailsbyid.uuid,
      coverImageUrl: this.activitydetailsbyid.coverImageUrl,
      description: this.activitydetailsbyid.description,
      duration: this.activitydetailsbyid.duration,
      grandtotal: sum,
      time: time,
      startDate: this.activityObject.startdate,
      endDate: this.activityObject.enddate,
      customerInfo: {
        requiredFields: {
          firstname: '',
          lastname: '',
          email: '',
        },
      },
      productsInfo: res.productsInfo,
    };
    this.productResult = result;
    console.log('result', this.productResult);
    this.productinfocount = 0;
    this.productResult.productsInfo.map((res) => {
      console.log('cc', res.quantity);
      if (res.requiredFields.length > 0) {
        this.productinfocount = this.productinfocount + res.quantity;
      }
    });
    for (let i = 0; i < this.productinfocount; i++) {
      this.t.push(
        this.formBuilder.group({
          email: ['', [Validators.required]],
          firstName: ['', [Validators.required]],
          lastName: ['', [Validators.required]],
        })
      );
    }
    this.showspinnerProceed = false;
    this.showcustomerInfo = true;
    this.showcheckavailability = false;
  }
}
