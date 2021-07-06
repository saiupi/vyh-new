import { stop, Flight } from './time-line/destinations-apis.service';
import { Pipe, PipeTransform } from '@angular/core';
import { CurrentItinerary, DayPlanner } from '@ojashub/voyaah-common';

@Pipe({
  name: 'durationPipe',
})
export class DurationPipePipe implements PipeTransform {
  transform(value: number): string {
    let hours = Math.floor(value / 60);
    let minutes = Math.floor(value % 60);
    return hours + ' h ' + minutes + ' m';
  }
}
@Pipe({
  name: 'defineName',
})
export class FilterPipe implements PipeTransform {
  transform(value: string): string {
    return value.toLowerCase().replace(/(?:^|\s)[a-z]/g, function (m) {
      return m.toUpperCase();
    });
  }
}
@Pipe({
  name: 'toNumber',
})
export class NumberPipe implements PipeTransform {
  transform(value: string): number {
    return Number(value);
  }
}
@Pipe({
  name: 'airlinesImage',
})
export class AirlinesImagePipe implements PipeTransform {
  transform(value: stop[]): string[] {
    let imagesarray: string[] = [];
    if (value.length == 1) {
      imagesarray.push(value[0].airlineInfo.logoURL);
    } else {
      imagesarray = value
        .map((v) => {
          return v.airlineInfo.logoURL;
        })
        .filter((elem, index, self) => {
          return index === self.indexOf(elem);
        });
    }
    return imagesarray;
  }
}
@Pipe({
  name: 'airlinesName',
})
export class AirlinesNamePipe implements PipeTransform {
  transform(value: stop[]): string[] {
    let namesarray: string[] = [];
    if (value.length == 1) {
      namesarray.push(value[0].airlineInfo.name);
    } else {
      namesarray = value
        .map((v) => {
          return v.airlineInfo.name;
        })
        .filter((elem, index, self) => {
          return index === self.indexOf(elem);
        });
    }
    return namesarray;
  }
}
@Pipe({
  name: 'totalDuration',
})
export class TotalDurationPipe implements PipeTransform {
  transform(flight: Flight): number {
    if (flight.flightSegments.length > 1) {
      let layoverminutes = 0;
      // for (let i = 0; i < flight.flightSegments.length - 1; i++) {
      let date1 = new Date(
        flight.flightSegments[flight.flightSegments.length - 1].arrivalDateTime
      );
      let date2 = new Date(flight.flightSegments[0].departureDateTime);
      layoverminutes = Math.round(
        (date1.getTime() - date2.getTime()) / 1000 / 60
      );
      // }
      return layoverminutes;
    } else {
      return flight.totalDuration;
    }
  }
}

@Pipe({
  name: 'flightsPricePipe',
})
export class FlightsPricePipe implements PipeTransform {
  transform(CurrentItinerary: CurrentItinerary, fareType?: string) {
    let returnValue = 0;
    // console.log(fareType, CurrentItinerary);
    let totalFlights = [];
    let returnPlan;
    // console.log(CurrentItinerary);
    if (CurrentItinerary?.returnPlan?.length > 0) {
      for (let i = 0; i < CurrentItinerary?.returnPlan?.length; i++) {
        totalFlights.push(CurrentItinerary?.returnPlan[i].flightDetails);
      }
    }

    for (let i = 0; i < CurrentItinerary?.dayPlanner?.length; i++) {
      totalFlights.push(CurrentItinerary?.dayPlanner[i].flightDetails);
    }
    totalFlights = totalFlights?.filter(
      (value) => JSON.stringify(value) !== '{}'
    );
    totalFlights = totalFlights?.filter(
      (value) => JSON.stringify(value) !== '[]'
    );
    totalFlights = totalFlights?.filter(function (x) {
      return x !== undefined || null;
    });
    // console.log(totalFlights);
    if (fareType == 'totalTax') {
      for (let i = 0; i < totalFlights?.length; i++) {
        if (totalFlights[i]?.fareDetails?.totalTax != undefined) {
          returnValue =
            returnValue + Number(totalFlights[i]?.fareDetails?.totalTax.amount);
        }
      }
    } else if (fareType == 'equiFare') {
      for (let i = 0; i < totalFlights?.length; i++) {
        if (totalFlights[i]?.fareDetails?.equivFare != undefined) {
          returnValue =
            returnValue +
            Number(totalFlights[i]?.fareDetails?.equivFare.amount);
        }
      }
    } else if (fareType == 'totalFare') {
      for (let i = 0; i < totalFlights?.length; i++) {
        if (totalFlights[i]?.fareDetails?.totalFare != undefined) {
          returnValue =
            returnValue +
            Number(totalFlights[i]?.fareDetails?.totalFare.amount);
        }
      }
    }
    return returnValue;
  }
}
@Pipe({
  name: 'hotelsPricePipe',
})
export class HotelsPricePipe implements PipeTransform {
  transform(dayplanner: DayPlanner) {
    let hotelsPrice = 0;
    for (let i = 0; i < dayplanner?.length; i++) {
      if (dayplanner[i].hotelDetails?.selectedRoom?.netPrice != undefined) {
        hotelsPrice =
          hotelsPrice +
          Number(dayplanner[i].hotelDetails?.selectedRoom?.netPrice);
      }
    }
    return hotelsPrice;
  }
}
@Pipe({
  name: 'activityPricePipe',
})
export class ActivityPricePipe implements PipeTransform {
  transform(dayplanner: DayPlanner) {
    let activityPrice = 0;
    for (let i = 0; i < dayplanner?.length; i++) {
      for (let j = 0; j < dayplanner[i]?.activityDetails?.length; j++) {
        if (dayplanner[i].activityDetails[j]?.grandtotal != undefined) {
          // console.log(dayplanner[i].activityDetails[j]?.grandtotal);
          activityPrice =
            activityPrice + Number(dayplanner[i].activityDetails[j].grandtotal);
        }
      }
    }
    return activityPrice;
  }
}
@Pipe({
  name: 'totalPricePipe',
})
export class TotalPricePipe implements PipeTransform {
  transform(CurrentItinerary: CurrentItinerary) {
    // console.log(CurrentItinerary);
    let totalPrice = 0;
    if (CurrentItinerary?.dayPlanner?.length > 0) {
      for (let i = 0; i < CurrentItinerary?.dayPlanner.length; i++) {
        if (CurrentItinerary?.dayPlanner[i]?.activityDetails?.length > 0) {
          // console.log(CurrentItinerary?.dayPlanner[i]?.activityDetails);
          for (
            let j = 0;
            j < CurrentItinerary?.dayPlanner[i].activityDetails?.length;
            j++
          ) {
            totalPrice =
              totalPrice +
              Number(
                CurrentItinerary?.dayPlanner[i]?.activityDetails[j]?.grandtotal
              );
          }
        }
        if (
          CurrentItinerary?.dayPlanner[i].flightDetails?.fareDetails !=
          undefined
        ) {
          totalPrice =
            totalPrice +
            Number(
              CurrentItinerary?.dayPlanner[i].flightDetails?.fareDetails
                ?.totalFare.amount
            );
        }

        if (
          CurrentItinerary.dayPlanner[i].hotelDetails?.selectedRoom?.netPrice !=
          undefined
        ) {
          totalPrice =
            totalPrice +
            Number(
              CurrentItinerary?.dayPlanner[i].hotelDetails?.selectedRoom
                ?.netPrice
            );
        }
      }
    }
    if (CurrentItinerary?.returnPlan?.length > 0) {
      if (
        CurrentItinerary?.returnPlan[0].flightDetails?.fareDetails != undefined
      ) {
        totalPrice =
          totalPrice +
          Number(
            CurrentItinerary?.returnPlan[0].flightDetails?.fareDetails
              ?.totalFare.amount
          );
      }
    }
    return totalPrice;
  }
}
