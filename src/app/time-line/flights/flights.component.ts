import { Component, OnInit } from '@angular/core';
import { UserItineraryService } from './../../service-module/user-itinerary.service';
import { DestinationsApisService } from '../destinations-apis.service';
@Component({
  selector: 'app-flights',
  templateUrl: './flights.component.html',
  styleUrls: ['./flights.component.scss'],
})
export class FlightsComponent implements OnInit {
  flightStatus: any;
  flightsRecord: string;
  FlightRecod;
  returnFlight: any;
  FlightDetailsMain:any =[];
  return:any =[];
  previewItenaryDetails : any;
  constructor(private UserItinerary: UserItineraryService) {
    let UserData = this.UserItinerary.userItineraryData();
    this.previewItenaryDetails = UserData.dayPlanner;
    if(UserData.returnPlan?.length>0)
    {
      this.returnFlight = UserData.returnPlan;
      this.return.push(UserData.returnPlan.flightDetails);
    }
  
    console.log(UserData,this.returnFlight, 'total');

    let UserDataFlights = UserData.dayPlanner;
    console.log(UserDataFlights, 'UserData');
    let newFlightObject = UserDataFlights?.map((fli) => {
      let flightData = {
        flightData: fli,
      };
      return flightData;
    });
    this.flightStatus = newFlightObject;
  }
  ngOnInit() {
  console.log(this.flightStatus, 'Flights');
  for(let i=0;i<this.previewItenaryDetails?.length;i++)
    {
      this.FlightDetailsMain.push(this.previewItenaryDetails[i].flightDetails);

    }
    this.FlightDetailsMain = this.FlightDetailsMain.filter((value) => JSON.stringify(value) !== '{}');
    this.FlightDetailsMain = this.FlightDetailsMain.filter((value) => JSON.stringify(value) !== '[]');
    this.FlightDetailsMain =  this.FlightDetailsMain.filter(function (x) {
      return x !== undefined || null;
    });
    console.log(this.FlightDetailsMain);
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
}
