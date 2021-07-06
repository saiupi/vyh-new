import { Analytics } from 'aws-amplify';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TravelPackage, TravellersDetails } from '@ojashub/voyaah-common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Options } from 'ng5-slider/options';
import { ToastController } from '@ionic/angular';
import { UserProfileService } from '@app/service-module/user-profile.service';
import { StaycationPackagesService } from '@app/service-module/staycation-packages.service';
import { AccountService } from '@app/account/services';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { UserItineraryService } from '@app/service-module/user-itinerary.service';

enum CheckBoxType {
  NONE,
}
@Component({
  selector: 'app-staycation',
  templateUrl: './staycation.component.html',
  styleUrls: ['./staycation.component.scss'],
})
export class StaycationComponent implements OnInit {
  cityTourList: any = [
    { id: 1, name: 'Yoga and Wellness' },
    // { id: 2, name: 'Island' },
    { id: 3, name: 'Adventure' },
    // { id: 4, name: 'Desert' },
    //{ id: 5, name: 'Lakes and Rivers' },
    { id: 6, name: 'History and Culture' },
    //{ id: 7, name: 'Metro life' },
    { id: 8, name: 'Beach' },
    { id: 9, name: 'Hills and Mountains' },
    { id: 10, name: 'Forest and Wildlife' },
  ];
  minValue = 5000;
  maxValue = 50000;
  options: Options = {
    floor: 1000,
    ceil: 100000,
  };
  timerange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  date: Date;
  minDate = new Date();
  maxDate: Date;
  packageValues: any;
  p = 1;
  q = 1;
  range: any;
  packages: TravelPackage[];
  packageData: TravelPackage[];
  filterpackages = [];
  cities_list: any;
  filteredItems: any;
  destinationName: any;
  cityName: string;
  showCityNames: boolean;
  isSliderRange: boolean;
  errorMessage = false;
  interval;
  timeLeft: number;
  tourCityNames: any;
  checkedList: any = [];
  minValueRage: any;
  maxValueRage: any;
  copyPackages: any[];
  errorMessageRange: boolean;
  packagecategoryName = '';
  selectedFilter: string;
  patnerName: any;
  keyPressErrorMessage: boolean;
  dateErrorMessage: boolean;
  endDateMessage: any;
  startDateMessage: any;
  vendorName: any;
  vendorNamePackges: any;
  vendorCondition: boolean;
  allstacationlist: any[];
  pageNo_array: any[];
  selectedPagenumber = 1;
  staycationData: any;
  vendorpageNo_array: any = [];
  selectedVendorPagenumber = 1;
  copyVendorNamePackge: any = [];
  trackStatus: boolean;
  copyFiltered: any = [];
  catagoryData: any[] = [];
  checkVendorFunction = false;
  //categoryPackage: any[];
  constructor(
    private Router: Router,
    private staycationService: StaycationPackagesService,
    private formBuilder: FormBuilder,
    public toastController: ToastController,
    private userProfileService: UserProfileService,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private UserItinerary: UserItineraryService
  ) {
    this.route.params.subscribe((params) => {
      this.packagecategoryName = params.categoryName;
      console.log(this.packagecategoryName, this.trackStatus);
      // if (this.packagecategoryName) this.getCategoryName();
    });
  }
  registerForm: FormGroup;
  submitted = false;
  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      destination: [''],
      startDate: [''],
      endDate: [''],
    });
    this.registerForm.reset();
    this.staycationData = this.staycationService.trackStaycationData.subscribe(
      (status) => {
        console.log(status, 'Statuss');
        this.trackStatus = status;
        if (status === true) {
          this.getStacationsList();
        }
      }
    );
    this.route.queryParams.subscribe((params) => {
      console.log(params, 'uuuuuuuuuuuuuuuuuuuuuuuuu', params?.vendor_name); // { order: "popular" }
      if (params?.vendor_name) {
        this.vendorName = params.vendor_name;
        // console.log(this.packageData,"packageData");

        if (
          !this.checkVendorFunction &&
          this.packageData &&
          this.packageData.length > 0
        )
          this.getVendorName();
        console.log(
          this.vendorName,
          'hhhhhhhhhhhhhhhh',
          params,
          'checkVendorFunction',
          this.checkVendorFunction
        ); // popular
      } else {
        this.vendorNamePackges = undefined;
      }
    });
    this.staycationService.currentStaycation.subscribe((res) => {
      if (res && this.selectedPagenumber) {
        console.log(res, this.selectedPagenumber);
        if (this.selectedPagenumber != 1) {
          this.packages = this.copyPackages;
          this.fixPagination();
        }
      }
    });

    // this.Router.events.subscribe(event => {
    //     console.log(event);
    //   // NavigationEnd
    //   // NavigationCancel
    //   // NavigationError
    //   // RoutesRecognized
    // });
  }
  // async getStacationsList() {
  //   let remainPackages = [];
  //   this.packageData = [];
  //   this.copyPackages = [];
  //   this.featuredPackages = [];
  //   this.packages = [];
  //   try {
  //     this.packages = await this.staycationService.stacationList();
  //     this.copyPackages = this.packages;
  //     this.packageData = this.packages;
  //     //this.categoryPackage = this.packages;
  //     this.packageData.map((res) => {
  //       if (res.packageValues?.tags?.length > 0) {
  //         if (res.packageValues.tags[0] === 'featured') {
  //           this.featuredPackages.push(res);
  //         } else {
  //           remainPackages.push(res);
  //         }
  //       }
  //     });
  //     for (let i = 0; i < remainPackages.length; i++) {
  //       this.featuredPackages.push(remainPackages[i]);
  //     }
  //     this.packages = this.featuredPackages;
  //     this.getCategoryName();
  //   } catch (e) {
  //     console.log(e);
  //   }
  // }

  paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  getpagination(p) {
    this.selectedPagenumber = p + 1;
    this.packages = this.paginate(this.allstacationlist, 9, p + 1);
    console.log(this.packages);
  }
  async getStacationsList() {
    this.allstacationlist = [];
    this.pageNo_array = [];
    let remainPackages = [];
    this.packageData = [];
    this.copyPackages = [];
    let featuredPackages = [];
    this.packages = [];
    try {
      this.allstacationlist = await this.staycationService.stacationList();
      console.log(
        this.allstacationlist,
        'this.allstacationlist',
        this.allstacationlist.length
      );
      if (this.vendorName) this.getVendorName();
      if (!this.packagecategoryName) {
        let i = Math.ceil(this.allstacationlist.length / 9);
        // console.log(i,"Ceilllllll");

        for (let p = 1; p <= i; p++) {
          this.pageNo_array.push(p);
        }
      }
      // if(this.pageNo_array.length>0){

      //   let new_activity_Data = this.pageNo_array.map((h) => {
      //     let activityObject = h;
      //     activityObject.status = false;
      //      return activityObject;
      //     });
      //     this.pageNo_array = new_activity_Data;
      //     this.pageNo_array[0].status=true;
      //     console.error("44444444444",this.pageNo_array)
      // }

      //this.categoryPackage = this.packages;
      this.packageData = this.allstacationlist;

      this.packageData.forEach((res) => {
        if (res.packageValues?.tags?.length > 0) {
          if (res.packageValues.tags[0] === 'featured') {
            featuredPackages.push(res);
          } else {
            remainPackages.push(res);
          }
        }
      });
      console.log(remainPackages, featuredPackages);

      for (let i = 0; i < remainPackages.length; i++) {
        featuredPackages.push(remainPackages[i]);
      }
      this.allstacationlist = featuredPackages;
      this.copyPackages = featuredPackages;
      this.packageData = featuredPackages;
      console.log(
        this.packages,
        'this.packages',
        remainPackages,
        featuredPackages
      );
      // let data=[...featuredPackages,...remainPackages]

      this.packages = this.paginate(this.allstacationlist, 9, 1);
      if (this.packagecategoryName) this.getCategoryName();
    } catch (e) {
      console.log(e);
    }
  }

  UserDetails(reference, isVendorPackageClick = false) {
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
    this.staycationService.setSelectedRoom('');
    if (isVendorPackageClick) {
      this.Router.navigate(['/staycation/', reference, this.vendorName]);
    } else {
      this.Router.navigate(['/staycation/', reference]);
    }
    localStorage.setItem('packageID', reference);
    this.UserItinerary.changeTrip(true);
  }
  get f() {
    return this.registerForm.controls;
  }

  onSumbit() {
    this.submitted = true;
    // stop here if form is invalid
    if (
      this.registerForm.invalid ||
      this.registerForm.controls.destination.value == undefined ||
      this.registerForm.controls.destination.value == '' ||
      this.registerForm.controls.destination.value == null
    ) {
      this.errorMessage = false;
      // return;
    }
    this.destinationName = this.registerForm.controls.destination.value;
    console.log(this.tourCityNames, this.destinationName);

    if (this.tourCityNames) {
      this.getAdvanceTourFilter();
    } else if (this.destinationName) {
      this.getDestination();
    }
    this.getstartFormDate();
    // this.getSlideRagne();
  }
  getstartFormDate() {
    const endDate = this.registerForm.controls.endDate.value
      ? this.registerForm.controls.endDate.value.toISOString()
      : '';
    const startDate = this.registerForm.controls.startDate.value
      ? this.registerForm.controls.startDate.value.toISOString()
      : '';
    console.log(endDate, 'startDate', startDate);

    const result = [];
    let searchData2 = [];
    const tempPackages = this.copyPackages;
    tempPackages.map((ele) => {
      if (endDate && startDate) {
        if (
          endDate.slice(0, 10) <= ele.availableUpTo.slice(0, 10) &&
          startDate.slice(0, 10) >= ele.availableFrom.slice(0, 10)
        )
          result.push(ele);
      }
    });
    if (endDate && startDate) {
      if (result.length === 0) {
        this.packages = this.copyPackages;
        this.fixPagination();
        this.endDateMessage = endDate;
        this.startDateMessage = startDate;
        // this.registerForm.reset();
      }
    }
    if (result.length > 0) {
      this.packages = result;
      console.log('jjjjjjjjjj', this.packages);
      this.fixPagination();
    }

    if (this.vendorName) {
      searchData2 = this.copyVendorNamePackge.filter((ele) => {
        if (endDate && startDate) {
          if (
            endDate.slice(0, 10) <= ele.availableUpTo.slice(0, 10) &&
            startDate.slice(0, 10) >= ele.availableFrom.slice(0, 10)
          )
            return ele;
        }
      });
      // console.log(searchData2,"searchData2");

      if (searchData2.length != 0) {
        this.vendorpageNo_array = [];
        this.vendorNamePackges = searchData2;
        this.fixVendorPagination();
      }

      if (searchData2.length == 0) {
        this.vendorNamePackges = this.copyVendorNamePackge;
        this.fixVendorPagination();
      }
    }

    console.log(searchData2, 'searchData2,', result);

    if (result.length > 0 || searchData2.length > 0) {
      this.dateErrorMessage = false;
    } else {
      if (endDate && startDate) {
        this.keyPressErrorMessage = false;
        this.errorMessageRange = false;
        this.dateErrorMessage = true;
      }
    }
  }
  fixVendorPagination() {
    this.selectedVendorPagenumber = 1;
    this.vendorpageNo_array = [];
    if (this.vendorNamePackges.length > 3) {
      let i = Math.ceil(this.vendorNamePackges.length / 3);
      for (let p = 1; p <= i; p++) {
        this.vendorpageNo_array.push(p);
      }
      this.vendorNamePackges = this.paginate(
        this.vendorNamePackges,
        3,
        this.selectedPagenumber
      );
    }
  }
  fixPagination() {
    if (this.packages.length > 0) {
      this.pageNo_array = [];
      let i = Math.ceil(this.packages.length / 9);
      for (let p = 1; p <= i; p++) {
        this.pageNo_array.push(p);
      }
    }
    this.selectedPagenumber = 1;
    this.packages = this.paginate(this.packages, 9, 1);
  }

  //  Destination cityList filters

  filterItem(e) {
    let searchdata1: TravelPackage[];
    // let searchdata2: TravelPackage[];
    console.log(
      'this.pageNo_array',
      this.copyFiltered,
      this.packagecategoryName,
      this.vendorName
    );

    if (e.target.value) {
      console.log('e', e.target.value, this.packages);
      let value = e.target.value;
      if (this.packagecategoryName) {
        this.mainSearch(this.packages, value);
      } else if (this.vendorName) {
        this.mainSearch(this.copyFiltered, value);
      } else {
        this.mainSearch(this.copyPackages, value);
      }
    } else {
      console.log('packagecategoryName', this.packagecategoryName);
      this.keyPressErrorMessage = false;
      if (!this.packagecategoryName) {
        console.log(this.packages, this.vendorName);
        if (this.vendorName) {
          this.vendorNamePackges = this.copyVendorNamePackge;
          if (this.vendorNamePackges.length > 0) {
            this.vendorpageNo_array = [];
            if (this.vendorNamePackges.length > 3) {
              let i = Math.ceil(this.vendorNamePackges.length / 3);
              for (let p = 1; p <= i; p++) {
                this.vendorpageNo_array.push(p);
              }
            }
          }
          this.selectedVendorPagenumber = 1;
          this.vendorNamePackges = this.paginate(this.vendorNamePackges, 3, 1);
          console.log('copyFiltered', this.copyFiltered);
          if (this.copyFiltered.length > 0) {
            this.pageNo_array = [];
            let i = Math.ceil(this.copyFiltered.length / 9);
            for (let p = 1; p <= i; p++) {
              this.pageNo_array.push(p);
            }
          }
          this.selectedPagenumber = 1;
          this.packages = this.paginate(this.copyFiltered, 9, 1);
          searchdata1 = [];
        } else {
          if (this.allstacationlist.length > 0) {
            this.pageNo_array = [];
            let i = Math.ceil(this.allstacationlist.length / 9);
            for (let p = 1; p <= i; p++) {
              this.pageNo_array.push(p);
            }
          }
          this.packages = this.paginate(
            this.allstacationlist,
            9,
            this.selectedPagenumber
          );
          searchdata1 = [];
        }
      } else {
        console.log('No Here', this.catagoryData);

        this.packages = this.paginate(
          this.catagoryData,
          9,
          this.selectedPagenumber
        );
      }
      // searchdata2 = [];
      console.log(this.packages);
    }
  }

  //main Search
  mainSearch(arr, e) {
    let searchdata1 = [];
    let searchData2 = [];
    searchdata1 = arr.filter((res) => {
      return (
        res.packageValues.cityName
          .toLocaleLowerCase()
          .startsWith(e.toLocaleLowerCase()) ||
        res.packageValues.countryName
          .toLocaleLowerCase()
          .startsWith(e.toLocaleLowerCase())
      );
    });

    if (searchdata1.length != 0) {
      this.pageNo_array = [];
      console.log('city', searchdata1, this.selectedPagenumber);
      this.packages = searchdata1;
      this.selectedPagenumber = 1;
      if (!this.packagecategoryName) {
        let i = Math.ceil(this.packages.length / 9);
        for (let p = 1; p <= i; p++) {
          this.pageNo_array.push(p);
        }
        this.packages = this.paginate(this.packages, 9, 1);
      }
    }

    if (searchdata1.length == 0) {
      console.log(' this.packages 44444', this.packages);

      this.packages = !this.packagecategoryName
        ? this.packageData
        : this.catagoryData;
      this.selectedPagenumber = 1;
      this.pageNo_array = [];
      console.log(' this.packages ', this.packages);
      if (this.packages.length > 0) {
        let i = Math.ceil(this.packages.length / 9);
        for (let p = 1; p <= i; p++) {
          this.pageNo_array.push(p);
        }
        this.packages = this.paginate(
          this.packages,
          9,
          this.selectedPagenumber
        );
      }
    }
    if (this.vendorName) {
      searchData2 = this.copyVendorNamePackge.filter((res) => {
        return (
          res.packageValues.cityName
            .toLocaleLowerCase()
            .startsWith(e.toLocaleLowerCase()) ||
          res.packageValues.countryName
            .toLocaleLowerCase()
            .startsWith(e.toLocaleLowerCase())
        );
      });

      if (searchData2.length != 0) {
        this.vendorpageNo_array = [];
        console.log('city', searchdata1, this.selectedPagenumber);
        this.vendorNamePackges = searchData2;
        this.selectedVendorPagenumber = 1;
        if (searchData2.length > 3) {
          let i = Math.ceil(this.vendorNamePackges.length / 3);
          for (let p = 1; p <= i; p++) {
            this.vendorpageNo_array.push(p);
          }
        }
        this.vendorNamePackges = this.paginate(this.vendorNamePackges, 3, 1);
      }

      if (searchData2.length == 0) {
        console.log(' this.packages 44444', this.packages);
        this.vendorNamePackges = this.copyVendorNamePackge;
        this.selectedVendorPagenumber = 1;
        this.vendorpageNo_array = [];
        console.log(' this.packages ', this.packages);
        if (this.vendorNamePackges.length > 0) {
          let i = Math.ceil(this.vendorNamePackges.length / 3);
          for (let p = 1; p <= i; p++) {
            this.vendorpageNo_array.push(p);
          }
          this.vendorNamePackges = this.paginate(
            this.vendorNamePackges,
            3,
            this.selectedPagenumber
          );
        }
      }
    }

    if (searchData2.length > 0 || searchdata1.length > 0) {
      this.keyPressErrorMessage = false;
    } else {
      this.keyPressErrorMessage = true;
      this.dateErrorMessage = false;
      this.errorMessageRange = false;
    }
  }
  //Hide Error MeSSAGE
  hideNoPacages() {
    this.keyPressErrorMessage = false;
    this.registerForm.reset();
  }
  hideNoDatePackages() {
    this.dateErrorMessage = false;
    this.registerForm.reset();
  }
  hideNoRangePackages() {
    this.errorMessageRange = false;
    // this.registerForm.reset();
    this.minValue = 5000;
    this.maxValue = 50000;
  }
  // Get Destination ClityList from api
  async getDestination() {
    try {
      this.staycationService
        .getDestinationCity(this.destinationName)
        .subscribe((result) => {
          console.log(result, 'result');

          if (result.length === 0) {
            this.errorMessage = true;
            this.getStacationsList();
          }
          if ((this.packages = result)) {
            return result;
          }
        });
      this.interval = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          clearInterval(this.interval);
          this.errorMessage = false;
          this.timeLeft = null;
          return;
        }
      }, 2500);
    } catch (error) {
      console.log('while getting data is err', error);
    }
  }

  // get Tour Categories from api

  async getAdvanceTourFilter() {
    try {
      this.staycationService
        .getAdvanceTourCategories(this.tourCityNames)
        .subscribe((tourCitysResponce) => {
          if (tourCitysResponce.length === 0) {
            //this.errorMessage = true;
            this.getStacationsList();
            let toast = this.toastController.create({
              message: `No tour categories avaliable at "${this.tourCityNames}"`,
              duration: 1500,
              position: 'middle',
              cssClass: 'toast-scheme',
            });
            toast.then((toast) => toast.present());
          }
          // else {
          //   this.errorMessage = false;
          // }
          if ((this.packages = tourCitysResponce)) {
            return tourCitysResponce;
          }
        });
    } catch (error) {}
  }

  getCity(name) {
    this.cityName = name;
    this.showCityNames = false;
  }
  sliderForm() {
    this.isSliderRange = !this.isSliderRange;
    event.stopPropagation();
  }
  keyPress(event: any) {
    const pattern = /^[a-zA-Z ]*$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  closeFilter() {
    this.selectedFilter = '';
    this.currentlyChecked = CheckBoxType.NONE;
    this.getStacationsList();
  }

  // checkbox Tour Categories names
  checkboxChange(name) {
    this.selectedFilter = name;
    console.log(name);

    // console.log(this.selectedFilter, 'selected name');
    let tourCategorys: any = [];
    let searchData2 = [];
    const tempPackages = this.copyPackages;
    tempPackages.map((res) => {
      if (res.packageValues?.category?.length > 0) {
        for (let i = 0; i < res.packageValues?.category?.length; i++) {
          if (name === res.packageValues.category[i]) {
            tourCategorys.push(res);
            this.packages = tourCategorys;
            return this.packages;
          }
        }
      }
    });
    console.log(this.packages, 'this.packages;');
    this.fixPagination();
    if (this.vendorName) {
      this.copyVendorNamePackge.forEach((res) => {
        if (res.packageValues?.category?.length > 0) {
          for (let i = 0; i < res.packageValues?.category?.length; i++) {
            if (name === res.packageValues.category[i]) {
              searchData2.push(res);
            }
          }
        }
      });
      console.log(searchData2, 'searchData2');

      if (searchData2.length != 0) {
        console.log('Here');
        this.vendorNamePackges = searchData2;
        this.fixVendorPagination();
      } else {
        this.vendorNamePackges = this.copyVendorNamePackge;
        this.fixVendorPagination();
      }
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  currentlyChecked: CheckBoxType;
  //currentlyChecked: CheckBoxType;
  selectCheckBox(targetType: CheckBoxType) {
    console.log(
      targetType,
      'targetType',
      this.cityTourList,
      this.currentlyChecked
    );

    if (this.cityTourList.name === targetType) {
      this.currentlyChecked = CheckBoxType.NONE;
      return this.packages;
    }
    this.currentlyChecked = targetType;
  }
  onCheckboxChange(option, event) {
    if (event.target.checked) {
      this.checkedList.push(option.name);
    } else {
      for (var i = 0; i < this.cityTourList.length; i++) {
        if (this.checkedList[i] == option.value) {
          this.checkedList.splice(i, 1);
          this.getStacationsList();
        }
      }
    }
    this.tourCityNames = this.checkedList + '';
  }

  // slider range max and min
  valueChange(minValue, maxValue) {
    this.minValueRage = minValue;
    this.maxValueRage = maxValue;
    try {
      // console.log(minValue, maxValue,"minValue, maxValue",this.vendorName);

      let result = [];
      let searchData2 = [];
      const tempPackages = this.packagecategoryName
        ? this.packages
        : this.copyPackages;
      tempPackages.map((ele) => {
        if (ele.packageValues.fare) {
          if (
            ele.packageValues.fare.totalFare <= this.maxValueRage &&
            ele.packageValues.fare.totalFare >= this.minValueRage
          ) {
            result.push(ele);
          }
        }
      });
      // console.log(result);
      if (result.length > 0) {
        this.packages = result;
        this.fixPagination();
        // return this.packages;
      }
      if (result.length === 0) {
        this.packages = this.packagecategoryName
          ? this.packages
          : this.copyPackages;
        this.fixPagination();
        // return this.packages;
      }

      if (this.vendorName) {
        searchData2 = this.copyVendorNamePackge.filter((ele) => {
          if (ele.packageValues.fare) {
            if (
              ele.packageValues.fare.totalFare <= this.maxValueRage &&
              ele.packageValues.fare.totalFare >= this.minValueRage
            ) {
              // console.log("Matched");
              return ele;
            }
          }
        });
        // console.log(searchData2,"searchData2");

        if (searchData2.length != 0) {
          this.vendorpageNo_array = [];
          this.vendorNamePackges = searchData2;
          this.fixVendorPagination();
        }

        if (searchData2.length == 0) {
          this.vendorNamePackges = this.copyVendorNamePackge;
          this.fixVendorPagination();
        }
      }

      // console.log(result,"result.length>0 || searchData2", searchData2);

      if (result.length > 0 || searchData2.length > 0) {
        this.errorMessageRange = false;
      } else {
        this.keyPressErrorMessage = false;
        this.dateErrorMessage = false;
        this.errorMessageRange = true;
      }
    } catch (error) {
      console.log(error);
    }
  }
  sort(event: any) {
    // if (event.target.value === 'Low') {
    //   this.packages = this.packages.sort(
    //     (low, high) => low.values.fare.totalFare - high.values.fare.totalFare
    //   );
    // } else if (event.target.value === 'High') {
    //   this.packages = this.packages.sort(
    //     (low, high) => high.values.fare.totalFare - low.values.fare.totalFare
    //   );
    // }
    switch (event.target.value) {
      case 'Low': {
        this.packages = this.packages.sort(
          (low, high) =>
            low.packageValues.fare.totalFare - high.packageValues.fare.totalFare
        );
        break;
      }

      case 'High': {
        this.packages = this.packages.sort(
          (low, high) =>
            high.packageValues.fare.totalFare - low.packageValues.fare.totalFare
        );
        break;
      }
      case 'az': {
        this.packages = this.packages.sort(function (low, high) {
          if (low.packageValues.name < high.packageValues.name) {
            return -1;
          } else if (low.packageValues.name > high.packageValues.name) {
            return 1;
          } else {
            return 0;
          }
        });
        break;
      }
      case 'za': {
        this.packages = this.packages.sort(function (low, high) {
          if (low.packageValues.name > high.packageValues.name) {
            return -1;
          } else if (low.packageValues.name < high.packageValues.name) {
            return 1;
          } else {
            return 0;
          }
        });
        break;
      }
    }
    return this.packages;
  }
  async getCategoryName() {
    try {
      const packages = await this.staycationService.stacationList();
      const categoryPackage = packages;
      let categorys: any = [];
      if (this.packagecategoryName) {
        if (categoryPackage) {
          categoryPackage.map((res) => {
            if (res.packageValues?.category?.length > 0) {
              for (let i = 0; i < res.packageValues?.category?.length; i++) {
                if (
                  this.packagecategoryName === res.packageValues.category[i]
                ) {
                  categorys.push(res);
                }
              }
            }
          });
          if (categorys.length > 0) {
            this.packages = [];
            this.packages = categorys;
            console.log(this.packages);
            this.catagoryData = categorys;
            let i = Math.ceil(this.packages.length / 9);
            console.log(i, 'Cei33333333');
            for (let p = 1; p <= i; p++) {
              this.pageNo_array.push(p);
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }
  goToContact() {
    this.Router.navigate([''], { queryParams: { setcard: 'true' } });
  }
  async getVendorName() {
    try {
      this.checkVendorFunction = true;
      this.vendorNamePackges = await this.staycationService.vendorStaycations(
        this.vendorName
      );
      if (this.vendorName) {
        console.log('promiseResult', this.vendorNamePackges, this.packageData);
        this.vendorCondition = true;
        const filtered: TravelPackage[] = this.packageData;
        for (let i = 0; i < this.vendorNamePackges.length; i++) {
          for (let j = 0; j < this.packageData.length; j++) {
            if (
              this.vendorNamePackges[i].packageReference ===
              this.packageData[j].packageReference
            ) {
              filtered.splice(j, 1);
            }
          }
        }
        this.copyVendorNamePackge = this.vendorNamePackges;
        console.log(this.vendorNamePackges);
        this.vendorpageNo_array = [];
        this.selectedVendorPagenumber = 1;
        if (this.vendorNamePackges.length > 3) {
          let i = Math.ceil(this.vendorNamePackges.length / 3);
          console.log(i, 'Ceilllllll');

          for (let p = 1; p <= i; p++) {
            this.vendorpageNo_array.push(p);
          }
        }
        this.vendorNamePackges = this.paginate(this.vendorNamePackges, 3, 1);
        console.log(
          this.vendorpageNo_array,
          filtered,
          '9999999999999999999999',
          this.allstacationlist,
          this.packages
        );
        this.packages = filtered;
        this.copyFiltered = filtered;
        if (filtered.length > 0) {
          this.pageNo_array = [];
          let i = Math.ceil(this.packages.length / 9);
          // console.log(i,"Ceilllllll");

          for (let p = 1; p <= i; p++) {
            this.pageNo_array.push(p);
          }
          this.packages = this.paginate(this.packages, 9, 1);
        } else {
          this.pageNo_array = [];
        }
        return this.vendorNamePackges;
      }
    } catch (error) {
      console.log('while getting data is err', error);
    }
  }
  getVendorpagination(p) {
    this.selectedVendorPagenumber = p + 1;
    this.vendorNamePackges = this.paginate(this.copyVendorNamePackge, 3, p + 1);
  }
  event_propagation(event: Event) {
    event.stopPropagation();
    console.log('well Iam happy ');
  }
  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    console.log('Ondestroy');

    this.staycationData.unsubscribe();
  }
}
