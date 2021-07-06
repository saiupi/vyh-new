import {
  CurrentItinerary,
  TravelType,
  TravellerCount,
  DayPlanner,
} from '@ojashub/voyaah-common';
import { City } from '@ojashub/voyaah-common';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AwsDataSyncService } from './aws-data-sync.service';

@Injectable({
  providedIn: 'root',
})
export class UserItineraryService {
  static localStorageKey = 'itinerary-storage';
  counter = 0;
  private currentItinerary: CurrentItinerary;
  locationData = [];
  locations: any;
  selectedTravellerCount = 0;
  public toDestination = new BehaviorSubject<string>('');
  public removeHomeData = new BehaviorSubject<string>('');
  public subscribeDates = new BehaviorSubject<{ startDate: any; endDate: any }>(
    { startDate: '', endDate: '' }
  );
  public toDestinationFrom = this.toDestination.asObservable();
  public currrentDates = this.subscribeDates.asObservable();
  public currentRemovedData = this.removeHomeData.asObservable();
  private CurrentItineraryChanged = new BehaviorSubject<number>(0);
  public itineraryChanged = this.CurrentItineraryChanged.asObservable();
  private navigatedFromHomePage = new BehaviorSubject<string>('');
  private paymentFali = new BehaviorSubject<boolean>(false);
  private timelineDataChanged = new BehaviorSubject<number>(this.counter);
  private _currentDestinationCities = new BehaviorSubject<City[]>([]);
  public currentDestinationCities = this._currentDestinationCities.asObservable();
  public faildPayment = this.paymentFali.asObservable();
  public currentHomePagemessage = this.navigatedFromHomePage.asObservable();
  public timelineDataChange = this.timelineDataChanged.asObservable();
  //for guard ----------
  public travelersSelect = new BehaviorSubject<boolean>(false);
  selectTravellerStatus = this.travelersSelect.asObservable();
  // -------------------
  public travelersInfoDelete = new BehaviorSubject<boolean>(false);
  selectTravellerInfoDelete = this.travelersInfoDelete.asObservable();

  //for guard ----------
  public travellerChange = new BehaviorSubject<boolean>(false);
  selectTravellerChange = this.travellerChange.asObservable();
  //==========================
  private Itinerary = new BehaviorSubject<boolean>(false);
  currentitinerary = this.Itinerary.asObservable();
  constructor(private awsDataSyncService: AwsDataSyncService) {
    if (!this.currentItinerary) {
      this.currentItinerary = {
        startDate: new Date(),
        endDate: new Date(),
        originCity: {
          id: 0,
          airportCode: [''],
          airportName: [''],
          cityName: '',
          countryName: '',
          countryCode: '',
          vendorName: '',
        },
        destinationCities: [
          {
            id: 0,
            airportCode: [''],
            airportName: [''],
            cityName: '',
            countryName: '',
            countryCode: '',
            vendorName: '',
          },
        ],
        travelType: TravelType.OneWay,
        travellers: {
          adultCount: 1,
          childCount: 0,
          infantCount: 0,
        },
        dayPlanner: [],
        returnType: true,
        returnPlan: [],
        selectedTravellers: {
          adults: [],
          children: [],
          infants: [],
        },
      };
    }
    this.load();
  }
  PreviewItinerary(data: boolean) {
    this.Itinerary.next(data);
  }

  setBasicInfo(
    startDate: Date,
    endDate: Date,
    originCity: City,
    destinationCities: City[],
    travelType: TravelType = TravelType.OneWay
  ): void {
    this.currentItinerary.startDate = startDate;
    this.currentItinerary.endDate = endDate;
    this.currentItinerary.travelType = travelType;
    this.currentItinerary.originCity = originCity;
    this.currentItinerary.destinationCities = destinationCities;
    this.currentItinerary.returnType = true;
    this.currentItinerary.returnPlan = [];
    this.save();
  }

  addDestinations(newDestnations: City[]): void {
    this.currentItinerary.destinationCities = newDestnations;
    this._currentDestinationCities.next(
      this.currentItinerary.destinationCities
    );
    this.save();
  }
  appendDestination(newDestinationCity: City): void {
    console.log(this.currentItinerary);
    this.currentItinerary.destinationCities.push(newDestinationCity);
    console.log(this.currentItinerary);
    this._currentDestinationCities.next(
      this.currentItinerary.destinationCities
    );

    this.save();
  }
  appendDayplanner(destination, dayNo) {
    const setUp = {
      day: dayNo,
      activityDetails: [],
      flightDetails: {},
      hotelDetails: {},
      date: { start: null, end: null },
    };
    console.log(this.currentItinerary);
    // this.currentItinerary=this.currentItinerary.dayPlanner?this.currentItinerary.dayPlanner:[...this.currentItinerary,da]
    this.currentItinerary.dayPlanner.push({ ...setUp, ...destination });
    console.log(
      'dayplanner after append in service',
      this.currentItinerary.dayPlanner
    );
    this.save();
    this.timelineDataChanged.next(this.counter + 1);
  }
  updateTravellers(travellers: TravellerCount) {
    this.currentItinerary.travellers = travellers;
    this.CurrentItineraryChanged.next(this.selectedTravellerCount + 1);
    this.save();
  }

  updateDates(startDate: string, endDate: string): void {
    this.currentItinerary.startDate = startDate;
    this.currentItinerary.endDate = endDate;
    let data = { startDate: startDate, endDate: endDate };
    this.subscribeDates.next(data);
    this.save();
  }

  //Saves to local storage and as well as AWS
  private save() {
    try {
      localStorage.setItem(
        UserItineraryService.localStorageKey,
        JSON.stringify(this.currentItinerary)
      );
      // this.awsDataSyncService.storeCurrentItinerary(this.currentItinerary);
    } catch (e) {
      console.error('Error saving to localStorage', e);
    }
  }

  //syncs and loads data from AWS
  public load() {
    const itineraryFromLocalStore = JSON.parse(
      localStorage.getItem(UserItineraryService.localStorageKey)
    ) as CurrentItinerary;

    console.log(itineraryFromLocalStore);

    if (itineraryFromLocalStore) {
      this.currentItinerary = itineraryFromLocalStore;
    }

    //Also look in AWS
    this.awsDataSyncService
      .loadCurrenItinerary()
      .then((currentItinerary) => {
        console.log(currentItinerary);
        if (currentItinerary) {
          // this.currentItinerary = currentItinerary;
        }
      })
      .catch((error) => {
        throw 'Exception in syncing with AWS for current itinerary';
      });
  }

  public userItineraryData() {
    console.log('lasssssst');

    return this.currentItinerary;
  }

  public updateTimelineData(
    dayPlannerData: DayPlanner,
    destinationCities = null
  ) {
    console.log(dayPlannerData, destinationCities);

    this.currentItinerary.dayPlanner = dayPlannerData;
    if (destinationCities != null) {
      this.currentItinerary.destinationCities = destinationCities;
      this.addDestinations(destinationCities);
    }
    this.save();
    this.timelineDataChanged.next(this.counter + 1);
  }

  public getDataTemplateToTheTimeline() {
    // this.navigatedFromHomePage.next(false);
    this.locationData = [];
    console.log('before adding city', this.currentItinerary);
    let endDate1;
    if (typeof this.currentItinerary.endDate == 'object') {
      endDate1 = new Date(this.currentItinerary.endDate).toISOString();
    } else {
      endDate1 = this.currentItinerary.endDate;
    }
    for (let i = 0; i < this.currentItinerary.destinationCities.length; i++) {
      console.log(typeof endDate1, endDate1);
      let loopEndDate;
      if (this.currentItinerary?.dayPlanner != undefined) {
        if (
          typeof this.currentItinerary?.dayPlanner[i]?.date.end == 'object' &&
          this.currentItinerary?.dayPlanner[i]?.date.end !== null
        ) {
          console.log(this.currentItinerary?.dayPlanner[i]?.date);

          loopEndDate = new Date(
            this.currentItinerary?.dayPlanner[i]?.date?.end?._d
              ? this.currentItinerary?.dayPlanner[i]?.date?.end?._d
              : this.currentItinerary?.dayPlanner[i]?.date?.end
          ).toISOString();
        } else {
          loopEndDate = this.currentItinerary?.dayPlanner[i]?.date.end;
        }
      }
      console.log(
        loopEndDate == endDate1,
        typeof loopEndDate,
        loopEndDate,
        'endDate',
        endDate1
      );

      let date = {
        start: null,
        end: null,
      };
      // console.log(this.currentItinerary);
      // console.log(this.currentItinerary?.dayPlanner);

      if (this.currentItinerary?.dayPlanner != undefined) {
        if (endDate1 == loopEndDate) {
          date = {
            start: this.currentItinerary?.dayPlanner[i]?.date.start
              ? this.currentItinerary?.dayPlanner[i]?.date.start
              : null,
            end: null,
          };
        } else {
          console.log('this.currentItinerary');
          date = {
            start: this.currentItinerary?.dayPlanner[i]?.date.start
              ? this.currentItinerary?.dayPlanner[i]?.date.start
              : null,
            end: null,
          };
        }
      }

      const setUp = {
        day: i,
        activityDetails: [],
        flightDetails: {},
        hotelDetails: {},
        date: { ...date },
      };
      console.log(setUp);

      console.log({
        ...setUp,
        ...this.currentItinerary.destinationCities[i],
      });

      this.locationData.push({
        ...setUp,
        ...this.currentItinerary.destinationCities[i],
      });
    }
    if (this.locationData.length > 2) {
      this.locationData[this.locationData.length - 2].date.start = null;
      this.locationData[this.locationData.length - 2].date.end = null;
    }
    this.currentItinerary.dayPlanner = this.locationData;
    console.log('after adding city', this.currentItinerary);
    return this.currentItinerary.dayPlanner;
  }

  public getBooleanValue(booleanValue: string) {
    this.navigatedFromHomePage.next(booleanValue);
  }

  public setStartDateNEndDate(startDate: Date, endDate: Date) {
    this.currentItinerary.startDate = startDate;
    this.currentItinerary.endDate = endDate;
    this.save();
  }
  travelersDelete(data: boolean) {
    this.travelersInfoDelete.next(data);
  }

  changeTrip(data: boolean) {
    this.travellerChange.next(data);
  }

  public setreturnType(returnVal: Boolean) {
    this.currentItinerary.returnType = returnVal;
    this.save();
  }

  public setreturnPlan(data) {
    this.currentItinerary.returnPlan = data;
    this.save();
  }
  public setTravellers(data) {
    this.currentItinerary.selectedTravellers = data;
    this.CurrentItineraryChanged.next(this.selectedTravellerCount + 1);
    console.log('user-itinerary.service.ts', this.currentItinerary);
    this.save();
  }
  public removeData(data) {
    console.log(data);

    this.removeHomeData.next(data);
  }
  public copy() {
    this.currentItinerary = {
      startDate: new Date(),
      endDate: new Date(),
      originCity: {
        id: 0,
        airportCode: [''],
        airportName: [''],
        cityName: '',
        countryName: '',
        countryCode: '',
        vendorName: '',
      },
      destinationCities: [
        {
          id: 0,
          airportCode: [''],
          airportName: [''],
          cityName: '',
          countryName: '',
          countryCode: '',
          vendorName: '',
        },
      ],
      travelType: TravelType.OneWay,
      travellers: {
        adultCount: 1,
        childCount: 0,
        infantCount: 0,
      },
      dayPlanner: [],
      returnType: true,
      returnPlan: [],
      selectedTravellers: {
        adults: [],
        children: [],
        infants: [],
      },
    };
  }
}
