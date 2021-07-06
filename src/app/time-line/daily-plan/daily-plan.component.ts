import { Component, OnInit } from '@angular/core';
import { UserItineraryService } from './../../service-module/user-itinerary.service';
@Component({
  selector: 'app-daily-plan',
  templateUrl: './daily-plan.component.html',
  styleUrls: ['./daily-plan.component.scss'],
})
export class DailyPlanComponent implements OnInit {
  Dailydata: any;
  constructor(
    private UserItinerary: UserItineraryService,
  ) {
    let UserData = this.UserItinerary.userItineraryData();
    let UserDataDaily = UserData.dayPlanner;
    let newDailyData = UserDataDaily?.map((h) => {
      let DailyObject = {
        dailyData: h,
      };
      return DailyObject;
    });
    this.Dailydata = newDailyData;
  }
  allres: any;
  ngOnInit() {
    console.log(this.Dailydata, 'DailyPlan');
  }

  trimString(text, range) {
    return text?.length > range ? text.substr(0, range - 1) + '...' : text;
  }
}
