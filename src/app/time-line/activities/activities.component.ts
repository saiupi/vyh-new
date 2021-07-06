import { filter } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { UserItineraryService } from './../../service-module/user-itinerary.service';
import { DestinationsApisService } from '../destinations-apis.service';
@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.scss'],
})
export class ActivitiesComponent implements OnInit {

  Dailydata: any;
  previewItenaryDetails:any;
  ActivitesDetails: any =[];
  constructor(
    private UserItinerary: UserItineraryService,
  ) {
    let UserData = this.UserItinerary.userItineraryData();
    let UserDataDaily = UserData.dayPlanner;
    this.previewItenaryDetails = UserData.dayPlanner
    console.log(UserDataDaily, 'UserData');

    let newDailyData = UserDataDaily?.map((h) => {
      let DailyObject = {
        dailyData: h,
      };
      return DailyObject;
    });
    this.Dailydata = newDailyData;
  }
  ngOnInit() {
    console.log(this.previewItenaryDetails, 'hotel');
    for(let i=0;i<this.previewItenaryDetails?.length;i++)
    {
      this.ActivitesDetails.push(this.previewItenaryDetails[i].activityDetails)
    }
    this.ActivitesDetails = this.ActivitesDetails.filter((value) => JSON.stringify(value) !== '{}');
    this.ActivitesDetails = this.ActivitesDetails.filter((value) => JSON.stringify(value) !== '[]');
    console.log(this.ActivitesDetails)
  }
  trimString(text, range) {
    return text?.length > range ? text.substr(0, range - 1) + '...' : text;
  }
}
