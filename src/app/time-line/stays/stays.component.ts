import { UserItineraryService } from './../../service-module/user-itinerary.service';
import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { DestinationsApisService } from '../destinations-apis.service';

@Component({
  selector: 'app-stays',
  templateUrl: './stays.component.html',
  styleUrls: ['./stays.component.scss'],
})
export class StaysComponent implements OnInit {

  Dailydata: any;
  dailyPlan;
  Dayrecord: number = null;

  previewItenaryDetails: any;
  HotelDetails:any =[];
  constructor(private UserItinerary: UserItineraryService) {
    let UserData = this.UserItinerary.userItineraryData();
    let UserDataDaily = UserData.dayPlanner;
    this.previewItenaryDetails = UserData.dayPlanner;
    let newDailyData = UserDataDaily?.map((h) => {
      let DailyObject = {
        dailyData: h,
      };
      return DailyObject;
    });
    this.Dailydata = newDailyData;
  }
  ngOnInit() {
    let UserData = this.UserItinerary.userItineraryData();
    for(let i=0;i<this.previewItenaryDetails?.length;i++)
    {
      this.HotelDetails.push(this.previewItenaryDetails[i].hotelDetails)
    }
    this.HotelDetails = this.HotelDetails.filter((value) => JSON.stringify(value) !== '{}');
    this.HotelDetails = this.HotelDetails.filter((value) => JSON.stringify(value) !== '[]');
    console.log(this.HotelDetails)
  }
}

