import { error } from 'protractor';
import { DatePipe, PlatformLocation } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DestinationsApisService } from '../destinations-apis.service';
import { FormControl, FormGroup } from '@angular/forms';
import { debounce } from 'lodash';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import * as _moment from 'moment';
// import Moment from 'moment';
import { UserItineraryService } from '@app/service-module/user-itinerary.service';
import { CurrentItinerary } from '@ojashub/voyaah-common';
import { City } from '@ojashub/voyaah-common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { CitiesListService } from '@app/service-module/cities-list.service';
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'MMM DD',
    monthYearLabel: 'MMM DD',
    dateA11yLabel: 'MMM DD',
    monthYearA11yLabel: 'MMM DD',
  },
};
declare var $;
@Component({
  selector: 'app-timeline-process',
  templateUrl: './timeline-process.component.html',
  styleUrls: ['./timeline-process.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe,
  ],
})
export class TimelineProcessComponent implements OnInit {
  cityWithoutDate;
  dateMissing = false;
  dateverificationString = '';
  dateverificationStringenddate = '';
  dateverficationId: number;
  originDateToShiftDateInTimeline: Date;
  showRoundTrip: Boolean;
  showRoundTripsFlights = false;
  getFlightValue: Boolean;
  locationData: any[] = [];
  returnTypeData: any[] = [];
  returnPlandata: any[] = [];
  item: any;
  locations: any;
  previouscard: string = null;
  dragflag = false;
  screenWidth: number;
  hideOptions = true;
  textH: any;
  hideItem = false;
  showitems: any;
  count: number;
  hideActivities = false;
  hotelData: any;
  showRightPart = '';
  flightData: any;
  selected_activity_data: any;
  cityFrom: any;
  Tocity: any;
  originCityEndDate: Date;
  currentCityFlights: any[] = [];
  latestFlightsData: any;
  onlyCountry: any;
  citiesData: any;
  isShown1 = false;
  prevCity: any;
  daywise: any;
  cityId: any;
  dataStatus = false;
  hideHotels = false;
  minDatelimit: Date;
  maxDatelimit: Date;
  individualTimeRange = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });
  userItineraryData: CurrentItinerary;
  startDate: any;
  endDate: any;
  originCity: City;
  destinationCity: any;
  destinationCountry: string;
  currentCardData: any;
  originFromData: any;
  selected: any;
  aBooleanValuefromHomePage = '';
  dateform: FormGroup;
  destinationCities: City[];
  //----add destination variables start
  isShowDiv = true;
  showcitydata = false;
  filteritems = [];
  citysearchTerm: FormControl = new FormControl();
  duplicateCityId: any;
  fromStatus = true;
  toStatus = true;
  selectedStartDate: Date;
  locationIndex: any;
  activityunsubcribe: any;
  hotelunsubcribe: any;
  flightunsubcribe: any;
  //----add destination variables end
  private history: string[] = [];
  constructor(
    private destinationsApisService: DestinationsApisService,
    private userItineraryService: UserItineraryService,
    private datepipe: DatePipe,
    private router: Router,
    private citiesListService: CitiesListService
  ) {
    this.getCitiesNams = debounce(this.getCitiesNams, 400);
    this.userItineraryService.currentHomePagemessage.subscribe(
      (res: string) => {
        if (res == 'home') {
          this.aBooleanValuefromHomePage = res;
          this.processData();
        }
      }
    );
    this.processData();

    let currentDate = new Date();
    this.minDatelimit = new Date(currentDate);
    this.maxDatelimit = new Date(currentDate.getFullYear() + 1, 11, 31);
    this.destinationsApisService.changeTimeLineData(this.locationData);
    this.destinationsApisService.showPreviewItenary(true);
    // console.log(this.locationData);
    this.subscribeToCityChanges();
  }

  ngOnInit() {
    console.log('constructor after on init');

    this.flightunsubcribe = this.destinationsApisService.currentFlightsData.subscribe(
      (x: any) => {
        // console.log(this.cityId);
        let seleId = this.destinationsApisService.getSelectedCityId();
        console.log(seleId, this.locationData);

        console.log(seleId, 'seleId');
        this.getFlightValue = this.destinationsApisService.getReturnFlightFlag();
        this.duplicateCityId = x.cityId;
        this.flightData = x;
        console.log(x, this.getFlightValue, this.cityId);
        if (this.getFlightValue === true) {
          this.addFlightlstToReturnType(this.flightData);
        } else {
          this.checkData(x, 'flightDetails');
        }
      }
    );
    this.activityunsubcribe = this.destinationsApisService.currentactivitydata.subscribe(
      (x) => {
        let seleId = this.destinationsApisService.getSelectedCityId();
        console.log(seleId, this.locationData);
        if (seleId) {
          this.selected_activity_data = x;
          // console.log('yolaaaa', this.selected_activity_data);
          if (Object.keys(x).length > 0) {
            this.hideActivities = true;
            this.checkData(x, 'ActivityDetails');
          }
        }
      }
    );

    this.hotelunsubcribe = this.destinationsApisService.currentHotelData.subscribe(
      (x: any) => {
        let seleId = this.destinationsApisService.getSelectedCityId();
        console.log(seleId, this.locationData);

        if (seleId) {
          this.hotelData = x;
          console.log(x);

          if (Object.keys(x).length > 0) {
            this.hideHotels = true;

            this.checkData(x, 'HotelDetails');
          }
        }
      }
    );
  }
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngAfterViewInit() {
    this.cardsToggle('0');
  }
  toggleDisplayDiv(): void {
    this.isShowDiv = !this.isShowDiv;
    this.showRightPart = 'locationsOnMap';
    this.destinationsApisService.changeViewStatus(this.showRightPart);
  }
  getCitiesNams() {
    if (
      this.citysearchTerm.value === undefined ||
      this.citysearchTerm.value === ''
    ) {
      this.showcitydata = false;
      return;
    }
    this.showcitydata = true;
    this.citiesListService
      .getNewCities(this.citysearchTerm.value)
      .subscribe((x) => {
        this.filteritems = x.splice(0, 5);
        console.log('server response', x);
        console.log('server spliced', this.filteritems);
        this.filteritems?.filter((filterData: any, id) => {
          if (this.originCity?.id === filterData?.id) {
            this.filteritems.splice(id, 1);
          }
        });
        for (let i = 0; i < this.filteritems.length; i++) {
          for (let j = 0; j < this.destinationCities.length; j++) {
            if (this.destinationCities[j]?.id === this.filteritems[i]?.id) {
              this.filteritems.splice(i, 1);
            }
          }
        }
      });
  }
  async subscribeToCityChanges() {
    // this.citysearchTerm.valueChanges.subscribe((partialName: string) => {
    //   if (partialName === undefined || partialName === '') {
    //     this.showcitydata = false;
    //     return;
    //   }
    //   this.showcitydata = true;
    //   if (partialName.length >= 3) {
    //     this.citiesListService.getNewCities(partialName).subscribe((x) => {
    //       this.filteritems = x.splice(0, 5);
    //       console.log('server response', x);
    //       console.log('server spliced', this.filteritems);
    //     });
    //   } else {
    //     return;
    //   }
    // this.filteritems?.filter((filterData: any, id) => {
    //   if (
    //     this.originCity?.cityName === filterData?.cityName &&
    //     this.originCity?.countryName === filterData?.countryName
    //   ) {
    //     this.filteritems.splice(id, 1);
    //   }
    // });
    // for (let i = 0; i < this.filteritems.length; i++) {
    //   for (let j = 0; j < this.destinationCities.length; j++) {
    //     if (
    //       this.destinationCities[j]?.cityName ===
    //         this.filteritems[i]?.cityName &&
    //       this.destinationCities[j]?.countryName ===
    //         this.filteritems[i]?.countryName
    //     ) {
    //       this.filteritems.splice(i, 1);
    //     }
    //   }
    // }
    // console.log(this.filteritems, this.showcitydata);
    // });
  }
  onEvent(event) {
    event.stopPropagation();
  }
  async onsavelocattion(cityId: number, index) {
    console.log('index', this.filteritems[index]);
    this.isShowDiv = true;
    this.showcitydata = false;
    const selectedDestinationCity = this.filteritems[index];
    this.filteritems = [];
    console.log('locationData before', this.locationData);
    this.userItineraryService.appendDestination(selectedDestinationCity);
    // this.locationData.push({
    //   ...setUp,
    //   ...selectedDestinationCity,
    // });
    this.userItineraryService.appendDayplanner(
      selectedDestinationCity,
      this.locationData[this.locationData.length - 1].day + 1
    );
    this.citysearchTerm.setValue('');
  }
  processData() {
    console.log('processData() invoked');
    this.locationData = [];
    this.userItineraryData = this.userItineraryService.userItineraryData();
    console.log('this.userItineraryData', this.userItineraryData);
    this.destinationCities = this.userItineraryData.destinationCities;
    this.showRoundTrip = this.userItineraryData.returnType;
    console.log(
      'round trip status:',
      this.showRoundTrip,
      'flightDetails:',
      this.userItineraryData
    );

    if (this.userItineraryData) {
      this.returnPlandata = this.userItineraryData.returnPlan;
      this.startDate = this.userItineraryData.startDate;
      this.endDate = this.userItineraryData.endDate;
      this.originCity = this.userItineraryData.originCity;
      console.log(this.aBooleanValuefromHomePage);

      if (this.aBooleanValuefromHomePage === 'home') {
        console.log('flightDetails');

        this.aBooleanValuefromHomePage = '';
        this.locationData = this.userItineraryService.getDataTemplateToTheTimeline();
        // console.log('location data updated', this.locationData);
        this.userItineraryService.updateTimelineData(this.locationData);
      } else {
        console.log('222222222');
        // this.locationData = this.userItineraryService.getDataTemplateToTheTimeline();
        // console.log('location data updated', this.locationData);
        // this.userItineraryService.updateTimelineData(this.locationData);
        this.aBooleanValuefromHomePage = '';
        this.locationData = this.userItineraryData?.dayPlanner;
      }
      this.originFromData = this.userItineraryData.originCity;
    }
    if (this.locationData?.length === 1) {
      // console.log('startdate', this.userItineraryData.startDate);
      this.locationData[0].date.start = new Date(
        this.userItineraryData.startDate
      );
      this.originDateToShiftDateInTimeline = new Date(
        this.userItineraryData.startDate
      );
      this.originCityEndDate = this.userItineraryData.endDate;
      // this.locationData[this.locationData.length - 1].date.end = new Date(
      //   this.userItineraryData.endDate
      // );
      // this.locationData[this.locationData.length - 1].date.end = null;
      this.userItineraryService.updateTimelineData(this.locationData);
    }
    if (this.locationData?.length > 1) {
      this.locationData[0].date.start = new Date(
        this.userItineraryData.startDate
      );
      this.originDateToShiftDateInTimeline = new Date(
        this.userItineraryData.startDate
      );
      // this.locationData[this.locationData.length - 1].date.end = new Date(
      //   this.userItineraryData.endDate
      // );
      this.originCityEndDate = new Date(this.userItineraryData.endDate);
      this.userItineraryService.updateTimelineData(this.locationData);
    }
    console.log('locationData', this.locationData);
  }
  async deleteRecord(id: any, index) {
    if (
      this.userItineraryData.returnType == false &&
      index == this.locationData.length - 1
    ) {
      this.endDate = this.locationData[this.locationData.length - 2].date.end;
      let d1 = new Date(this.startDate).toISOString();
      let d2 = new Date(this.endDate).toISOString();
      this.userItineraryService.updateDates(d1, d2);
    }
    let data = this.locationData;
    let f = [];
    this.locationData = data.filter((x) => {
      if (x.id != id) {
        return x.id != id;
      }
    });
    this.locationData.forEach((data, index) => {
      data.day = index;
    });
    this.destinationCities.splice(index, 1);
    await this.dateValidations();
    this.userItineraryService.updateTimelineData(
      this.locationData,
      this.destinationCities
    );
    this.userItineraryService.addDestinations(this.destinationCities);
  }
  toggleShowFeb() {
    this.isShown1 = !this.isShown1;
  }

  active() {
    setTimeout(() => {
      this.dragflag = true;
    }, 400);
  }
  mseup() {
    this.dragflag = false;
  }

  drop(event: CdkDragDrop<string[]>) {
    this.dragflag = false;
    console.log(event);

    let indexes = [event.previousIndex, event.currentIndex];
    const temp = this.locationData[event.previousIndex].date;
    this.locationData[event.previousIndex].date = this.locationData[
      event.currentIndex
    ].date;
    this.locationData[event.currentIndex].date = temp;
    console.log(indexes[0], 'indexesindexes', indexes[1]);

    if (indexes[0] != indexes[1]) {
      console.log('here');

      indexes.forEach((x) => {
        this.locationData[x].flightDetails = {};
        this.locationData[x].activityDetails = [];
        this.locationData[x].hotelDetails = {};
      });
    }
    console.log(this.locationData);

    moveItemInArray(this.locationData, event.previousIndex, event.currentIndex);
    moveItemInArray(
      this.destinationCities,
      event.previousIndex,
      event.currentIndex
    );
    this.showRightPart = '';
    this.destinationsApisService.changeViewStatus(this.showRightPart);
    this.userItineraryService.updateTimelineData(
      this.locationData,
      this.destinationCities
    );
  }
  cardsToggle(index) {
    $('.timelinecollapse-' + index).collapse('show');
    this.locationData.forEach((v, ind) => {
      if (ind != index) {
        $('.timelinecollapse-' + ind).collapse('hide');
      }
    });
  }
  cardclick(id, city, country, cityid, currentData, start, end) {
    this.showRoundTripsFlights = false;
    this.currentCardData = currentData;
    let startEndDate = { startDate: new Date(start), endDate: new Date(end) };
    let completeCardData = { ...this.currentCardData, ...startEndDate };
    this.cityId = cityid;
    console.log('cityId', this.cityId);

    if (id != 0) {
      this.prevCity = this.locationData[id - 1];
      this.locationData.forEach((x) => {
        if (
          x.cityName === this.prevCity.cityName &&
          x.countryName === this.prevCity.countryName
        ) {
          this.prevCity = x;
        }
      });
    } else {
      this.prevCity = this.originFromData;
    }
    this.destinationCity = city;
    this.destinationCountry = country;
    this.destinationsApisService.changeCardClickData(completeCardData);
    setTimeout(() => {
      this.dragflag = false;
    }, 390);
    if (this.showitems === id && this.count >= 1) {
      this.showitems = 'xyz';
      this.count = this.count + 1;
    } else {
      this.count = 1;
      this.showitems = id;
    }
    sessionStorage.setItem('hotelSessionId', '');
    this.destinationsApisService.changeVoyaahStatus(true);
    this.destinationsApisService.changeViewStatus('');
  }
  addActivity(
    id: any,
    cityName: string,
    country,
    cityid: any,
    currentData: any,
    dates?: any
  ) {
    this.isShowDiv = true;
    this.destinationsApisService.setSelectedCityId(cityid);
    this.cardclick(
      id,
      cityName,
      country,
      cityid,
      currentData,
      dates?.start,
      dates?.end
    );

    if (
      !dates?.start ||
      !dates?.end ||
      currentData.error == true ||
      currentData.returnError.length > 0
    ) {
      if (!dates?.start || !dates?.end) {
        this.dateMissing = true;
        this.cityWithoutDate = cityid;
      }
      return;
    }

    this.showRightPart = 'Activities';
    this.destinationsApisService.changeViewStatus(this.showRightPart);
    this.destinationsApisService.changeNavigationViewStatus(this.showRightPart);
    this.destinationsApisService.changeCardClickData(this.currentCardData);
    // madhu code
    this.destinationsApisService.getBooleanToShowActivityPreferense(false);
    this.destinationsApisService.gettingcitynamefromtimeline(currentData);
    this.destinationsApisService.changeTimeLineData(this.locationData);
  }

  addModeOfJourney(
    index,
    id,
    city,
    country,
    cityid,
    currentData,
    start,
    end,
    lat,
    lng
  ) {
    console.log('currentData', currentData);
    this.isShowDiv = true;
    this.destinationsApisService.setSelectedCityId(cityid);
    this.destinationsApisService.setReturnFlightFlag(false);
    this.cardclick(id, city, country, cityid, currentData, start, end);
    if (
      !start ||
      !end ||
      currentData.error == true ||
      currentData?.returnError?.length > 0
    ) {
      if (!start || !end) {
        this.dateMissing = true;
        this.cityWithoutDate = cityid;
      }
      return;
    } else {
      let flightDataObj = [];
      if (index === 0) {
        let dateObj = {
          start: new Date(start),
        };
        flightDataObj.push(this.originCity);
        flightDataObj.push(this.locationData[index]);
        flightDataObj.push(dateObj);
        flightDataObj.push({ lat: lat, lng: lng });
      } else {
        let dateObj = {
          start: new Date(start),
        };
        flightDataObj.push(this.locationData[index - 1]);
        flightDataObj.push(this.locationData[index]);
        flightDataObj.push(dateObj);
        flightDataObj.push({ lat: lat, lng: lng });
      }
      this.showRightPart = 'Journey';
      this.destinationsApisService.changeViewStatus(this.showRightPart);
      this.destinationsApisService.changeTimeLineData(this.locationData);
      this.destinationsApisService.changeLatestFlights(flightDataObj);
    }
  }

  checkData(data, setValue: string) {
    console.log(setValue, data);

    if (setValue === 'flightDetails') {
      let selectedCityId = this.destinationsApisService.getSelectedCityId();
      let destinationCitiesData = this.locationData?.map((citiesData) => {
        console.log(
          'citiesData.id',
          citiesData,
          'selectedCityId',
          selectedCityId
        );
        //  let id=this.cityId?this.cityId:citiesData.id;
        //  console.log(id);

        if (citiesData.id === selectedCityId) {
          citiesData.flightDetails = data;
          this.destinationsApisService.setSelectedCityId(undefined);
          return citiesData;
        } else {
          return citiesData;
        }
      });
      this.locationData = destinationCitiesData;
    }
    if (setValue === 'HotelDetails') {
      let selectedCityId = this.destinationsApisService.getSelectedCityId();
      let destinationCitiesData = this.locationData?.map((citiesData) => {
        console.log(
          'cityId citiesData.id',
          citiesData.id,
          'selectedCityId',
          selectedCityId
        );
        if (citiesData.id === selectedCityId) {
          citiesData.hotelDetails = data;
          this.destinationsApisService.setSelectedCityId(undefined);
          return citiesData;
        } else {
          return citiesData;
        }
      });
      this.locationData = destinationCitiesData;
    }

    if (setValue === 'ActivityDetails') {
      //console.log('yolaa in checkdata');
      let selectedCityId = this.destinationsApisService.getSelectedCityId();
      let destinationCitiesData = this.locationData?.map((citiesData) => {
        // console.log('citiesData', citiesData);
        console.log(
          'citiesData.id',
          citiesData.id,
          'selectedCityId',
          selectedCityId
        );

        if (citiesData.id === selectedCityId) {
          if (citiesData.activityDetails.length === 0) {
            citiesData.activityDetails.push(data);
          } else {
            let count = 0;
            let destinationCitiesData = this.locationData.filter(
              (destinationsData) => {
                console.log(destinationsData);
                let activityDetailsData = destinationsData?.activityDetails.filter(
                  (x, id) => {
                    if (x?.activityName === data?.activityName) {
                      count = 1;
                    }
                  }
                );
              }
            );
            if (count === 1) {
            } else {
              citiesData.activityDetails.push(data);
            }
          }
          this.destinationsApisService.setSelectedCityId(undefined);

          return citiesData;
        } else {
          return citiesData;
        }
      });
      this.locationData = destinationCitiesData;
    }
    this.userItineraryService.updateTimelineData(this.locationData);
  }

  hotelView(id, city, country, cityid, currentData, start, end) {
    console.log('cityId in hotelView', cityid);
    this.isShowDiv = true;
    this.destinationsApisService.setSelectedCityId(cityid);
    this.cardclick(id, city, country, cityid, currentData, start, end);
    if (
      !start ||
      !end ||
      currentData.error == true ||
      currentData.returnError == true
    ) {
      if (!start || !end) {
        this.dateMissing = true;
        this.cityWithoutDate = cityid;
      }
      return;
    } else {
      this.showRightPart = 'hotelTab';
      this.destinationsApisService.changeViewStatus(this.showRightPart);
      this.destinationsApisService.changeHotelListStatus(true);
      this.destinationsApisService.changeTimeLineData(this.locationData);
    }
  }

  getstartDate(event: MatDatepickerInputEvent<Date>, id, p) {
    //TODO:Date Verification Function
    this.dateMissing = false;
    const startDate = event.value;
    // console.log(startDate, this.startDate);

    // const isostartDate = new Date(event.value).toISOString();
    // console.log(this.startDate, isostartDate, this.endDate);
    // if (this.startDate == isostartDate || this.endDate == isostartDate) {
    //   console.log('hii');
    //   return;
    // }
    // console.log('getstartDate', startDate, this.endDate, this.startDate);
    // console.log(
    //   !(
    //     _moment(startDate).isSameOrBefore(this.endDate) &&
    //     _moment(startDate).isSameOrAfter(this.startDate)
    //   )
    // );
    // console.log(
    //   _moment(startDate).isSameOrBefore(this.startDate),
    //   _moment(startDate).isSameOrAfter(this.endDate)
    // );

    if (
      _moment(startDate).isSameOrBefore(this.startDate) ||
      _moment(startDate).isSameOrAfter(this.endDate)
    ) {
      this.locationData.map((citiesData) => {
        if (citiesData.id === id && p == 0) {
          citiesData.date.start = this.startDate;
          return citiesData;
        } else if (citiesData.id === id && p == this.locationData.length - 1) {
          if (_moment(startDate).isSameOrAfter(this.endDate)) {
            citiesData.date.end = this.endDate;
            citiesData.date.start = this.locationData[p - 1].date.end;
          }
          return citiesData;
        } else if (citiesData.id === id) {
          // console.log(citiesData.id, id);
          if (_moment(startDate).isSameOrBefore(this.startDate)) {
            citiesData.date.start = this.locationData[p - 1].date.end
              ? this.locationData[p - 1].date.end
              : null;
            return citiesData;
          }
          if (_moment(startDate).isSameOrAfter(this.endDate)) {
            citiesData.date.start = this.locationData[p - 1].date.end
              ? this.locationData[p - 1].date.end
              : null;
            citiesData.date.end = null;
            this.locationData[p + 1].date.start = null;
            return citiesData;
          }
          citiesData.date.end = null;
          return citiesData;
        } else {
          return citiesData;
        }
      });
      // console.log(this.locationData);
      this.userItineraryService.updateTimelineData(this.locationData);
      return;
    }
    if (p === 0) {
      this.originDateToShiftDateInTimeline = new Date(startDate);
      this.userItineraryService.setStartDateNEndDate(
        this.originDateToShiftDateInTimeline,
        this.originCityEndDate
      );
    }
    if (!startDate) {
      return;
    }
    this.locationData.map((citiesData, i) => {
      if (citiesData.id === id) {
        citiesData.date.start = new Date(startDate);
        citiesData.activityDetails = [];
        citiesData.flightDetails = {};
        citiesData.hotelDetails = {};
        return citiesData;
      } else {
        return citiesData;
      }
    });
    if (p - 1 >= 0) {
      // console.log(startDate);
      this.locationData[p - 1].date.end = new Date(startDate);
      this.locationData[p - 1].activityDetails = [];
      this.locationData[p - 1].flightDetails = {};
      this.locationData[p - 1].hotelDetails = {};
    }
    // console.log(this.locationData);

    this.userItineraryService.updateTimelineData(this.locationData);
    // this.verificatonofDate(new Date(startDate), p);
  }
  changeStart(event: MatDatepickerInputEvent<Date>, id, p) {
    const startDate = event.value;
    this.dateMissing = false;
    if (p == 0) {
      this.startDate = startDate;
      let d1 = new Date(this.startDate).toISOString();
      let d2 = new Date(this.endDate).toISOString();
      this.userItineraryService.updateDates(d1, d2);
    }
    this.locationData[p].date.start = startDate;
    this.locationData.map((citiesData) => {
      if (citiesData.id === id) {
        citiesData.activityDetails = [];
        citiesData.flightDetails = {};
        citiesData.hotelDetails = {};
        return citiesData;
      } else {
        return citiesData;
      }
    });
    this.userItineraryService.updateTimelineData(this.locationData);
    this.destinationsApisService.changeViewStatus('');
  }
  async changeEnd(event: MatDatepickerInputEvent<Date>, id, p) {
    const endDate = event.value;
    this.locationData[p].date.end = endDate;

    await this.dateValidations();
    if (
      this.userItineraryData.returnType == false &&
      p == this.locationData.length - 1
    ) {
      this.endDate = endDate;
      let d1 = new Date(this.startDate).toISOString();
      let d2 = new Date(this.endDate).toISOString();
      this.userItineraryService.updateDates(d1, d2);
      this.locationData.map((x, index) => {
        if (_moment(x?.date?.end).isSameOrBefore(this.endDate)) {
          x.returnError = false;
          return x;
        } else {
          x.returnError = true;
          return x;
        }
      });
    }
    this.userItineraryService.updateTimelineData(this.locationData);
    this.destinationsApisService.changeViewStatus('');
  }
  dateValidations() {
    let errorIndexes = [];
    this.dateMissing = false;
    for (let i = 0; i < this.locationData.length; i++) {
      for (let j = 0; j < this.locationData.length; j++) {
        if (i != j) {
          if (
            _moment(this.locationData[i].date.start).isBetween(
              this.locationData[j].date.start,
              this.locationData[j].date.end
            ) ||
            _moment(this.locationData[i].date.end).isBetween(
              this.locationData[j].date.start,
              this.locationData[j].date.end
            ) ||
            _moment(this.locationData[i].date.start).isSame(
              this.locationData[j].date.start
            )
          ) {
            errorIndexes.push(i);
          }
          if (i < j) {
            if (
              _moment(this.locationData[j].date.start).isBefore(
                this.locationData[i].date.end
              )
            ) {
              errorIndexes.push(j);
            }
          }
        }
      }
      if (_moment(this.locationData[i].date.end).isAfter(this.endDate)) {
        this.locationData[i].returnError = true;
      } else {
        this.locationData[i].returnError = false;
      }

      if (
        _moment(this.locationData[i].date.start).isSame(
          this.locationData[i].date.end
        )
      ) {
        console.log('erec');

        this.locationData[i].sameError = true;
      } else {
        this.locationData[i].sameError = false;
      }
    }
    errorIndexes = Array.from(new Set(errorIndexes));
    errorIndexes.map((res) => {
      this.locationData[res].error = true;
    });
    this.locationData.forEach((ele, ind) => {
      if (errorIndexes.includes(ind)) {
        this.locationData[ind].error = true;
      } else {
        this.locationData[ind].error = false;
      }
    });
  }
  changestartDate(event: MatDatepickerInputEvent<Date>, id, p) {
    // let status=true;
    this.fromStatus = true;
    this.dateMissing = false;
    const startDate = event.value;
    this.selectedStartDate = event.value;
    if (p == 0) {
      this.startDate = startDate;
      let d1 = new Date(this.startDate).toISOString();
      let d2 = new Date(this.endDate).toISOString();
      this.userItineraryService.updateDates(d1, d2);
    }
    console.log(this.startDate, this.endDate, new Date(), startDate);
    // console.log(_moment(startDate).isSameOrBefore(this.endDate)&&
    // _moment(startDate).isSameOrAfter(this.startDate),_moment(startDate).isSameOrBefore(this.endDate),
    // _moment(startDate).isSameOrAfter(this.startDate));

    this.locationData.forEach((citiesData, i) => {
      if (citiesData.id !== id) {
        console.log(citiesData);

        if (citiesData.date && Object.keys(citiesData.date).length > 1) {
          console.log('coming', _moment(startDate).isBefore(this.startDate));
          if (
            (_moment(startDate).isBefore(citiesData.date?.end) &&
              _moment(startDate).isSameOrAfter(citiesData.date?.start)) ||
            _moment(startDate).isBefore(this.startDate)
          ) {
            console.log(citiesData);
            this.fromStatus = false;
          }
        }
      }
    });

    // if(status){
    console.log('statttttttus', this.fromStatus);
    this.locationData.map((citiesData, i) => {
      if (citiesData.id === id) {
        citiesData.date.start = this.fromStatus ? new Date(startDate) : null;
        if (!this.fromStatus) {
          citiesData.error = true;
        } else citiesData.error = false;
        return citiesData;
      } else {
        return citiesData;
      }
    });
    // }
    this.locationData.map((citiesData, i) => {
      if (citiesData.id === id) {
        // citiesData.date.start = new Date(startDate);
        citiesData.activityDetails = [];
        citiesData.flightDetails = {};
        citiesData.hotelDetails = {};
        return citiesData;
      } else {
        return citiesData;
      }
    });

    console.log(this.locationData, 'lcoationData', status);
    this.destinationsApisService.changeTimeLineData(this.locationData);
    this.userItineraryService.updateTimelineData(this.locationData);
  }
  changendDate(event: MatDatepickerInputEvent<Date>, id, p) {
    const endDate = event.value;
    this.dateMissing = false;

    this.toStatus = true;
    console.log(endDate, 'endDate');
    if (endDate) {
      console.log(this.endDate, _moment(endDate).isAfter(this.endDate));

      if (_moment(endDate).isAfter(this.endDate)) {
        this.locationData.map((citiesData) => {
          if (citiesData.id === id) {
            citiesData.returnError =
              citiesData.returnError == '' ||
              citiesData.returnError == undefined
                ? 'Change Return Date'
                : citiesData.returnError;
            return citiesData;
          } else {
            return citiesData;
          }
        });
      } else {
        this.locationIndex = '';
        this.locationData.forEach((citiesData, i) => {
          if (citiesData.id !== id) {
            if (citiesData.date && Object.keys(citiesData.date).length > 1) {
              if (
                (_moment(endDate).isSameOrBefore(citiesData.date?.end) &&
                  _moment(endDate).isAfter(citiesData.date?.start)) ||
                (_moment(this.selectedStartDate).isSameOrBefore(
                  citiesData.date?.start
                ) &&
                  _moment(endDate).isSameOrAfter(citiesData.date?.end))
              ) {
                this.toStatus = false;
              }
            }
          }
        });
        console.log(this.toStatus, 'this.toStatus');

        this.locationData.map((citiesData) => {
          if (citiesData.id === id) {
            citiesData.date.end = this.toStatus ? new Date(endDate) : null;
            if (!(this.toStatus && this.fromStatus)) {
              citiesData.error = true;
              citiesData.returnError = '';
            } else {
              citiesData.error = false;
              citiesData.returnError = '';
            }
            return citiesData;
          } else {
            return citiesData;
          }
        });
      }

      // let dayplan = this.locationData;
      // let dummyLocation = this.locationData;
      // dayplan.forEach((x, index1) => {
      //   console.log(x?.error);

      //   if (x?.error) {
      //     let date = x.date;
      //     if (Object.keys(x.date).length > 1) {
      //       dummyLocation = dummyLocation.map((y, index2) => {
      //         console.log(
      //           'betweeeeen',
      //           this.selectedStartDate,
      //           y.date.start,
      //           y.date.end,
      //           _moment(this.selectedStartDate).isBetween(
      //             y.date.start,
      //             y.date.end
      //           )
      //         );
      //         console.log(index1, index2, index1 !== index2, y.date);
      //         if (index1 !== index2) {
      //           if (
      //             _moment(this.selectedStartDate).isSame(y.date.start) ||
      //             _moment(this.selectedStartDate).isSame(y.date.end) ||
      //             _moment(date.end).isSame(y.date.start) ||
      //             _moment(date.end).isSame(y.date.end) ||
      //             _moment(this.selectedStartDate).isBetween(
      //               y.date.start,
      //               y.date.end
      //             ) ||
      //             _moment(date.end).isBetween(y.date.start, y.date.end)
      //           ) {
      //             console.log('fffffffffffff');
      //             x.error = true;
      //             return x;
      //           } else {
      //             console.log('zzzzzzzzzzz');
      //             x.error = false;
      //             return x;
      //           }
      //         } else {
      //           return x;
      //         }
      //       });
      //     }
      //   }
      // });
      // this.locationData = dummyLocation;
      console.log(this.locationData, 'this.locationData');
    }
    this.locationData.map((citiesData) => {
      if (citiesData.id === id) {
        citiesData.activityDetails = [];
        citiesData.flightDetails = {};
        citiesData.hotelDetails = {};
        return citiesData;
      } else {
        return citiesData;
      }
    });

    console.log(this.locationData, 'lcoationData');
    this.destinationsApisService.changeTimeLineData(this.locationData);
    this.userItineraryService.updateTimelineData(this.locationData);
  }

  async getendDate(event: MatDatepickerInputEvent<Date>, id, p) {
    //TODO:Date Verification Function
    this.dateMissing = false;
    const endDate = event.value;
    // console.log(
    //   'getendDate',
    //   endDate,
    //   this.endDate,
    //   this.startDate,
    //   p,
    //   this.locationData.length
    // );

    // console.log(
    //   _moment(endDate).isSameOrBefore(this.startDate),
    //   _moment(endDate).isSameOrAfter(this.endDate),
    //   'getendDate'
    // );

    if (
      _moment(endDate).isSameOrBefore(this.startDate) ||
      _moment(endDate).isSameOrAfter(this.endDate)
    ) {
      await this.locationData.map((citiesData) => {
        if (citiesData.id === id && p == 0) {
          // console.log('11111111');
          if (_moment(endDate).isSameOrAfter(this.endDate)) {
            // console.log('11111111xxxxxxxxx');
            citiesData.date.end = null;
            // console.log(citiesData);
          }
          citiesData.date.start = this.startDate;
          this.locationData = this.userItineraryService.getDataTemplateToTheTimeline();
          return citiesData;
        } else if (citiesData.id === id && p == this.locationData.length - 1) {
          if (_moment(endDate).isSameOrAfter(this.endDate)) {
            citiesData.date.end = this.endDate;
            citiesData.date.start = this.locationData[p - 1].date.end;
          }
          return citiesData;
        } else if (citiesData.id === id) {
          // console.log(citiesData.id, id);
          if (_moment(endDate).isSameOrBefore(this.startDate)) {
            citiesData.date.start = this.locationData[p - 1].date.end
              ? this.locationData[p - 1].date.end
              : null;
            this.locationData = this.userItineraryService.getDataTemplateToTheTimeline();
            return citiesData;
          }
          if (_moment(endDate).isSameOrAfter(this.endDate)) {
            // console.log('render');
            citiesData.date.end = null;
            citiesData.date.start = this.locationData[p - 1].date.end
              ? this.locationData[p - 1].date.end
              : null;
            this.locationData[p + 1].date.start = null;
            this.locationData = this.userItineraryService.getDataTemplateToTheTimeline();
            return citiesData;
          }

          return citiesData;
        } else {
          return citiesData;
        }
      });
      // console.log(this.locationData);
      await this.userItineraryService.updateTimelineData(this.locationData);
      return;
    }
    // if (
    //   this.locationData[0].date.start === endDate ||
    //   this.locationData[0].end === endDate
    // ) {
    //   console.log('bye');
    //   return;
    // }

    if (this.showRoundTrip === false) {
      if (p === this.locationData.length - 1) {
        this.originCityEndDate = new Date(endDate);
        this.userItineraryService.setStartDateNEndDate(
          this.originDateToShiftDateInTimeline,
          this.originCityEndDate
        );
      }
    }
    if (!endDate) {
      return;
    }
    // console.log('bdaf');

    this.locationData.map((citiesData) => {
      if (citiesData.id === id) {
        citiesData.date.end = new Date(endDate);
        citiesData.activityDetails = [];
        citiesData.flightDetails = {};
        citiesData.hotelDetails = {};
        return citiesData;
      } else {
        return citiesData;
      }
    });
    if (p + 1 <= this.locationData.length - 1) {
      this.locationData[p + 1].date.start = new Date(endDate);
      this.locationData[p + 1].activityDetails = [];
      this.locationData[p + 1].flightDetails = {};
      this.locationData[p + 1].hotelDetails = {};
    }

    if (p + 1 > this.locationData.length - 1) {
      this.originCityEndDate = new Date(endDate);
      this.userItineraryService.setStartDateNEndDate(
        this.originDateToShiftDateInTimeline,
        this.originCityEndDate
      );
    }

    // this.locationData = destinationCitiesData;
    this.userItineraryService.updateTimelineData(this.locationData);
    // this.verificatonofDate(new Date(endDate), p);
  }

  getoriginendDate(event: MatDatepickerInputEvent<Date>) {
    //TODO:Date Verification Function
    const originendDate = event.value;
    this.originCityEndDate = new Date(originendDate);
    this.endDate = new Date(originendDate);
    let p = null;
    this.verificatonofDate(this.originCityEndDate, p);
    // this.userItineraryService.setStartDateNEndDate(
    //   this.originDateToShiftDateInTimeline,
    //   this.originCityEndDate
    // );
    let d1 = new Date(this.startDate).toISOString();
    let d2 = new Date(this.originCityEndDate).toISOString();
    this.userItineraryService.updateDates(d1, d2);

    this.locationData.map((x, index) => {
      if (_moment(x?.date?.end).isSameOrBefore(this.endDate)) {
        x.returnError = false;
        return x;
      } else {
        x.returnError = true;
        return x;
      }
    });
    this.returnTypeData = [];
    this.returnPlandata = [];
    this.userItineraryService.setreturnPlan(this.returnTypeData);
    this.destinationsApisService.changeViewStatus('');
    this.showRoundTripsFlights = true;
    this.userItineraryService.updateTimelineData(this.locationData);
  }

  removeActivity(activityName) {
    let destinationCitiesData = this.locationData.filter((destinationsData) => {
      let activityDetailsData = destinationsData?.activityDetails.filter(
        (x, id) => {
          if (x?.activityName === activityName) {
            destinationsData?.activityDetails?.splice(id, 1);
          }
        }
      );
    });
    this.userItineraryService.updateTimelineData(this.locationData);
  }

  trimString(text, range) {
    return text?.length > range ? text.substr(0, range - 1) + '...' : text;
  }

  removeFlight(id) {
    this.locationData[id].flightDetails = {};
    this.userItineraryService.updateTimelineData(this.locationData);
  }

  removeHotel(id) {
    this.locationData[id].hotelDetails = {};
    this.userItineraryService.updateTimelineData(this.locationData);
  }

  async removeReturnTrip() {
    this.showRoundTrip = false;
    this.showRoundTripsFlights = false;
    // if (this.locationData.length === 1) {
    //   this.locationData[0].date.start = this.originDateToShiftDateInTimeline;
    //   this.locationData[0].date.end = this.originCityEndDate;
    // }
    // if (this.locationData.length > 1) {
    //   this.locationData[0].date.start = this.originDateToShiftDateInTimeline;
    //   this.locationData[
    //     this.locationData.length - 1
    //   ].date.end = this.originCityEndDate;
    // }
    this.returnTypeData = [];
    this.returnPlandata = [];
    this.userItineraryService.setreturnPlan(this.returnTypeData);
    this.userItineraryService.setreturnType(false);
    this.endDate = this.locationData[this.locationData.length - 1].date.end;
    let d1 = new Date(this.startDate).toISOString();
    let d2 = new Date(this.endDate).toISOString();
    this.userItineraryService.updateDates(d1, d2);
    await this.dateValidations();
    this.userItineraryService.updateTimelineData(this.locationData);
  }

  clickOnReturnCard() {
    this.showRoundTripsFlights = !this.showRoundTripsFlights;
    this.getFlightValue === false;
  }

  retrunModeOfJourney() {
    let flightDataObj = [];
    let dateObj = {
      start: new Date(this.originCityEndDate),
    };
    flightDataObj.push(this.locationData[this.locationData.length - 1]);
    flightDataObj.push(this.originCity);
    flightDataObj.push(dateObj);
    this.showRightPart = 'Journey';
    this.destinationsApisService.changeViewStatus(this.showRightPart);
    this.destinationsApisService.changeTimeLineData(this.locationData);
    this.destinationsApisService.changeLatestFlights(flightDataObj);
    this.getFlightValue = true;
    this.destinationsApisService.setSelectedCityId(undefined);
    this.destinationsApisService.setReturnFlightFlag(true);
  }

  addFlightlstToReturnType(data) {
    this.showRoundTripsFlights = false;
    this.returnPlandata = [];
    this.returnTypeData = [];
    this.getFlightValue = false;
    let journeyDates = {
      startDate: this.originCityEndDate,
    };
    this.returnTypeData.push(this.originCity);
    this.returnTypeData.map((x) => {
      let obj = x;
      obj.flightDetails = data;
      obj.journeyDates = journeyDates;
      this.returnTypeData.splice(0, 1);
      this.returnTypeData.push(obj);
    });
    this.returnPlandata = this.returnTypeData;
    this.userItineraryService.setreturnPlan(this.returnTypeData);
  }
  removeReturnFlight() {
    this.returnTypeData = [];
    this.returnPlandata = [];
    this.userItineraryService.setreturnPlan(this.returnTypeData);
  }

  verificatonofDate(date, id) {
    //TODO : date Verification...!!
    const currentDate = this.datepipe.transform(date, 'yyyy/MM/dd');
    let loopDatestart = this.datepipe.transform(
      this.locationData[0].date.start._d,
      'yyyy/MM/dd'
    );
    let loopDateend = this.datepipe.transform(
      this.originCityEndDate,
      'yyyy/MM/dd'
    );

    if (id != null) {
      this.dateverificationString = '';
      this.dateverificationStringenddate = '';
      if (currentDate === loopDatestart || currentDate < loopDatestart) {
        this.dateverificationString = 'Please Check  Date';
        this.dateverficationId = id;
      }

      if (currentDate === loopDateend || currentDate > loopDateend) {
        this.dateverificationString = 'Please Check  Date';
        this.dateverificationStringenddate = 'Please Check the end Date';
        this.dateverficationId = id;
      }
    }
  }
  addDestination() {
    this.userItineraryService.toDestination.next('time-line');
    this.router.navigate(['/destination']);
  }
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy() {
    console.log('Destroyed');

    this.activityunsubcribe.unsubscribe();
    this.hotelunsubcribe.unsubscribe();
    this.flightunsubcribe.unsubscribe();
  }
}
