import { error } from 'protractor';
import { CurrentItinerary } from '@ojashub/voyaah-common';
import { Component, OnInit } from '@angular/core';
import { BookingServiceService } from '../../../service-module/booking-service.service';
import { Router } from '@angular/router';
import { StaycationPackagesService } from '@app/service-module/staycation-packages.service';
import { CanceltripService } from '@app/service-module/canceltrip.service';
import { UserProfileService } from '@app/service-module/user-profile.service';
@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss'],
})
export class BookingsComponent implements OnInit {
  transactions: CurrentItinerary[] = [];
  customTravelHistory: CurrentItinerary[] = [];
  customTravelUpcoming: CurrentItinerary[] = [];
  packageId: any;
  totalStacationBookings: any;
  stycationimageone: any;
  stycationimagetwo: any;
  totalStacationBookingsHistory: any;
  userNavigate: any;
  hotelupcomingArray: any[];
  customTravelCancelled: any = [];
  stycationTravelHistory: any = [];
  stycationTravelUpcoming: any = [];
  staycationTravelCancelled: any = [];
  staycationTransactions: any;
  today: Date = new Date();
  pageNo_array: any = [];
  pageNo_array_upcomimg: any = [];
  selectedPagenumber = 1;
  selectedPagenumber_upcoming = 1;
  selectedPagenumber_cancel = 1;
  paginationRecordsHistory: any = [];
  paginationRecordsUpcoming: any = [];
  paginationRecordsCancel: any = [];
  isLoading = false;
  loadMess = false;
  bookingTabStr: any = 'upcoming';
  pageNo_array_cancel: any[];
  constructor(
    private bookingService: BookingServiceService,
    private router: Router,
    private userProfileService: UserProfileService
  ) {
    this.userProfileService.currentUserNavigate.subscribe((res) => {
      if (res === false) {
        this.transactions = [];
      }
    });
    this.userProfileService.currentCustomNavigate.subscribe((res) => {
      if (res === true) {
        this.isLoading = true;
        this.loadMess = true;
        this.getCustomTravelTransactions();
      }
    });
    this.getCustomTravelTransactions();
  }

  ngOnInit() {}
  paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  async getCustomTravelTransactions() {
    try {
      this.isLoading = true;
      this.loadMess = true;
      await this.bookingService.getBookingHistory().then((transactions) => {
        this.transactions = transactions.sort((a, b) => {
          const dateA = new Date(a?.bookingDetails?.startDate);
          const dateB = new Date(b?.bookingDetails?.startDate);
          return dateA > dateB ? -1 : dateA > dateB ? 1 : 0;
        });
        console.log('transactions', this.transactions);
        this.customTravelUpcoming = [];
        this.customTravelHistory = [];
        this.isLoading = false;
        this.loadMess = false;
        for (let i = 0; i < this.transactions?.length; i++) {
          console.log(this.transactions[i]);
          if (
            this.transactions[i].bookingStatus === 'initiatedCancelProcess' ||
            this.transactions[i].bookingStatus === 'refundInitiated' ||
            this.transactions[i].bookingStatus === 'amountRefunded' ||
            this.transactions[i].bookingStatus === 'cancelled'
          ) {
            this.customTravelCancelled?.push(this.transactions[i]);
            this.paginationRecordsCancel?.push(this.transactions[i]);
          } else {
            if (
              this.transactions[i].bookingStatus === 'completedSuccess' ||
              this.transactions[i].bookingStatus === 'partialSuccess' ||
              this.transactions[i].bookingStatus === 'completedFailed'
            ) {
              let travelDates = new Date(
                this.transactions[i].bookingDetails.endDate
              );
              let getTravelDates =
                travelDates.getFullYear() +
                '-' +
                (travelDates.getMonth() + 1) +
                '-' +
                travelDates.getDate();
              let todayDate =
                this.today.getFullYear() +
                '-' +
                (this.today.getMonth() + 1) +
                '-' +
                this.today.getDate();
              var d1 = new Date(getTravelDates.replace(/-/g, '/'));
              var d2 = new Date(todayDate.replace(/-/g, '/'));
              if (getTravelDates == todayDate || d1 > d2) {
                this.customTravelUpcoming?.push(this.transactions[i]);
                this.paginationRecordsUpcoming?.push(this.transactions[i]);
              } else {
                this.customTravelHistory?.push(this.transactions[i]);
                this.paginationRecordsHistory?.push(this.transactions[i]);
              }
            }
          }
        }
        console.log('customTravelHistory', this.customTravelHistory);
        console.log('upcoming', this.customTravelUpcoming);
        console.log('customTravelCancelled', this.customTravelCancelled);
        //pagination histort
        if (this.customTravelHistory?.length > 5) {
          this.pageNo_array = [];
          let i = Math.ceil(this.customTravelHistory?.length / 5);
          for (let p = 1; p <= i; p++) {
            this.pageNo_array.push(p);
          }
        }
        this.selectedPagenumber = 1;
        this.customTravelHistory = this.paginate(
          this.customTravelHistory,
          5,
          1
        );
        //pagination upcoming
        if (this.customTravelUpcoming?.length > 2) {
          this.pageNo_array_upcomimg = [];
          let i = Math.ceil(this.customTravelUpcoming?.length / 5);
          for (let p = 1; p <= i; p++) {
            this.pageNo_array_upcomimg.push(p);
          }
        }
        this.selectedPagenumber_upcoming = 1;
        this.customTravelUpcoming = this.paginate(
          this.customTravelUpcoming,
          5,
          1
        );
        //pagination cancel
        if (this.customTravelCancelled?.length > 2) {
          this.pageNo_array_cancel = [];
          let i = Math.ceil(this.customTravelCancelled?.length / 5);
          for (let p = 1; p <= i; p++) {
            this.pageNo_array_cancel.push(p);
          }
        }
        this.selectedPagenumber_cancel = 1;
        this.customTravelCancelled = this.paginate(
          this.customTravelCancelled,
          5,
          1
        );
      });
    } catch (error) {
      console.log(error);
    }
  }

  async getpaginationforhistory(p) {
    this.selectedPagenumber = p + 1;
    this.customTravelHistory = this.paginate(
      this.paginationRecordsHistory,
      5,
      p + 1
    );
  }

  async getpaginationforupcomimg(p) {
    this.selectedPagenumber_upcoming = p + 1;
    this.customTravelUpcoming = this.paginate(
      this.paginationRecordsUpcoming,
      5,
      p + 1
    );
  }

  async getpaginationforcancel(p) {
    this.selectedPagenumber_cancel = p + 1;
    this.customTravelCancelled = this.paginate(
      this.paginationRecordsCancel,
      5,
      p + 1
    );
  }

  getUpcomingCountry(id) {
    let countryArray = [];
    for (let i = 0; i < this.transactions?.length; i++) {
      if (id === this.transactions[i].id) {
        for (
          let j = 0;
          j < this.transactions[i]?.bookingDetails?.dayPlanner?.length;
          j++
        ) {
          let dayplannerArray = this.transactions[i]?.bookingDetails
            ?.dayPlanner;
          for (let p = 0; p < dayplannerArray?.length; p++) {
            countryArray.push(dayplannerArray[p].countryName);
          }
          //  countryArray.push(this.transactions[i]?.bookingDetails?.dayPlanner[j].countryName);
          const lowercased = countryArray?.map((name) => name.toLowerCase());
          let uniqueChars = lowercased?.filter(
            (c, index) => lowercased.indexOf(c) === index
          );
          return uniqueChars;
        }
      }
    }
  }

  getHotelImage(id) {
    this.hotelupcomingArray = [];
    let hotelArray = [];
    for (let i = 0; i < this.transactions?.length; i++) {
      if (id === this.transactions[i].id) {
        for (
          let j = 0;
          j < this.transactions[i]?.bookingDetails?.dayPlanner?.length;
          i++
        ) {
          hotelArray.push(
            this.transactions[i]?.bookingDetails.dayPlanner[j].hotelDetails
          );
          let hotelObjectArray = hotelArray.filter(
            (value) => JSON.stringify(value) !== '{}'
          );
          this.hotelupcomingArray = hotelObjectArray.filter(function (x) {
            return x !== undefined || null;
          });

          if (
            this.transactions[i]?.bookingDetails?.dayPlanner[j]?.activityDetails
              ?.length >= 1
          ) {
            return this.transactions[i]?.bookingDetails?.dayPlanner[j]
              ?.activityDetails[0].coverImageUrl;
          } else {
            if (this.hotelupcomingArray.length > 0) {
              if (
                this.hotelupcomingArray[0].hotelContent?.images[0].url?.length >
                0
              ) {
                return this.hotelupcomingArray[0].hotelContent.images[0].url;
              }
            }
          }
        }
      }
    }
  }

  getHotelImage1(id) {
    this.hotelupcomingArray = [];
    let hotelArray = [];
    for (let i = 0; i < this.transactions?.length; i++) {
      if (id === this.transactions[i].id) {
        for (
          let j = 0;
          j < this.transactions[i]?.bookingDetails?.dayPlanner?.length;
          i++
        ) {
          hotelArray.push(
            this.transactions[i]?.bookingDetails.dayPlanner[j].hotelDetails
          );
          let hotelObjectArray = hotelArray.filter(
            (value) => JSON.stringify(value) !== '{}'
          );
          this.hotelupcomingArray = hotelObjectArray.filter(function (x) {
            return x !== undefined || null;
          });

          if (
            this.transactions[i]?.bookingDetails?.dayPlanner[j]?.activityDetails
              ?.length > 1
          ) {
            return this.transactions[i]?.bookingDetails?.dayPlanner[j]
              ?.activityDetails[1].coverImageUrl;
          } else {
            if (this.hotelupcomingArray.length > 0) {
              if (
                this.hotelupcomingArray[0].hotelContent?.images[0].url?.length >
                0
              ) {
                return this.hotelupcomingArray[0].hotelContent.images[0].url;
              }
            }
          }
          if (this.hotelupcomingArray.length > 0) {
            if (
              this.hotelupcomingArray[0].hotelContent?.images[1]?.url?.length >
              0
            ) {
              return this.hotelupcomingArray[0].hotelContent.images[1]?.url;
            }
          }
        }
      }
    }
  }

  getHotelImage2(id, num) {
    this.hotelupcomingArray = [];
    let hotelArray = [];
    for (let i = 0; i < this.transactions?.length; i++) {
      if (id === this.transactions[i].id) {
        for (
          let j = 0;
          j < this.transactions[i]?.bookingDetails?.dayPlanner?.length;
          i++
        ) {
          hotelArray.push(
            this.transactions[i]?.bookingDetails.dayPlanner[j].hotelDetails
          );
          let hotelObjectArray = hotelArray.filter(
            (value) => JSON.stringify(value) !== '{}'
          );
          this.hotelupcomingArray = hotelObjectArray.filter(function (x) {
            return x !== undefined || null;
          });

          if (this.hotelupcomingArray.length > 0) {
            if (
              this.hotelupcomingArray[0].hotelContent?.images[num]?.url
                ?.length > 0
            ) {
              return this.hotelupcomingArray[0].hotelContent.images[num]?.url;
            }
          }
        }
      }
    }
  }

  getBookingStatus(id) {
    for (let i = 0; i < this.transactions?.length; i++) {
      if (id === this.transactions[i].id) {
        return this.transactions[i].bookingStatus;
      }
    }
  }
  getTransactionId(id) {
    for (let i = 0; i < this.transactions?.length; i++) {
      if (id === this.transactions[i].id) {
        return this.transactions[i]?.paymentDetails?.txid;
      }
    }
  }
  getReferenceId(id) {
    for (let i = 0; i < this.transactions?.length; i++) {
      if (id === this.transactions[i].id) {
        return this.transactions[i]?.paymentDetails?.bid;
      }
    }
  }

  viewTrip(index) {
    localStorage.setItem('customId', index);
    this.bookingService.custombooking(true);
    this.router.navigate(['/view-booking']);
  }
  bookingTab(tab) {
    this.bookingTabStr = tab;
  }
}
