import { DatePipe } from '@angular/common';
import { CitiesListService } from './../../service-module/cities-list.service';
import { City } from '@ojashub/voyaah-common';
import { UserItineraryService } from './../../service-module/user-itinerary.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { MenuController } from '@ionic/angular';
import { IonSlides } from '@ionic/angular';
import { TravelPackage } from '@ojashub/voyaah-common';
import { environment } from '@environments/environment';
import { StaycationPackagesService } from '@app/service-module/staycation-packages.service';
import { AccountService } from '@app/account/services';
import { ChangeNotifyService } from '../../service-module/change-notify.service';
import { DestinationsApisService } from '@app/time-line/destinations-apis.service';
declare var $;
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  providers: [DatePipe],
})
export class HomePage implements OnInit {
  @ViewChild(IonSlides) slides: IonSlides;
  @ViewChild('slideWithNav1', { static: false }) slideWithNav1: IonSlides;
  @ViewChild('slideWithNav2', { static: false }) slideWithNav2: IonSlides;
  @ViewChild('slideWithNav3', { static: false }) slideWithNav3: IonSlides;
  @ViewChild('slideWithNav4', { static: false }) slideWithNav4: IonSlides;
  @ViewChild('slidesRef') viewer: IonSlides;

  packages: TravelPackage[];
  packageData: TravelPackage[];
  adultplus = '';
  adultminus = '';
  childplus = '';
  childminus = '';
  inftplus = '';
  inftminus = '';
  date: Date;
  minDate: Date;
  maxDate: Date;
  adultscount = 1;
  childrencount = 0;
  infantscount = 0;
  tocitylist = [];
  tocityitarate = [];
  showconformcard = false;
  showhomecard = true;
  stars = [1, 2, 3, 4, 5];
  setcount = 0;
  citiesdata: any;
  datafromlocals: any;
  fromcitysearchTerm: FormControl = new FormControl();
  tocitysearchTerm: FormControl = new FormControl();
  filterfromdata: any = [];
  filtertodata = [];
  setorigincityname: string;
  setdestinationcityname: string;
  showtocity = false;
  showfromcity = false;
  fromCity: string;
  toCity: string;
  activeTab = 'hotel';
  timerange = new FormGroup({
    start: new FormControl('', Validators.required),
    end: new FormControl('', Validators.required),
  });
  confirmdestinationDates = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  setFromcard;
  timelinearray = [];
  todestinationsarray = [];
  currentDate: Date;
  currentOriginCity: City;
  currentdestinationCity: City;
  confirmOrigincity: City;
  confirmDestinationcities: City[];
  getFromCityId: number;
  getToCityId: number;
  featuredPackeges: any = [];
  bestValuePackeges: any = [];
  categoryPackages: any = [];
  fromCityDisp: boolean;
  toCityDisp: boolean;
  dateReq = '';
  registerForm: FormGroup;
  toastMsg = false;
  submitted = false;
  paySucess = '';
  width: any;
  height: any;
  headingFlag: any = false;
  disablePrevBtn = 1;
  disableNextBtn = 0;
  exploreDestinationsCategory: any = [];
  slideOptsOne = {
    initialSlide: 0,
    slidesPerView: 3,
  };
  slideOptsTwo = {
    initialSlide: 0,
    slidesPerView: 5,
  };
  slideOptsThree = {
    initialSlide: 0,
    slidesPerView: 3,
  };

  slideOptsfour = {
    initialSlide: 0,
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 3,
      },
      920: {
        slidesPerView: 4,
      },
    },
  };
  slideOptsfive = {
    initialSlide: 0,
    breakpoints: {
      320: {
        slidesPerView: 1,
      },
      576: {
        slidesPerView: 3,
      },
      920: {
        slidesPerView: 4,
      },
    },
  };

  hotelImages = [
    {
      image: '../assets/images/trawex.png',
    },
    {
      image: '../assets/images/fk.png',
    },
   
    {
      image: '../assets/images/cred.png',
    },
    {
      image: '../assets/images/loyaltyrewardz-logo-dark.png',
    },
    {
      image: '../assets/images/trawex.png',
    },

  ];
  activityImages = [
    {
      image: '../assets/images/cred.png',
    },
  ];
  flightImages = [
    {
      image: '../assets/images/trawex.png',
    },
  ];
  businessImages = [
    {
      image: '../assets/images/fk.png',
    },
  ];

  // <!-- package for mobile starts here-->

  slideOptsOnemobile = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: {
      delay: 3100,
    },
  };
  slideOptsTwomobile = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: {
      delay: 3600,
    },
  };
  slideOptsThreemobile = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: {
      delay: 3900,
    },
  };
  slideOpts = {
    initialSlide: 0,
    // slidesPerView: 3,
    // autoplay: {
    //   delay: 2000,
    // },
    // loop: true,
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1,
      },
      // when window width is >= 640px
      576: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 2,
      },
      920: {
        slidesPerView: 3,
      },
    },
  };
  slideOptsMobileView = {
    initialSlide: 0,
    slidesPerView: 1,
    autoplay: {
      delay: 1500,
    },
    loop: true,
  };
  // <!-- package for mobile ends here -->

  beachdata = [];
  Hillsdata = [];
  forestdata = [];
  islanddata = [];
  desertdata = [];
  lakesdata = [];
  metrodata = [];
  yogadata = [];
  historydata = [];
  adventuredata = [];
  explorePackage: any;
  production = false;
  partnetName = false;

  patnerName: any;
  partnerNameResp: any;
  fromAbout: boolean;
  fromcitynameverfication: string;
  tocitynameverfication: string;
  dayPlanner: any;
  toWholeData: any;
  custom = 'custom';
  invalidFrom1: boolean = false;
  invalidTo1: boolean = false;
  copyWidth: number;
  lastArrow: boolean;
  firstArrow: boolean;
  multiInputs: FormGroup = this.formBuilder.group({
    arrayInputs: this.formBuilder.array([]),
  });
  arrayInputs: FormArray;
  constructor(
    private route: Router,
    private activatedRoute: ActivatedRoute,
    private citiesListService: CitiesListService,
    private userItineraryService: UserItineraryService,
    private datePipe: DatePipe,
    private menuCtrl: MenuController,
    private destinationsApisService: DestinationsApisService,
    private staycationService: StaycationPackagesService,
    private formBuilder: FormBuilder,
    private ChangeNotifyService: ChangeNotifyService
  ) {
    this.userItineraryService.currentRemovedData.subscribe((res) => {
      console.log(res);
      this.paySucess = res;
      if (res == 'delete') {
        this.timerange.controls.start.setValue('');
        this.timerange.controls.end.setValue('');
        this.setdestinationcityname = '';
        this.setorigincityname = '';
        this.adultscount = 1;
        this.childrencount = 0;
        this.infantscount = 0;
      }
    });
    this.userItineraryService.currrentDates.subscribe((res) => {
      console.log(res);
      // let date=res
      if (this.paySucess !== 'delete') {
        if (res) {
          if (res.startDate)
            this.timerange.controls.start.setValue(res.startDate);
          if (res.endDate) this.timerange.controls.end.setValue(res.endDate);
        }
      }
    });
    this.staycationService.currentpartnerClose.subscribe((status) => {
      let partnerNamecatch = localStorage.getItem('partnerName');
      console.log(partnerNamecatch);
      if (status === true) {
        this.partnetName = false;
      }
    });

    this.production = environment.production;
    this.currentOriginCity = this.userItineraryService.userItineraryData().originCity;
    console.log(this.currentOriginCity);

    this.activatedRoute.params.subscribe((res) => {
      console.log(res, '111111111111', this.arrayInputs);
      const data = this.userItineraryService.userItineraryData();
      let cities = data.destinationCities;
      this.setFromcard = res.setcard;
      if (this.setFromcard === 'frmAbt') {
        this.scrollToContact();
      }
      if (this.setFromcard === 'confirmDesitinations') {
        this.showconformcard = true;
        this.showhomecard = false;
        this.confirmDesitinations();
      }
      if (this.arrayInputs == undefined) {
        console.log(cities);
        this.commonLoop(cities, 3);
      } else if (cities.length - 1 != this.arrayInputs?.length) {
        this.commonLoop(cities, 4);
      }
    });
    this.route.events.subscribe(async (res) => {
      const data = this.userItineraryService.userItineraryData();
      let cities = data.destinationCities;
      console.log(
        res,
        'q222222222',
        this.arrayInputs,
        cities,
        this.arrayInputs?.length
      );
      // this.arrayInputs = undefined;
      if (res instanceof NavigationEnd) {
        if (res.url == '/?setcard=true') {
          setTimeout(function () {
            document.getElementById('contactDiv').scrollIntoView();
          }, 200);
        }
      }

      if (this.arrayInputs == undefined) {
        console.log(cities);
        await this.commonLoop(cities, 1);
      } else if (cities.length - 1 != this.arrayInputs?.length) {
        await this.commonLoop(cities, 2);
      }
    });
    this.staycationService.trackStaycationData.subscribe((status) => {
      console.log('status');

      if (status == true) {
        this.getFeaturedList();
        let partnerNamecatch = localStorage.getItem('partnerName');
        if (partnerNamecatch?.length > 0) {
          this.partnetName = true;
        } else {
          this.partnetName = false;
        }
      }
    });
  }
  omit_special_char(event) {
    var k;
    k = event.charCode;
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 8 ||
      k == 32 ||
      (k >= 48 && k <= 57)
    );
  }
  ngOnInit(): void {
    // console.log(window.innerWidth, window.innerHeight);
    this.width = window.innerWidth;
    this.copyWidth = window.innerWidth;
    let currentDate = new Date();
    this.minDate = new Date(currentDate);
    this.maxDate = new Date(currentDate.getFullYear() + 1, 11, 31);
    const userItineraryData = this.userItineraryService.userItineraryData();
    console.log(userItineraryData, 'userItineraryData');

    if (userItineraryData.originCity?.cityName) {
      this.dayPlanner = userItineraryData?.dayPlanner;
      this.setorigincityname =
        userItineraryData.originCity.cityName +
        ' , ' +
        userItineraryData.originCity.countryName;
      this.setdestinationcityname = userItineraryData?.destinationCities
        ? userItineraryData?.destinationCities[0]?.cityName +
          ' , ' +
          userItineraryData.destinationCities[0]?.countryName
        : '';
      this.adultscount = userItineraryData.travellers.adultCount;
      this.childrencount = userItineraryData.travellers.childCount;
      this.infantscount = userItineraryData.travellers.infantCount;
      this.getFromCityId = userItineraryData.originCity.id;
      this.getToCityId = userItineraryData?.destinationCities[0]?.id;
      const dateCurrent = this.datePipe.transform(currentDate, 'yyyy/MM/dd');
      const dateStart = this.datePipe.transform(
        new Date(userItineraryData.startDate),
        'yyyy/MM/dd'
      );
      const dateEnd = this.datePipe.transform(
        new Date(userItineraryData.endDate),
        'yyyy/MM/dd'
      );
      // console.log(dateStart);

      if (dateStart < dateCurrent || dateEnd < dateCurrent) {
        this.timerange.controls.start.setValue(null);
        this.timerange.controls.end.setValue(null);
      } else {
        this.timerange.controls.start.setValue(userItineraryData.startDate);
        this.timerange.controls.end.setValue(userItineraryData.endDate);
      }
    }

    this.subscribeToCityChanges();
    if (this.adultscount + this.childrencount == 9) {
      this.adultplus = 'desabled_display';
      this.childplus = 'desabled_display';
    } else {
      this.adultplus = '';
      this.childplus = '';
    }

    if (this.adultscount == 1) {
      this.adultminus = 'desabled_display';
    } else {
      this.adultminus = '';
    }
    if (this.childrencount == 0) {
      this.childminus = 'desabled_display';
    } else {
      this.childminus = '';
    }
    if (this.infantscount == this.adultscount) {
      this.inftplus = 'desabled_display';
      this.inftminus = '';
    } else {
      this.inftplus = '';
    }
    if (this.infantscount == 0) {
      this.inftminus = 'desabled_display';
    }
    this.menuCtrl.enable(false);
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      number: ['', Validators.required],
      message: ['', Validators.required],
    });
  }
  commonLoop(cities, num) {
    console.log('commonLoop', num);
    let sf: FormArray;
    this.multiInputs = this.formBuilder.group({
      arrayInputs: this.formBuilder.array([]),
    });
    console.log(this.arrayInputs, cities);

    if (cities.length > 1) {
      // this.multiDestination();
      cities.forEach((x, index) => {
        if (index > 0) this.addItem(`${x.cityName} , ${x.countryName}`);
      });
      console.log(cities, 'addItem', this.arrayInputs);
      console.log(this.multiInputs.get('arrayInputs'));
    }
  }
  multiDestination() {
    this.multiInputs = this.formBuilder.group({
      arrayInputs: this.formBuilder.array([]),
    });
  }
  createInputs(data) {
    return this.formBuilder.group({
      name: [data],
    });
  }
  addItem(data) {
    this.arrayInputs = this.multiInputs.get('arrayInputs') as FormArray;
    this.arrayInputs.push(this.createInputs(data));
  }
  showHomeForm() {
    this.width = 427;
    this.headingFlag = true;
  }
  closeForm() {
    console.log('close', this.showhomecard);
    this.width = this.copyWidth;
    this.headingFlag = false;
  }
  scrollToContact() {
    console.log('inscroll method');
    document.getElementById('contactDiv').scrollIntoView();
  }
  confirmDesitinations(): void {
    const userItineraryData = this.userItineraryService.userItineraryData();
    this.confirmOrigincity = userItineraryData.originCity;
    this.confirmDestinationcities = userItineraryData.destinationCities;
    this.confirmdestinationDates.controls.start.setValue(
      userItineraryData.startDate
    );
    this.confirmdestinationDates.controls.end.setValue(
      userItineraryData.endDate
    );
    this.adultscount = userItineraryData.travellers.adultCount;
    this.childrencount = userItineraryData.travellers.childCount;
    this.infantscount = userItineraryData.travellers.infantCount;
  }

  stp_prp(event: any): void {
    event.stopPropagation();
  }

  // Form City start
  subscribeToCityChanges(): void {
    this.fromcitysearchTerm.valueChanges.subscribe(
      async (partialName: string) => {
        // console.log(typeof partialName);
        this.showtocity = false;
        if (partialName === undefined || partialName === '') {
          this.showfromcity = false;
          return;
        }
        this.showfromcity = true;

        this.showtocity = false;
        // this.invalidFrom="";
        this.fromCity = partialName;
        this.fromcitynameverfication = partialName;
        this.filterfromdata = [];
        // console.log(partialName);

        // this.filterfromdata = this.citiesListService.filterCitiesByPartialName(
        //   partialName
        // );
        if (partialName.length >= 3) {
          this.citiesListService.getNewCities(partialName).subscribe((x) => {
            // let data=this.removeDuplicates(x)
            this.filterfromdata = x.splice(0, 5);
            // console.log(x, 'dattata');
            //   if(x.length==0)
            // this.invalidFrom="Invalid City";
            // else
            // this.invalidFrom=""
          });
        }
      }
    );

    this.tocitysearchTerm.valueChanges.subscribe((partialName) => {
      this.showfromcity = false;

      if (partialName === undefined || partialName === '') {
        this.showtocity = false;
        return;
      }
      this.showtocity = true;
      // this.invalidTo="";
      this.toCity = partialName;
      this.tocitynameverfication = partialName;
      this.filtertodata = [];
      // this.filtertodata = this.citiesListService.filterCitiesByPartialName(
      //   partialName
      // );
      if (partialName.length >= 3) {
        this.citiesListService.getNewCities(partialName).subscribe((x) => {
          // let data=this.removeDuplicates(x)

          this.filtertodata = x.splice(0, 5);
          // if(x.length==0)
          // this.invalidTo="Invalid City";
          // else
          // this.invalidTo="";
        });
      }
    });
  }
  removeDuplicates(x) {
    return x.filter((y) => {
      let status1;
      let status2;
      if (this.currentOriginCity) {
        if (
          y.latitude !== this.currentOriginCity.latitude &&
          y.longitude !== this.currentOriginCity.longitude
        ) {
          status1 = true;
        } else {
          status1 = false;
        }
      } else {
        status1 = true;
      }
      if (
        this.currentdestinationCity &&
        this.currentdestinationCity.length > 0
      ) {
        if (
          y.latitude !== this.currentdestinationCity[0].latitude &&
          y.longitude !== this.currentdestinationCity[0].longitude
        ) {
          status2 = true;
        } else {
          status2 = false;
        }
      } else {
        status2 = true;
      }
      console.log(
        status1 && status2,
        'status1&&status2',
        this.currentdestinationCity
      );

      if (status1 && status2) {
        return x;
      }
    });
  }

  getOriginCity(
    cityName: string,
    countryName: string,
    id: number,
    wholeData: any
  ): void {
    console.log(wholeData);

    this.fromcitynameverfication = '';
    this.getFromCityId = null;
    this.setorigincityname = cityName + ' , ' + countryName;
    this.invalidFrom1 = false;
    this.currentOriginCity = wholeData;
    // this.invalidFrom="";
    this.fromcitynameverfication = cityName;
  }

  getDestinationCity(
    cityName: string,
    countryName: string,
    id: number,
    wholeData: any
  ): void {
    this.tocitynameverfication = '';
    this.getToCityId = null;
    this.setdestinationcityname = cityName + ' , ' + countryName;
    this.showtocity = false;
    // console.log(wholeData);
    // this.toWholeData=[wholeData];
    // this.invalidTo="";
    this.invalidTo1 = false;
    this.currentdestinationCity = wholeData;
    this.tocitynameverfication = cityName;
  }

  async navigationToAddDestination(): Promise<void> {
    // remove below line after custom booking confromed
    if (this.production != true) {
      let verification: boolean;
      if (
        this.datePipe.transform(this.timerange.value.end, 'yyyy/MM/dd') !==
        this.datePipe.transform(this.timerange.value.start, 'yyyy/MM/dd')
      ) {
        console.log(
          this.setorigincityname,
          this.currentOriginCity,
          this.setdestinationcityname,
          this.timerange.value.start,
          this.timerange.value.end,
          this.currentdestinationCity
        );

        if (!this.currentdestinationCity) {
          let data = JSON.parse(localStorage.getItem('itinerary-storage'));
          console.log(data);
          this.currentdestinationCity = data.destinationCities[0];
        }
        this.dateReq = '';
        this.userItineraryService.setBasicInfo(
          this.timerange.value.start,
          this.timerange.value.end,
          this.currentOriginCity,
          [this.currentdestinationCity]
        );

        this.userItineraryService.updateTravellers({
          adultCount: this.adultscount,
          childCount: this.childrencount,
          infantCount: this.infantscount,
        });
        // if(data?.dayPlanner?.length>0)
        // this.userItineraryService.updateTimelineData([data.dayPlanner[0]],this.currentdestinationCity)
        if (this.fromcitynameverfication !== undefined) {
          this.fromCityDisp = false;
          if (this.tocitynameverfication !== undefined) {
            this.toCityDisp = false;
            this.userItineraryService.toDestination.next('home');
            this.route.navigateByUrl('/destination');
          } else {
            this.toCityDisp = true;
          }
        } else {
          this.fromCityDisp = true;
        }
        // }
      } else {
        this.dateReq = 'Duration date required';
        // this.fromCityDisp = true;
        // this.toCityDisp = true;
      }
    }
  }

  async navigatetotimeline() {
    localStorage.setItem('packageID', JSON.stringify('custom'));
    this.userItineraryService.changeTrip(true);

    // remove below line after custom booking confromed
    this.showtocity = false;
    this.showfromcity = false;
    if (this.production != true) {
      if (!this.setorigincityname) {
        this.fromCityDisp = true;
      } else {
        if (
          !this.currentOriginCity?.countryName ||
          this.setorigincityname.indexOf(',') == -1
        ) {
          this.invalidFrom1 = true;
        } else {
          this.invalidFrom1 = false;
        }
      }

      if (!this.setdestinationcityname) {
        this.toCityDisp = true;
      } else {
        if (this.setdestinationcityname?.indexOf(',') == -1) {
          this.invalidTo1 = true;
        } else {
          this.invalidTo1 = false;
        }
      }
      if (!(this.timerange.value.start && this.timerange.value.end)) {
        this.dateReq = 'Duration date required';
      }
      console.log(
        this.currentOriginCity,
        this.dayPlanner,
        this.setorigincityname,
        this.setorigincityname?.indexOf(',') !== -1,
        this.setdestinationcityname,
        this.currentdestinationCity,
        this.toWholeData,
        this.timerange.value,
        this.dateReq
      );
      if (
        this.dateReq == '' &&
        this.timerange.value.start &&
        this.timerange.value.end &&
        this.setorigincityname.indexOf(',') !== -1 &&
        this.setdestinationcityname.indexOf(',') !== -1 &&
        !this.invalidTo1 &&
        !this.invalidFrom1
      ) {
        this.dateReq = '';
        let data = JSON.parse(localStorage.getItem('itinerary-storage'));
        console.log(data, 'dadatatat');
        if (!this.currentdestinationCity) {
          this.currentdestinationCity = await data.destinationCities[0];
        }
        let status = false;
        let fromCity;
        let toCity;
        let startDate;
        let toDate;
        console.log(
          this.currentdestinationCity,
          this.paySucess,
          this.timerange.value
        );

        if (this.paySucess == '' || this.paySucess == 'failed') {
          if (data?.destinationCities.length > 0) {
            let { cityName, countryName } = data?.destinationCities[0];
            toCity = cityName + ' , ' + countryName;
          }
          if (data?.originCity) {
            let { cityName, countryName } = data?.originCity;
            fromCity = cityName + ' , ' + countryName;
          }
          startDate = data?.startDate;
          toDate = data?.endDate;
          if (data) {
            console.log(this.currentdestinationCity);
            let compare = Array.isArray(this.currentdestinationCity)
              ? this.currentdestinationCity[0]
              : this.currentdestinationCity;
            console.log(
              compare,
              this.currentOriginCity,
              fromCity,
              toCity,
              compare.cityName + ' , ' + compare.countryName == toCity,
              this.currentOriginCity.cityName +
                ' , ' +
                this.currentOriginCity.countryName ==
                fromCity,
              new Date(this.timerange.value.start).toISOString() == startDate,
              new Date(this.timerange.value.end).toISOString() == toDate
            );
            let { adultCount, childCount, infantCount } = data?.travellers;
            if (
              !(
                compare.cityName + ' , ' + compare.countryName == toCity &&
                this.currentOriginCity.cityName +
                  ' , ' +
                  this.currentOriginCity.countryName ==
                  fromCity &&
                new Date(this.timerange.controls.start.value).toISOString() ==
                  startDate &&
                new Date(this.timerange.controls.end.value).toISOString() ==
                  toDate &&
                this.adultscount == adultCount &&
                this.childrencount == childCount &&
                this.infantscount == infantCount
              )
            ) {
              console.log(
                'i am here',
                this.currentdestinationCity,
                this.currentOriginCity
              );
              status = true;
              this.currentdestinationCity = Array.isArray(
                this.currentdestinationCity
              )
                ? [this.currentdestinationCity[0]]
                : [this.currentdestinationCity];
              this.userItineraryService.addDestinations(
                this.currentdestinationCity
              );
              this.destinationsApisService.changeViewStatus('');
              // this.destinationsApisService.addHotelsList({},"","","","","","","")
            } else {
              status = false;
              console.log(this.currentdestinationCity);
              this.currentdestinationCity = data?.destinationCities;

              this.userItineraryService.addDestinations(
                this.currentdestinationCity
              );
            }
          } else {
            this.currentdestinationCity = [this.currentdestinationCity];
            status = true;
          }
          console.log(this.currentdestinationCity, status);
          if (status) {
            await this.userItineraryService.setBasicInfo(
              this.timerange.value.start,
              this.timerange.value.end,
              this.currentOriginCity,
              this.currentdestinationCity
            );
            await this.userItineraryService.updateTravellers({
              adultCount: this.adultscount,
              childCount: this.childrencount,
              infantCount: this.infantscount,
            });
            this.userItineraryService.setTravellers({
              adults: [],
              children: [],
              infants: [],
            });
          } else {
            let destiny = data?.destinationCities;
            console.log(destiny, 'destiny');

            if (destiny.length > 1) {
              await this.userItineraryService.setBasicInfo(
                this.timerange.value.start,
                this.timerange.value.end,
                this.currentOriginCity,
                destiny
              );
            }
          }
        } else {
          status = true;
          // console.log( this.timerange.value.start,
          //   this.timerange.value.end,
          //   this.currentOriginCity,
          //   this.currentdestinationCity);
          this.currentdestinationCity = Array.isArray(
            this.currentdestinationCity
          )
            ? this.currentdestinationCity
            : [this.currentdestinationCity];
          console.log(this.currentdestinationCity);

          await this.userItineraryService.setBasicInfo(
            this.timerange.value.start,
            this.timerange.value.end,
            this.currentOriginCity,
            this.currentdestinationCity
          );
          await this.userItineraryService.updateTravellers({
            adultCount: this.adultscount,
            childCount: this.childrencount,
            infantCount: this.infantscount,
          });
          await this.userItineraryService.load();
        }
        if (this.fromcitynameverfication !== undefined) {
          this.fromCityDisp = false;
          if (this.tocitynameverfication !== undefined) {
            this.toCityDisp = false;
            this.destinationsApisService.changeViewStatus('');
            if (status) {
              this.userItineraryService.getBooleanValue('home');
              this.userItineraryService.removeData('');
            } else {
              this.userItineraryService.getBooleanValue('persist');
              this.userItineraryService.removeData('');
            }
            this.destinationsApisService.changeViewStatus('locationsOnMap');
            localStorage.removeItem('staycationId');
            this.route.navigateByUrl('/time-line');
          } else {
            this.toCityDisp = true;
          }
        } else {
          this.fromCityDisp = true;
        }
        // }
      }
    }
  }

  navigationConfirmDestinationToAddDestination(): void {
    this.userItineraryService.setBasicInfo(
      this.confirmdestinationDates.value.start,
      this.confirmdestinationDates.value.end,
      this.confirmOrigincity,
      this.confirmDestinationcities
    );
    this.userItineraryService.updateTravellers({
      adultCount: this.adultscount,
      childCount: this.childrencount,
      infantCount: this.infantscount,
    });
    this.userItineraryService.toDestination.next('home');
    this.route.navigateByUrl('/destination');
  }
  onChangeEvent(event) {
    console.log(event.value, 'this.timerange', this.timerange);
    if (event.value != null) {
      if (
        new Date(this.timerange?.value?.start)?.toISOString() ==
        new Date(this.timerange?.value?.end)?.toISOString()
      ) {
        console.log('equal');
        this.dateReq = 'Dates should not be equal';
      } else {
        this.dateReq = '';
      }
    } else {
      this.dateReq = '';
    }
  }

  navigationConfirmDestinationToTimelinepage(): void {
    // TODO Date validation
    if (
      this.datePipe.transform(
        this.confirmdestinationDates.value.end,
        'yyyy/MM/dd'
      ) !==
      this.datePipe.transform(
        this.confirmdestinationDates.value.start,
        'yyyy/MM/dd'
      )
    ) {
      this.userItineraryService.getBooleanValue('home');
      this.userItineraryService.setBasicInfo(
        this.confirmdestinationDates.value.start,
        this.confirmdestinationDates.value.end,
        this.confirmOrigincity,
        this.confirmDestinationcities
      );
      this.userItineraryService.updateTravellers({
        adultCount: this.adultscount,
        childCount: this.childrencount,
        infantCount: this.infantscount,
      });
      this.destinationsApisService.changeViewStatus('');
      localStorage.setItem('packageID', this.custom);
      this.route.navigateByUrl('/time-line');
    }
  }

  clickCity(e, cityDet) {
    console.log(e);

    if (cityDet == 'fromCity') {
      if (e.target.value != '') {
        this.fromCityDisp = false;
      } else {
        this.fromcitynameverfication = undefined;
      }
    }
    if (cityDet == 'toCity') {
      if (e.target.value != '') {
        this.toCityDisp = false;
      } else {
        this.tocitynameverfication = undefined;
      }
    }
  }

  getadultsplus() {
    if (this.adultscount + this.childrencount < 9) {
      this.adultscount++;
      if (this.adultscount + this.childrencount == 9) {
        this.adultplus = 'desabled_display';
        this.childplus = 'desabled_display';
      } else {
        this.adultplus = '';
        this.childplus = '';
      }
    }

    if (this.adultscount == 1) {
      this.adultminus = 'desabled_display';
    } else {
      this.adultminus = '';
    }
    if (this.adultscount == this.infantscount || this.infantscount == 4) {
      this.inftplus = 'desabled_display';
    } else {
      this.inftplus = '';
    }
  }

  getadultsminus() {
    if (this.adultscount > 1) {
      this.adultscount--;
    }
    if (this.adultscount < this.infantscount) {
      this.infantscount--;
    }
    if (this.adultscount == 1) {
      this.adultminus = 'desabled_display';
    } else {
      this.adultminus = '';
    }
    if (this.adultscount != 9) {
      this.adultplus = '';
      this.childplus = '';
    }
    if (this.adultscount == this.infantscount) {
      this.inftplus = 'desabled_display';
    }
  }

  getchildrenplus() {
    if (this.adultscount + this.childrencount < 9) {
      this.childrencount++;
      if (this.adultscount + this.childrencount == 9) {
        this.childplus = 'desabled_display';
        this.adultplus = 'desabled_display';
      } else {
        this.childplus = '';
        this.adultplus = '';
      }
    }
    if (this.childrencount == 0) {
      this.childminus = 'desabled_display';
    } else {
      this.childminus = '';
    }
  }

  getchildrenminus() {
    if (this.childrencount > 0) {
      this.childrencount--;
      if (this.childrencount == 0) {
        this.childminus = 'desabled_display';
      } else {
        this.childminus = '';
      }
      if (this.adultscount + this.childrencount != 9) {
        this.childplus = '';
        this.adultplus = '';
      }
    }
  }

  getinfantsplus() {
    if (this.infantscount < this.adultscount) {
      if (this.infantscount < 4) {
        this.infantscount++;
      }
      if (this.infantscount == this.adultscount || this.infantscount == 4) {
        this.inftplus = 'desabled_display';
      } else {
        this.inftplus = '';
      }
    }
    if (this.infantscount == 0) {
      this.inftminus = 'desabled_display';
    } else {
      this.inftminus = '';
    }
  }

  getinfantsminus() {
    if (this.infantscount > 0) {
      this.infantscount--;
      this.inftplus = '';
    }
    if (this.infantscount == 0) {
      this.inftminus = 'desabled_display';
    }
  }
  resetclick() {
    this.adultscount = 1;
    this.childrencount = 0;
    this.infantscount = 0;
    this.adultplus = '';
    this.adultminus = 'desabled_display';
    this.childplus = '';
    this.childminus = 'desabled_display';
    this.inftplus = '';
    this.inftminus = 'desabled_display';
  }
  deleteMultiDestination(i) {}

  deletedestination(id) {
    let filterd_toCity;
    let searchavail = this.confirmDestinationcities.filter((x) => {
      if (x === id) {
        filterd_toCity = id;
      }
    });
    if (searchavail.length == 0) {
      let index_value = this.confirmDestinationcities.indexOf(filterd_toCity);
      this.confirmDestinationcities.splice(index_value, 1);
    }
  }

  slidePre() {
    this.slides.slidePrev();
  }
  slideNex() {
    this.slides.slideNext();
  }

  async getFeaturedList() {
    try {
      this.packages = await this.staycationService.stacationList();
      this.packageData = this.packages;
      this.featuredPackeges = [];
      this.bestValuePackeges = [];
      this.packageData?.map((res) => {
        if (res.packageValues?.tags?.length > 0) {
          if (res.packageValues.tags[0] === 'BestValue') {
            this.bestValuePackeges.push(res);
          } else {
            if (res.packageValues.tags[0] === 'featured') {
              this.featuredPackeges.push(res);
            }
          }
        }
      });
      this.beachdata = [];
      this.Hillsdata = [];
      this.forestdata = [];
      this.islanddata = [];
      this.desertdata = [];
      this.lakesdata = [];
      this.metrodata = [];
      this.yogadata = [];
      this.historydata = [];
      this.adventuredata = [];
      this.packageData?.map((res) => {
        if (res.packageValues?.category?.length > 0) {
          for (let i = 0; i < res.packageValues?.category?.length; i++) {
            if (res.packageValues.category[i] === 'Beach') {
              this.beachdata.push(res);
            }
            if (res.packageValues.category[i] === 'Hills and Mountains') {
              this.Hillsdata.push(res);
            }
            if (res.packageValues.category[i] === 'Forest and Wildlife') {
              this.forestdata.push(res);
            }
            if (res.packageValues.category[i] === 'Island') {
              this.islanddata.push(res);
            }
            if (res.packageValues.category[i] === 'Desert') {
              this.desertdata.push(res);
            }
            if (res.packageValues.category[i] === 'Lakes and Rivers') {
              this.lakesdata.push(res);
            }
            if (res.packageValues.category[i] === 'Metro life') {
              this.metrodata.push(res);
            }
            if (res.packageValues.category[i] === 'Yoga and Wellness') {
              this.yogadata.push(res);
            }
            if (res.packageValues.category[i] === 'History and Culture') {
              this.historydata.push(res);
            }
            if (res.packageValues.category[i] === 'Adventure') {
              this.adventuredata.push(res);
            }
          }
        }
      });

      // Todo: - on click to packages in the staycation page use  arrays below
      // console.log('dude', this.beachdata);
      // console.log('dude6', this.historydata);
      // console.log('dude1', this.Hillsdata);
      // console.log('dude7', this.yogadata);
      // console.log('dude8', this.metrodata);
      // console.log('dude2', this.forestdata);
      // console.log('dude3', this.islanddata);
      // console.log('dude4', this.desertdata);
      // console.log('dude9', this.adventuredata);
      // console.log('dude5', this.lakesdata);
    } catch (e) {
      console.log(e);
    }
  }

  slideNext(object, slideView) {
    slideView.slideNext(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }

  slidePrev(object, slideView) {
    slideView.slidePrev(500).then(() => {
      this.checkIfNavDisabled(object, slideView);
    });
  }
  checkIfNavDisabled(object, slideView) {
    this.checkisBeginning(object, slideView);
    this.checkisEnd(object, slideView);
  }
  checkisBeginning(object, slideView) {
    slideView.isBeginning().then((istrue) => {
      object.isBeginningSlide = istrue;
    });
  }
  checkisEnd(object, slideView) {
    slideView.isEnd().then((istrue) => {
      object.isEndSlide = istrue;
    });
  }
  SlideDidChange(object, slideView) {
    this.checkIfNavDisabled(object, slideView);
  }

  travellerPackagePreview(value) {
    // this.route.navigate(['/staycation-preview/' + value]);
    this.staycationService.packageReference.next(value);
    this.route.navigate(['/staycation/', value]);
  }
  destinationsByTheme(data: string) {
    // this.staycationService.packageValues.next(data);
    this.route.navigate(['category/staycation/', data]);
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }
    const data: any = this.registerForm.value;

    if (data) {
      this.toastMsg = true;
      // this.interval = setInterval(() => {
      //   if (this.timeLeft > 0) {
      //     this.timeLeft--;
      //   } else {
      //     clearInterval(this.interval);
      //     this.toastMsg = false;
      //     this.timeLeft = null;
      //     return;
      //   }
      // }, 2500);
      setTimeout(() => {
        //<<<---using ()=> syntax
        this.toastMsg = false;
      }, 3000);
      // Email Notify call change-notify service.
      this.ChangeNotifyService.userQueryNotify(
        data.name,
        data.email,
        data.number,
        data.message
      );

      this.registerForm.reset();
      this.submitted = false;
    }
  }
  // eslint-disable-next-line @typescript-eslint/member-ordering
  floatCardImages = [
    {
      image: '../assets/images/best-deal.png',
      name: 'TOP RATED AGENTS AND ADVISORS',
    },
    {
      image: '../assets/images/Authentic-and-Exclusive.png',
      name: 'AUTHENTIC AND EXCLUSIVE',
    },
    {
      image: '../assets/images/happy-travellers.png',
      name: 'OVER 10K HAPPY TRAVELLERS',
    },
    {
      image: '../assets/images/Holliday.png',
      name: 'OFFBEAT LUXE STAYS',
    },
    {
      image: '../assets/images/Offbeat-Luxe-Stays.png',
      name: 'MORE THAN 350 DESTINATIONS',
    },
  ];
  // PERFECT TRIP
  // eslint-disable-next-line @typescript-eslint/member-ordering
  perfectTripImages = [
    {
      tripImages: '../assets/images/Exclusive-Getaways.png',
      tripName: 'Exclusive Getaways',
    },
    {
      tripImages: '../assets/images/Travel-Solutions.png',
      tripName: 'Complete Travel solutions',
    },
    {
      tripImages: '../assets/images/Highest-Customization.png',
      tripName: 'Highest Customization',
    },
  ];
  // RAVEL PARTNERS
  // eslint-disable-next-line @typescript-eslint/member-ordering

  // RAVEL NEWS
  // eslint-disable-next-line @typescript-eslint/member-ordering
  travelNewsImages = [
    {
      travelImage: '../assets/images/NoPath - Copy (23).png',
      title: 'New Covid rules for international passengers from today',
      subTitle:
        'New Covid rules for international passengers from todayNew Covid rules for international passengers from today',
    },
    {
      travelImage: '../assets/images/NoPath - Copy (23).png',
      title: 'New Covid rules for international passengers from today',
      subTitle:
        'New Covid rules for international passengers from todayNew Covid rules for international passengers from today',
    },
  ];

  goToContact() {
    this.route.navigate([''], { queryParams: { setcard: 'true' } });
  }
  //  onClickReset() {
  //    this.setorigincityname = '';
  //    this.setdestinationcityname = '';
  //    this.timerange.reset();
  //  }

  hotel(activeTab) {
    this.activeTab = activeTab;
  }
  flights(activeTab) {
    this.activeTab = activeTab;
  }
  activities(activeTab) {
    this.activeTab = activeTab;
  }
  business(activeTab) {
    this.activeTab = activeTab;
  }

  onSlideMoved(event) {
    /** isEnd true when slides reach at end slide */
    event.target.isEnd().then((isEnd) => {
      console.log('End of slide1', isEnd);
      if (isEnd) {
        this.lastArrow = true;
      } else {
        this.lastArrow = false;
      }
    });

    event.target.isBeginning().then((istrue) => {
      console.log('End of slide', istrue);
      if (istrue) {
        this.firstArrow = true;
      } else {
        this.firstArrow = false;
      }
    });
  }
  previousSlide(): void {
    this.viewer.slidePrev();
  }

  goNext(): void {
    this.viewer.slideNext();
  }

  doCheck() {
    let prom1 = this.slides.isBeginning();
    let prom2 = this.slides.isEnd();

    Promise.all([prom1, prom2]).then((data) => {
      data[0] ? (this.disablePrevBtn = 1) : (this.disablePrevBtn = 0);
      data[1] ? (this.disableNextBtn = 1) : (this.disableNextBtn = 0);
    });
  }

  async navigationToTimeLatest() {
    localStorage.setItem('packageID', JSON.stringify('custom'));
    this.userItineraryService.changeTrip(true);

    // remove below line after custom booking confromed
    this.showtocity = false;
    this.showfromcity = false;
    if (this.production != true) {
      if (!this.setorigincityname) {
        this.fromCityDisp = true;
      } else {
        if (
          !this.currentOriginCity?.countryName ||
          this.setorigincityname.indexOf(',') == -1
        ) {
          this.invalidFrom1 = true;
        } else {
          this.invalidFrom1 = false;
        }
      }

      if (!this.setdestinationcityname) {
        this.toCityDisp = true;
      } else {
        if (this.setdestinationcityname?.indexOf(',') == -1) {
          this.invalidTo1 = true;
        } else {
          this.invalidTo1 = false;
        }
      }
      if (!(this.timerange.value.start && this.timerange.value.end)) {
        this.dateReq = 'Duration date required';
      }
      console.log(
        this.currentOriginCity,
        this.dayPlanner,
        this.setorigincityname,
        this.setorigincityname?.indexOf(',') !== -1,
        this.setdestinationcityname,
        this.currentdestinationCity,
        this.toWholeData,
        this.timerange.value,
        this.dateReq
      );
      if (
        this.dateReq == '' &&
        this.timerange.value.start &&
        this.timerange.value.end &&
        this.setorigincityname.indexOf(',') !== -1 &&
        this.setdestinationcityname.indexOf(',') !== -1 &&
        !this.invalidTo1 &&
        !this.invalidFrom1
      ) {
        this.dateReq = '';
        let data = JSON.parse(localStorage.getItem('itinerary-storage'));
        console.log(data, 'dadatatat');
        if (!this.currentdestinationCity) {
          this.currentdestinationCity = await data.destinationCities[0];
        }
        let status = false;
        let fromCity;
        let toCity;
        let startDate;
        let toDate;
        console.log(
          this.currentdestinationCity,
          this.paySucess,
          this.timerange.value
        );

        if (this.paySucess == '' || this.paySucess == 'failed') {
          if (data?.destinationCities.length > 0) {
            let { cityName, countryName } = data?.destinationCities[0];
            toCity = cityName + ' , ' + countryName;
          }
          if (data?.originCity) {
            let { cityName, countryName } = data?.originCity;
            fromCity = cityName + ' , ' + countryName;
          }
          startDate = data?.startDate;
          toDate = data?.endDate;
          if (data) {
            console.log(this.currentdestinationCity);
            let compare = Array.isArray(this.currentdestinationCity)
              ? this.currentdestinationCity[0]
              : this.currentdestinationCity;
            console.log(
              compare,
              this.currentOriginCity,
              fromCity,
              toCity,
              compare.cityName + ' , ' + compare.countryName == toCity,
              this.currentOriginCity.cityName +
                ' , ' +
                this.currentOriginCity.countryName ==
                fromCity,
              new Date(this.timerange.value.start).toISOString() == startDate,
              new Date(this.timerange.value.end).toISOString() == toDate
            );
            let { adultCount, childCount, infantCount } = data?.travellers;
            if (
              !(
                compare.cityName + ' , ' + compare.countryName == toCity &&
                this.currentOriginCity.cityName +
                  ' , ' +
                  this.currentOriginCity.countryName ==
                  fromCity &&
                new Date(this.timerange.controls.start.value).toISOString() ==
                  startDate &&
                new Date(this.timerange.controls.end.value).toISOString() ==
                  toDate &&
                this.adultscount == adultCount &&
                this.childrencount == childCount &&
                this.infantscount == infantCount
              )
            ) {
              console.log(
                'i am here',
                this.currentdestinationCity,
                this.currentOriginCity
              );
              status = true;
              this.currentdestinationCity = Array.isArray(
                this.currentdestinationCity
              )
                ? [this.currentdestinationCity[0]]
                : [this.currentdestinationCity];
              this.userItineraryService.addDestinations(
                this.currentdestinationCity
              );
              this.destinationsApisService.changeViewStatus('');
              // this.destinationsApisService.addHotelsList({},"","","","","","","")
            } else {
              status = false;
              console.log(this.currentdestinationCity);
              this.currentdestinationCity = data?.destinationCities;

              this.userItineraryService.addDestinations(
                this.currentdestinationCity
              );
            }
          } else {
            this.currentdestinationCity = [this.currentdestinationCity];
            status = true;
          }
          console.log(this.currentdestinationCity, status);
          if (status) {
            await this.userItineraryService.setBasicInfo(
              this.timerange.value.start,
              this.timerange.value.end,
              this.currentOriginCity,
              this.currentdestinationCity
            );
            await this.userItineraryService.updateTravellers({
              adultCount: this.adultscount,
              childCount: this.childrencount,
              infantCount: this.infantscount,
            });
            this.userItineraryService.setTravellers({
              adults: [],
              children: [],
              infants: [],
            });
          } else {
            let destiny = data?.destinationCities;
            console.log(destiny, 'destiny');

            if (destiny.length > 1) {
              await this.userItineraryService.setBasicInfo(
                this.timerange.value.start,
                this.timerange.value.end,
                this.currentOriginCity,
                destiny
              );
            }
          }
        } else {
          status = true;
          // console.log( this.timerange.value.start,
          //   this.timerange.value.end,
          //   this.currentOriginCity,
          //   this.currentdestinationCity);
          this.currentdestinationCity = Array.isArray(
            this.currentdestinationCity
          )
            ? this.currentdestinationCity
            : [this.currentdestinationCity];
          console.log(this.currentdestinationCity);

          await this.userItineraryService.setBasicInfo(
            this.timerange.value.start,
            this.timerange.value.end,
            this.currentOriginCity,
            this.currentdestinationCity
          );
          await this.userItineraryService.updateTravellers({
            adultCount: this.adultscount,
            childCount: this.childrencount,
            infantCount: this.infantscount,
          });
          await this.userItineraryService.load();
        }
        if (this.fromcitynameverfication !== undefined) {
          this.fromCityDisp = false;
          if (this.tocitynameverfication !== undefined) {
            this.toCityDisp = false;
            this.destinationsApisService.changeViewStatus('');
            if (status) {
              this.userItineraryService.getBooleanValue('home');
              this.userItineraryService.removeData('');
            } else {
              this.userItineraryService.getBooleanValue('persist');
              this.userItineraryService.removeData('');
            }
            this.destinationsApisService.changeViewStatus('locationsOnMap');
            localStorage.removeItem('staycationId');
            this.route.navigateByUrl('/time-line');
          } else {
            this.toCityDisp = true;
          }
        } else {
          this.fromCityDisp = true;
        }
        // }
      }
    }
  }
}
