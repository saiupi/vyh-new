import { CurrentItinerary } from '@ojashub/voyaah-common';
import { Component, OnInit } from '@angular/core';
import { DestinationsApisService, Flight } from '../destinations-apis.service';
import { UserItineraryService } from '@app/service-module/user-itinerary.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { TotalDurationPipe } from '@app/duration-pipe.pipe';
import { FlightPolicyComponent } from './flight-policy/flight-policy.component';
import { ModalController } from '@ionic/angular';
@Component({
  selector: 'app-flights-booking',
  templateUrl: './flights-booking.component.html',
  styleUrls: ['./flights-booking.component.scss'],
})
export class FlightsBookingComponent implements OnInit {
  flightsData = [];
  bookedFlightsData = [];
  apiFlightsData: Flight[];
  flightsmodified: Flight[];
  message: any;
  fromLocation: any;
  isPartialRefundChecked = false;
  toLocation: any;
  fromDate: Date;
  isLoading = true;
  // @Output('flightsBookedData') flightsBookedData: EventEmitter<
  //   Array<any>
  // > = new EventEmitter<Array<any>>();
  // @Output('passHideValue') passHideValue: EventEmitter<
  //   string
  // > = new EventEmitter<string>();
  showRightPart: string;
  // apiFlightsData: {};
  fromLocationCode: any;
  toLocationCode: any;
  mediatorVar: any;
  childCount: number;
  adultCount: number;
  infantCount: number;
  fltr_cards_display = false;
  // stops: [boolean, boolean, boolean] = [false, false, false];
  // layover: [boolean, boolean, boolean, boolean] = [false, false, false, false];
  depart: [boolean, boolean, boolean, boolean] = [false, false, false, false];
  flightClasses: any;
  maxDurationValue = 0;
  dummyMaxDurationValue = 0;
  farevalue = 0;
  maxFareValue = 0;
  durationvalue = 300;
  isError = false;
  errorMessage: string;
  flightsDataFromApiReceived = false;
  checkApiData: any;
  userInfo: CurrentItinerary;
  airlines: string[];
  selectedAirlines: string[] = [];
  dropdownSettings: IDropdownSettings = {};
  originData: {};
  originCityCodes: any[];
  toCityCodes: any[];
  selectedFromFlight: any;
  selectedToFlight: any;
  destinationId: any;
  selectedCityId;
  toCity: any;
  fromCity: any;
  selectedClass: any = 'Economy';
  listOfstops: any;
  selectedStop: any;
  isPriceSortedInAsc = true;
  isDurationSortedInAsc = true;
  PriceOrDurationSorted = 'PRICE';
  isFilterApplied = false;
  // isDurationSortedInAsc = false;
  constructor(
    private data: DestinationsApisService,
    private userItineraryService: UserItineraryService,
    private destinationsApisService: DestinationsApisService,
    public modalController: ModalController
  ) {}

  ngOnInit() {
    this.selectedCityId = this.destinationsApisService.getSelectedCityId();
    this.flightClasses = ['Economy', 'PremiumEconomy', 'First', 'Business'];
    console.log('selectedCityId oninit', this.selectedCityId);
    // this.data.currentMessage.subscribe((mes) => (this.message = mes));
    this.data.currentLatestFlights.subscribe(async (res) => {
      this.selectedCityId = this.destinationsApisService.getSelectedCityId();
      console.log(res, 'fromtimeline');
      this.originCityCodes = [];
      this.toCityCodes = [];
      this.fltr_cards_display = false;
      console.log(res);
      this.mediatorVar = res;
      console.log(res);
      (this.destinationId = res[1]?.id),
        (this.toLocationCode = res[1]?.airportCode);
      this.fromLocationCode = res[0]?.airportCode;
      this.toLocation = res[1]?.cityName + ',' + res[1]?.countryName;
      this.fromLocation = res[0]?.cityName + ',' + res[0]?.countryName;
      this.fromDate = res[2]?.start;

      this.flightsmodified = [];
      if (res.length > 0) {
        console.log('hii');

        await this.flightFromCodes(res[0]);
        await this.flightToCodes(res);
        await this.getFirstFlightList();
      }
      if (Object.keys(res).length) {
        this.flightsDataFromApiReceived = false;
        // this.callFlightsApi();
      }
    });
    this.userInfo = this.userItineraryService.userItineraryData();
    // this.fromDate = new Date(this.userInfo.startDate);
    // console.log(this.fromDate, 'frrrrrrrrrrrrrrrrrrrrrrrrrrrrr');
    this.adultCount = this.userInfo.travellers.adultCount;
    this.childCount = this.userInfo.travellers.childCount;
    this.infantCount = this.userInfo.travellers.infantCount;
    console.log(this.userInfo, 'this.userInfo)');
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false,
    };
  }
  async openPolicy(fareSourceCode) {
    const modal = await this.modalController.create({
      component: FlightPolicyComponent,
      cssClass: 'policy-modal-css',
      componentProps: {
        flightFareSourceCode: fareSourceCode,
      },
    });
    return await modal.present();
  }
  onRefundChanged(ev: MatSlideToggleChange) {
    this.isFilterApplied = true;
    this.isPartialRefundChecked = ev.checked;
  }

  async flightFromCodes(res: any) {
    let { latitude, longitude } = res;
    this.originCityCodes = await this.data.getOriginFlights(
      latitude,
      longitude
    );
  }
  async flightToCodes(res: any) {
    let { latitude, longitude } = res[1];
    this.toCityCodes = await this.data.getOriginFlights(latitude, longitude);
  }
  getFirstFlightList() {
    this.fromLocationCode = this.originCityCodes[0].airportCode;
    this.toLocationCode = this.toCityCodes[0].airportCode;
    this.fromCity = this.originCityCodes[0].cityName;
    this.toCity = this.toCityCodes[0].cityName;
    this.callFlightsApi();
  }

  selectOriginCode(code: any) {
    console.log(code);
    this.selectedFromFlight = this.originCityCodes[code];
    this.fromLocationCode = this.selectedFromFlight.airportCode;
    this.fromCity = this.selectedFromFlight.cityName;
    console.log(this.fromLocationCode);
    this.flightsmodified = [];
    this.callFlightsApi();
  }
  selectToCode(code: any) {
    this.selectedToFlight = this.toCityCodes[code];
    console.log(this.selectedToFlight);
    this.toLocationCode = this.selectedToFlight.airportCode;
    this.toCity = this.selectedToFlight.cityName;
    this.flightsmodified = [];
    this.callFlightsApi();
  }
  callFlightsApi() {
    // let fromDate = this.fromDate.getFullYear() + '/' + (this.fromDate.getMonth() + 1) + '/' + this.fromDate.getDate();

    this.apiFlightsData = [];
    this.isLoading = true;
    this.isError = false;
    if (this.checkApiData) {
      this.checkApiData.unsubscribe();
    }
    this.checkApiData = this.data
      .getFlightsLatestData(
        this.fromLocationCode,
        this.toLocationCode,
        this.fromDate,
        this.adultCount,
        this.childCount,
        this.infantCount,
        this.selectedClass
      )
      .subscribe(
        (res) => {
          console.log(res);
          if (res) {
            let data = [];
            this.isLoading = false;
            this.apiFlightsData = res;
            this.flightsmodified = this.apiFlightsData;
            this.flightsDataFromApiReceived = true;
            this.isError = false;
            this.filterAirlinesNames();
            this.findMaxPriceValue();
            this.findMaxDuration();
            this.sortByPrice(true);
            data.push(-1);
            res.forEach((x) => {
              if (!data.includes(x.flightSegments.length - 1)) {
                data.push(x.flightSegments.length - 1);
              }
            });

            this.listOfstops = data;
            this.selectedStop = -1;
          }
        },
        (err) => {
          this.apiFlightsData = [];
          this.isLoading = false;
          this.isError = true;
          console.log(err);
          if (err.error.errors[0] === 'Invalid airport codes') {
            this.errorMessage = `No flights available from ${this.fromLocationCode} , ${this.fromCity} airport to ${this.toLocationCode} , ${this.toCity}.`;
          } else {
            this.errorMessage = err.error.errors[0];
          }
        }
      );
  }
  findMaxDuration() {
    this.maxDurationValue = Math.max.apply(
      Math,
      this.apiFlightsData.map(function (o) {
        return o.totalDuration;
      })
    );
    this.dummyMaxDurationValue = this.maxDurationValue;
  }
  findMaxPriceValue() {
    this.farevalue = Number(
      this.apiFlightsData[this.apiFlightsData.length - 1].fareDetails.totalFare
        .amount
    );
    // this.farevalue = Math.max.apply(
    //   Math,
    //   this.apiFlightsData.map(function (o) {
    //     return o.fareDetails.totalFare.amount;
    //   })
    // );
    this.maxFareValue = this.farevalue;
  }
  filterAirlinesNames() {
    this.airlines = this.apiFlightsData
      .map((v) => {
        return v.flightSegments[0].airlineInfo.name;
      })
      .filter((elem, index, self) => {
        return index === self.indexOf(elem);
      });
  }
  addFlights(i) {
    console.log('selectedCityId addFlights()', this.selectedCityId);
    this.destinationsApisService.setSelectedCityId(this.selectedCityId);
    this.bookedFlightsData.push(i);
    this.data.changeMessage(true, i);
    if (window.screen.width < 992) {
      this.showRightPart = '';
      this.data.changeViewStatus(this.showRightPart);
    }

    // this.data.changeVoyaahStatus(true);
    // this.passHideValue.emit(this.showRightPart);
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
  filterclick() {
    if (this.flightsDataFromApiReceived) {
      this.fltr_cards_display = !this.fltr_cards_display;
      this.isLoading = false;
      this.isError = false;
      // this.listOfstops=
    }
  }
  filterbackclick() {
    this.isFilterApplied = false;
    this.fltr_cards_display = false;
    this.isLoading = true;
    this.isPartialRefundChecked = false;
    this.farevalue = this.maxFareValue;
    this.dummyMaxDurationValue = this.maxDurationValue;
    this.depart = [false, false, false, false];
    this.selectedStop = -1;
    this.selectedAirlines = [];
    this.flightsmodified = [];
    this.flightsmodified = this.apiFlightsData;
    this.isLoading = false;
  }
  // applyclick() {
  //   this.fltr_cards_display = false;
  // }
  backclick() {
    this.showRightPart = '';
    this.data.changeViewStatus(this.showRightPart);
  }
  // stopclick(index: number) {
  //   if (this.stops[index] == false) {
  //     this.stops[index] = true;
  //   } else {
  //     this.stops[index] = false;
  //   }
  // }
  // layoverclick(index: number) {
  //   if (this.layover[index] == false) {
  //     this.layover[index] = true;
  //   } else {
  //     this.layover[index] = false;
  //   }
  // }
  departclick(index: number) {
    if (this.depart[index] == false) {
      this.isFilterApplied = true;
      this.depart[index] = true;
    } else {
      this.depart[index] = false;
    }
  }

  selectFlightClass(index) {
    this.selectedClass = this.flightClasses[index];
    this.flightsmodified = [];
    this.callFlightsApi();
  }

  applyclick() {
    this.flightsmodified = this.apiFlightsData;
    // refundable start--------------------------------------------------------------------
    if (this.isPartialRefundChecked == true) {
      this.flightsmodified = this.flightsmodified.filter((record) => {
        return record.isRefundable.match('Yes');
      });
      // console.log(this.flightsmodified, 'filtered');
    } else {
      this.flightsmodified = this.apiFlightsData;
    }
    // refundable end------------------------------------------------------------------------

    //fare filter start ------------------------------------------------------------------
    if (this.farevalue < 5000) {
      this.flightsmodified = this.flightsmodified.filter((record) => {
        let fareamount = parseFloat(record.fareDetails.totalFare.amount);
        if (fareamount <= this.farevalue) {
          return record;
        }
      });
      console.log(this.flightsmodified, 'fare');
    }
    //fare filter end----------------------------------------------------------------------
    //duration filter start----------------------------------------------------------------
    if (this.dummyMaxDurationValue < 300) {
      this.flightsmodified = this.flightsmodified.filter((record) => {
        const durationInMinues = record.flightSegments.reduce(
          (acc, stop) => acc + parseFloat(stop.journeyDuration),
          0
        );
        // let durationInMinues = parseFloat(record.journeyDuration);
        if (durationInMinues <= this.dummyMaxDurationValue) {
          return record;
        }
      });
      console.log(this.flightsmodified, 'duration');
    }
    //duration filter end------------------------------------------------------------------
    //airlines filter start-----------------------------------------------------------------
    if (this.selectedAirlines.length > 0) {
      let dummyarray: Flight[] = [];
      for (var record of this.flightsmodified) {
        for (var airline of this.selectedAirlines) {
          let found = false;
          for (var segment of record.flightSegments) {
            if (segment.airlineInfo.name == airline) {
              dummyarray.push(record);
              found = true;
              break;
            }
          }
          if (found) {
            break;
          }
        }
      }
      this.flightsmodified = dummyarray;
      // console.log(this.flightsmodified, 'airlines');
    }
    //airlines filter end-----------------------------------------------------------------
    // depart start-------------------------------------------------------------------------
    if (
      (this.depart[0] == false &&
        this.depart[1] == false &&
        this.depart[2] == false &&
        this.depart[3] == false) ||
      (this.depart[0] == true &&
        this.depart[1] == true &&
        this.depart[2] == true &&
        this.depart[3] == true)
    ) {
      this.flightsmodified = this.flightsmodified;
    } else {
      if (
        this.depart[0] == true &&
        this.depart[1] == false &&
        this.depart[2] == false &&
        this.depart[3] == false
      ) {
        this.flightsmodified = this.flightsmodified.filter((record) => {
          let departhour = new Date(
            record.flightSegments[0].departureDateTime
          ).getHours();
          let departminutes = new Date(
            record.flightSegments[0].departureDateTime
          ).getMinutes();
          if (departhour < 6 || (departhour == 6 && departminutes == 0)) {
            return record;
          }
        });
      } else if (
        this.depart[0] == false &&
        this.depart[1] == true &&
        this.depart[2] == false &&
        this.depart[3] == false
      ) {
        this.flightsmodified = this.flightsmodified.filter((record) => {
          let departhour = new Date(
            record.flightSegments[0].departureDateTime
          ).getHours();
          let departminutes = new Date(
            record.flightSegments[0].departureDateTime
          ).getMinutes();
          if (
            (departhour >= 6 && departhour < 12) ||
            (departhour == 12 && departminutes == 0)
          ) {
            return record;
          }
        });
      } else if (
        this.depart[0] == false &&
        this.depart[1] == false &&
        this.depart[2] == true &&
        this.depart[3] == false
      ) {
        this.flightsmodified = this.flightsmodified.filter((record) => {
          let departhour = new Date(
            record.flightSegments[0].departureDateTime
          ).getHours();
          let departminutes = new Date(
            record.flightSegments[0].departureDateTime
          ).getMinutes();
          if (
            (departhour >= 12 && departhour < 18) ||
            (departhour == 18 && departminutes == 0)
          ) {
            return record;
          }
        });
      } else if (
        this.depart[0] == false &&
        this.depart[1] == false &&
        this.depart[2] == false &&
        this.depart[3] == true
      ) {
        this.flightsmodified = this.flightsmodified.filter((record) => {
          let departhour = new Date(
            record.flightSegments[0].departureDateTime
          ).getHours();
          if (departhour >= 18 || departhour == 0) {
            return record;
          }
        });
      } else if (
        this.depart[0] == true &&
        this.depart[1] == true &&
        this.depart[2] == false &&
        this.depart[3] == false
      ) {
        this.flightsmodified = this.flightsmodified.filter((record) => {
          let departhour = new Date(
            record.flightSegments[0].departureDateTime
          ).getHours();
          let departminutes = new Date(
            record.flightSegments[0].departureDateTime
          ).getMinutes();
          if (departhour < 12 || (departhour == 12 && departminutes == 0)) {
            return record;
          }
        });
      } else if (
        this.depart[0] == true &&
        this.depart[1] == false &&
        this.depart[2] == true &&
        this.depart[3] == false
      ) {
        this.flightsmodified = this.flightsmodified.filter((record) => {
          let departhour = new Date(
            record.flightSegments[0].departureDateTime
          ).getHours();
          let departminutes = new Date(
            record.flightSegments[0].departureDateTime
          ).getMinutes();
          if (
            departhour < 6 ||
            (departhour == 6 && departminutes == 0) ||
            (departhour >= 12 &&
              (departhour < 18 || (departhour == 18 && departminutes == 0)))
          ) {
            return record;
          }
        });
      } else if (
        this.depart[0] == true &&
        this.depart[1] == false &&
        this.depart[2] == false &&
        this.depart[3] == true
      ) {
        this.flightsmodified = this.flightsmodified.filter((record) => {
          let departhour = new Date(
            record.flightSegments[0].departureDateTime
          ).getHours();
          let departminutes = new Date(
            record.flightSegments[0].departureDateTime
          ).getMinutes();
          if (
            departhour < 6 ||
            (departhour == 6 && departminutes == 0) ||
            departhour >= 18
          ) {
            return record;
          }
        });
      } else if (
        this.depart[0] == false &&
        this.depart[1] == true &&
        this.depart[2] == true &&
        this.depart[3] == false
      ) {
        this.flightsmodified = this.flightsmodified.filter((record) => {
          let departhour = new Date(
            record.flightSegments[0].departureDateTime
          ).getHours();
          let departminutes = new Date(
            record.flightSegments[0].departureDateTime
          ).getMinutes();
          if (
            departhour >= 6 &&
            (departhour < 18 || (departhour == 18 && departminutes == 0))
          ) {
            return record;
          }
        });
      } else if (
        this.depart[0] == false &&
        this.depart[1] == false &&
        this.depart[2] == true &&
        this.depart[3] == true
      ) {
        this.flightsmodified = this.flightsmodified.filter((record) => {
          let departhour = new Date(
            record.flightSegments[0].departureDateTime
          ).getHours();
          if (departhour >= 12 || departhour == 0) {
            return record;
          }
        });
      } else if (
        this.depart[0] == false &&
        this.depart[1] == true &&
        this.depart[2] == false &&
        this.depart[3] == true
      ) {
        this.flightsmodified = this.flightsmodified.filter((record) => {
          let departhour = new Date(
            record.flightSegments[0].departureDateTime
          ).getHours();
          let departminutes = new Date(
            record.flightSegments[0].departureDateTime
          ).getMinutes();
          if (
            (departhour >= 6 &&
              (departhour < 12 || (departhour == 12 && departminutes == 0))) ||
            departhour >= 18 ||
            departhour == 0
          ) {
            return record;
          }
        });
      } else if (
        this.depart[0] == true &&
        this.depart[1] == true &&
        this.depart[2] == true &&
        this.depart[3] == false
      ) {
        this.flightsmodified = this.flightsmodified.filter((record) => {
          let departhour = new Date(
            record.flightSegments[0].departureDateTime
          ).getHours();
          let departminutes = new Date(
            record.flightSegments[0].departureDateTime
          ).getMinutes();
          if (departhour < 18 || (departhour == 18 && departminutes == 0)) {
            return record;
          }
        });
      } else if (
        this.depart[0] == true &&
        this.depart[1] == true &&
        this.depart[2] == false &&
        this.depart[3] == true
      ) {
        this.flightsmodified = this.flightsmodified.filter((record) => {
          let departhour = new Date(
            record.flightSegments[0].departureDateTime
          ).getHours();
          let departminutes = new Date(
            record.flightSegments[0].departureDateTime
          ).getMinutes();
          if (
            departhour < 12 ||
            (departhour == 12 && departminutes == 0) ||
            departhour >= 18
          ) {
            return record;
          }
        });
      } else if (
        this.depart[0] == true &&
        this.depart[1] == false &&
        this.depart[2] == true &&
        this.depart[3] == true
      ) {
        this.flightsmodified = this.flightsmodified.filter((record) => {
          let departhour = new Date(
            record.flightSegments[0].departureDateTime
          ).getHours();
          let departminutes = new Date(
            record.flightSegments[0].departureDateTime
          ).getMinutes();
          if (
            departhour < 6 ||
            (departhour == 6 && departminutes == 0) ||
            departhour >= 12
          ) {
            return record;
          }
        });
      } else {
        this.flightsmodified = this.flightsmodified.filter((record) => {
          let departhour = new Date(
            record.flightSegments[0].departureDateTime
          ).getHours();
          let departminutes = new Date(
            record.flightSegments[0].departureDateTime
          ).getMinutes();
          if (departhour >= 6 || departhour == 0) {
            return record;
          }
        });
      }
    }
    // depart ends------------------------------------------------------------------------------

    this.fltr_cards_display = false;
    console.log(this.selectedStop, 'selectedStop');
    console.log(this.flightsmodified);

    if (this.selectedStop && this.selectedStop != -1) {
      this.flightsmodified = this.flightsmodified.filter(
        (x) => x.flightSegments.length - 1 == this.selectedStop
      );
      console.log(this.flightsmodified);
    }
    if (this.flightsmodified.length == 0) {
      this.errorMessage = 'No Flights Found';
      this.isError = true;
    } else {
      this.errorMessage = '';
      this.isError = false;
    }
  }

  sortByPrice(isOnLoad = false) {
    if (!isOnLoad) {
      this.isPriceSortedInAsc = !this.isPriceSortedInAsc;
    }
    this.PriceOrDurationSorted = 'PRICE';
    if (this.isPriceSortedInAsc) {
      this.flightsmodified = this.flightsmodified.sort(
        (x: any, y: any) =>
          x.fareDetails.totalFare.amount - y.fareDetails.totalFare.amount
      );
    } else {
      this.flightsmodified = this.flightsmodified.sort(
        (x: any, y: any) =>
          y.fareDetails.totalFare.amount - x.fareDetails.totalFare.amount
      );
    }
  }

  sortByDuration() {
    this.isDurationSortedInAsc = !this.isDurationSortedInAsc;
    this.PriceOrDurationSorted = 'DURATION';
    if (this.isDurationSortedInAsc) {
      this.flightsmodified = this.flightsmodified.sort((x: any, y: any) => {
        let durPipe = new TotalDurationPipe();
        return durPipe.transform(x) - durPipe.transform(y);
      });
    } else {
      this.flightsmodified = this.flightsmodified.sort((x: any, y: any) => {
        let durPipe = new TotalDurationPipe();
        return durPipe.transform(y) - durPipe.transform(x);
      });
    }
    console.log(this.flightsmodified);
  }

  // priceAsFilter() {
  //   this.priceStatus = 'up';
  //   this.durStatus = '';

  //   this.flightsmodified = this.flightsmodified.sort(
  //     (x: any, y: any) =>
  //       x.fareDetails.totalFare.amount - y.fareDetails.totalFare.amount
  //   );
  //   // console.log(this.flightsmodified,"flightsmodified");
  // }
  // priceDsFilter() {
  //   this.priceStatus = '';
  //   this.durStatus = '';

  //   this.flightsmodified = this.flightsmodified.sort(
  //     (x: any, y: any) =>
  //       y.fareDetails.totalFare.amount - x.fareDetails.totalFare.amount
  //   );
  //   console.log(this.flightsmodified, 'flightsmodified');
  // }
  // duriationAsFilter() {
  //   this.durStatus = 'up';
  //   this.priceStatus = '';

  //   this.flightsmodified = this.flightsmodified.sort(
  //     (x: any, y: any) => x.totalDuration - y.totalDuration
  //   );
  //   console.log(this.flightsmodified, 'flightsmodified');
  // }
  // duriationDsFilter() {
  //   this.durStatus = 'down';
  //   this.priceStatus = '';
  //   this.flightsmodified = this.flightsmodified.sort(
  //     (x: any, y: any) => y.totalDuration - x.totalDuration
  //   );
  //   console.log(this.flightsmodified, 'flightsmodified');
  // }

  // ngOnDestroy() {
  //   console.log('Service destroy');
  //   this.checkApiData.unsubscribe();
  // }
}
