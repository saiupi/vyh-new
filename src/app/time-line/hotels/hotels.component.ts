import { Hotel, HotelRoom } from './../destinations-apis.service';
import { Component, OnInit } from '@angular/core';
import { DestinationsApisService } from '../destinations-apis.service';
import { ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
@Component({
  selector: 'app-hotels',
  templateUrl: './hotels.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrls: ['./hotels.component.scss'],
})
export class HotelsComponent implements OnInit {
  ellipsis = true;
  count = 0;
  showHotelFilters = false;
  minValue: number;
  maxValue: number;
  farevalue: number;
  minPrice: number;
  maxPrice: number;
  resultCount: number;
  sessionId: string;
  ratingPalceHolder = 'Rating';
  localityData = [];
  dropdownSettings: IDropdownSettings = {};
  // Hotel Preference
  filterHotels: any;
  destinationDataResponce: any;
  destinationData: any;
  hotelBookedList: any;
  isLoading = true;
  apiDataStatus: boolean;
  cardClick: any;
  ErrorHotel = false;
  destinationData1: any;
  selectedlocality: string[] = [];
  isError = false;
  errorMessage: string;
  selectedhotel: Hotel;
  htlst_htview = true;
  hotelRoom: HotelRoom;
  cardClickData: object;
  from: string;
  to: string;
  start: Date;
  end: Date;
  PrevFrom: string;
  checkApiData: any;
  hotel_room_error = 'error occured';
  hotel_room_error_flag = false;
  checkStatus = false;
  selectedCityId: any;
  isFilterApplied = false;
  constructor(
    private ser: DestinationsApisService,
    private cd: ChangeDetectorRef
  ) {
    // this.farevalue = 5000.0;
    // Hotel Preference
    this.sessionId = sessionStorage.getItem('hotelSessionId');
    //console.log(this.sessionId);

    this.ser.currentCardClickData.subscribe((x) => {
      // console.log(x);
      this.cardClick = x;
      this.from = this.cardClick.cityName;
      this.to = this.cardClick.countryName;
      this.start = this.cardClick.startDate;
      this.end = this.cardClick.endDate;
    });
    this.callhotelListData();
    // TODO: Check the fuction is necessary or not..!
    // this.ser.currentHotelFilterData.subscribe((x) => {
    //   console.log('ASdas', x, this.sessionId);
    //   this.checkStatus = true;
    //   if (this.sessionId && Object.keys(this.sessionId).length > 0) {
    //   this.callhotelListDataFilter(x);
    //   }
    // });

    this.ser.currentErrorMessageHotels.subscribe((err) => {
      if (err) {
        this.isLoading = false;
        this.isError = true;
        this.errorMessage = err;
      }
    });
  }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 2,
      allowSearchFilter: false,
    };
  }
  valueChange(e) {
    console.log(e.target.value, 'vally');
    this.filterHotels = e.target.value;
    if (e.target.value.length > 0) {
      let data = this.destinationData.sort((x, y) => {
        return x.distanceValue - y.distanceValue;
      });
      console.log(data, 'f');
      this.destinationData = data;
    }
  }
  SearchHotel(e: any) {
    this.isError = false;
    let searchdata: any[];
    let searchdata1: any[];
    // let searchdata2: any[];
    if (e.target.value.length > 0) {
      // this.destinationData = this.destinationData1.filter((res) => {
      //   return res.hotelName
      //     .toLocaleLowerCase()
      //     .match(e.target.value.toLocaleLowerCase());
      // });
      searchdata = this.destinationData1.filter((res) => {
        return (
          res.locality
            .toLocaleLowerCase()
            .includes(e.target.value.toLocaleLowerCase()) ||
          res.hotelName
            .toLocaleLowerCase()
            .includes(e.target.value.toLocaleLowerCase())
        );
      });
      // searchdata1 = this.destinationData1.filter((res) => {
      //   return res.hotelName
      //     .toLocaleLowerCase()
      //     .includes(e.target.value.toLocaleLowerCase());
      // });
      // searchdata2 = this.destinationData1.filter((res) => {
      //   return res.cityName
      //     .toLocaleLowerCase()
      //     .includes(e.target.value.toLocaleLowerCase());
      // });
      this.destinationData = searchdata;
      // if (searchdata2.length !== 0) this.destinationData = searchdata2;
      if (this.destinationData.length == 0) {
        this.ErrorHotel = true;
      } else {
        this.ErrorHotel = false;
        this.isError = false;
      }
    } else if (e.target.value === '') {
      this.destinationData = this.destinationData1;
    }
  }
  viewhotel(hotel: Hotel) {
    this.selectedhotel = hotel;
    this.htlst_htview = false;
    this.ser
      .getHotelRoom(
        this.selectedhotel.hotelId,
        this.selectedhotel.sessionId,
        this.selectedhotel.productId,
        this.selectedhotel.tokenId
      )
      .then(
        (res: HotelRoom) => {
          console.log(res);
          this.hotelRoom = res;
          if (res?.rooms.length > 0) {
            let data = this.ser.filterByName(res?.rooms, 'description');
            this.hotelRoom.rooms = data;
          }
        },
        (err) => {
          console.log('hotel room error response', err);
          this.hotel_room_error = err.error.errors;
          this.hotel_room_error_flag = true;
          // this.htlst_htview = !this.htlst_htview;
        }
      );
  }

  addHotels(roomindex) {
    // this.ser.addHotelsList(
    //   this.hotelRoom,
    //   roomindex,
    //   this.hotelRoom.rooms[roomindex].netPrice,
    // );
    console.log('selectedCityId in addHotels', this.selectedCityId);
    this.ser.setSelectedCityId(this.selectedCityId);
    this.ser.addHotelsList(
      this.hotelRoom,
      roomindex,
      this.hotelRoom.rooms[roomindex].netPrice,
      this.selectedhotel.sessionId,
      this.hotelRoom.rooms[roomindex].productId,
      this.hotelRoom.rooms[roomindex].rateBasisId,
      this.selectedhotel.tokenId,
      this.selectedhotel.uuid
    );
    this.htlst_htview = true;
    this.hotelRoom = undefined;
    if (window.screen.width < 992) {
      this.ser.changeViewStatus('');
    }
  }

  async callhotelListData() {
    this.selectedCityId = this.ser.getSelectedCityId();
    console.log('selectedCityId before hotel list', this.selectedCityId);
    this.PrevFrom = this.from;
    // console.log('from', this.from);
    if (this.checkApiData) {
      //console.log('Asashd', this.checkApiData);
      this.checkApiData.unsubscribe();
    }
    //console.log(this.from, this.to, this.start, this.end);

    this.checkApiData = await this.ser
      .getLatestApiHotels(this.from, this.to, this.start, this.end)
      .subscribe(
        async (res: any) => {
          if (res) {
            this.isLoading = false;
          }

          this.destinationData = res.sort(
            (x: any, y: any) => y.hotelRating - x.hotelRating
          );
          if (this.destinationData.length == 0) {
            this.isLoading = false;
            this.isError = true;
            this.errorMessage =
              'No hotels found for city ' + this.from + ' , ' + this.to;
          }
          if (this.destinationData) {
            this.count = 1;
          }
          this.destinationData = await this.ser.filterByName(
            this.destinationData,
            'hotelName'
          );
          console.log(this.destinationData);

          this.dataProcessForFilters(this.destinationData);
          this.destinationData1 = res;
          //  console.log('dnone', this.isLoading);
          this.sessionId = res[0].sessionId;
          sessionStorage.setItem('hotelSessionId', this.sessionId);
        },
        (err) => {
          this.isLoading = false;
          this.isError = true;
          console.log(err);
          console.log(err.error.errors[0], '-hotel error message');
          if (err.statusText) this.errorMessage = err.error.errors[0];
        }
      );
  }

  backclick() {
    if (this.showHotelFilters) {
      this.showHotelFilters = !this.showHotelFilters;
      this.htlst_htview = true;
    } else {
      this.ser.changeVoyaahStatus(true);
      this.ser.changeViewStatus('');
    }
  }
  room_back() {
    this.htlst_htview = true;
    this.hotelRoom = undefined;
    this.hotel_room_error_flag = false;
  }

  // Hotel Preference starts here.....!!
  // backclick() {
  //   this.service.changeViewStatus('hotelTab');
  // }
  hotelFilter() {
    this.ErrorHotel = false;
    let localityString = null;
    this.minPrice = 500;
    this.isError = false;
    this.maxPrice = this.farevalue;
    this.resultCount = 20;
    if (this.selectedlocality.length != 0) {
      localityString = '';
      this.selectedlocality.map((x) => {
        localityString = localityString + x + ',';
      });
      localityString = localityString?.slice(0, -1);
    }
    let rating = null;
    if (this.ratingPalceHolder !== 'Rating') {
      rating = this.ratingPalceHolder;
    }
    var data = {
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      maxResult: this.resultCount,
      rating: rating,
      locality: localityString,
    };
    this.callhotelListDataFilter(data);
    this.showHotelFilters = !this.showHotelFilters;
  }
  clearpreferences() {
    this.ErrorHotel = false;
    this.isError = false;
    this.isFilterApplied = false;
    this.ratingPalceHolder = 'Rating';
    this.farevalue = this.maxValue;
    this.showHotelFilters = false;
    this.isLoading = true;
    this.destinationData = [];
    for (let i = 1; i <= 5; i++) {
      const starelement = document.getElementById(
        'star-' + i
      ) as HTMLInputElement;
      starelement.checked = false;
    }

    this.callhotelListData();
  }
  callhotelListDataFilter(hotelPrefereceData) {
    this.isLoading = true;
    this.destinationData = [];
    this.ser
      .getHotelPrefData(
        hotelPrefereceData,
        this.from,
        this.to,
        this.start,
        this.end,
        this.sessionId
      )
      .subscribe(
        (res) => {
          this.destinationData = res;
          if (res) {
            this.isLoading = false;
            this.isError = false;
            if (this.destinationData.length == 0) {
              this.isError = true;
              this.errorMessage =
                'No hotels found for city ' + this.from + ' , ' + this.to;
            }
          }
        },
        (err) => {
          this.isLoading = false;
          this.isError = true;
          if (err.statusText) this.errorMessage = err.statusText;
        }
      );
  }

  rating(i) {
    this.isFilterApplied = true;
    this.ratingPalceHolder = i;
  }

  showHotelPreference() {
    if (this.count == 1) {
      this.showHotelFilters = !this.showHotelFilters;
      this.htlst_htview = true;
    }
  }
  prefbackclick() {
    this.showHotelFilters = false;
  }

  dataProcessForFilters(data) {
    let hotalPrice = [];
    let hotalLocality = [];
    data.map((x) => {
      if (x.totalPrice != '') {
        hotalPrice.push(x.totalPrice);
      }
      if (x.locality != '') {
        hotalLocality.push(x.locality);
      }
    });
    const min = Math.min(...hotalPrice);
    const max = Math.max(...hotalPrice);
    this.minValue = Math.floor(min);
    this.maxValue = Math.floor(max);
    this.farevalue = 3 * Math.floor(this.minValue / 100) * 100;
    let uniqueChars = [...new Set(hotalLocality)];
    let capuniqueChars;
    for (let capString of uniqueChars) {
      capuniqueChars = capString.charAt(0).toUpperCase() + capString.substr(1);
      this.localityData.push(capuniqueChars);
    }
  }
}
