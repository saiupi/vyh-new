import { Component, OnInit } from '@angular/core';
import { BookingServiceService } from '../../../service-module/booking-service.service';
import { Router } from '@angular/router';
import { StaycationPackagesService } from '@app/service-module/staycation-packages.service';
import { CanceltripService } from '@app/service-module/canceltrip.service';

@Component({
  selector: 'app-staycation-bookings',
  templateUrl: './staycation-bookings.component.html',
  styleUrls: ['./staycation-bookings.component.scss'],
})
export class StaycationBookingsComponent implements OnInit {
  totalstaycation: any;
  stycationTravelHistory: any = [];
  stycationTravelUpcoming: any = [];
  staycationTravelCancelled: any = [];
  staycationTransactions: any;
  today: Date = new Date();
  previewStaycation = 'booking';
  selectedPagenumber = 1;
  selectedPagenumber_upcoming = 1;
  selectedPagenumber_cancel = 1;
  packages: any = [];
  // allstacationlist:any =[]
  pageNo_array: any[];
  pageNo_array_upcomimg: any[];
  pageNo_array_cancel: any;
  paginationRecordsCancel: any = [];
  paginationRecordsUpcoming: any = [];
  paginationRecordsHistory: any = [];
  isLoading = false;
  loadMess = false;
  vendorNames: any;
  totalstaycation1: any;
  bookingTabStr: any = 'upcoming';
  constructor(
    private staycationService: StaycationPackagesService,
    private router: Router,
    private canceltripService: CanceltripService
  ) {
    this.staycationService.staycationBookingChanges.subscribe((res) => {
      if (res) {
        this.getStaycationTransactions();
        this.totalstaycation = this.staycationService.stacationListpreview();
      }
    });
    this.getStaycationTransactions();
  }

  ngOnInit() {}

  paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  async getStaycationTransactions() {
    try {
      this.isLoading = true;
      this.loadMess = true;
      await this.staycationService
        .getUsersStaycationBooking()
        .then(async (transactions) => {
          let transactionData = transactions;
          console.log(transactions);
          this.stycationTravelHistory = [];
          this.stycationTravelUpcoming = [];
          this.staycationTravelCancelled = [];
          this.staycationTransactions = [];
          this.staycationTransactions = transactions;
          for (let i = 0; i < transactionData.length; i++) {
            if (transactionData[i].vendorId?.length > 0) {
              this.vendorNames = transactionData[i].vendorId;
            }
          }
          this.staycationTransactions.sort((a, b) => {
            const dateA = new Date(a.travelStartDate);
            const dateB = new Date(b.travelStartDate);
            return dateA > dateB ? -1 : dateA > dateB ? 1 : 0;
          });
          await this.staycationTransactions.map((res, index) => {
            this.staycationTransactions[index].bookingDetails = JSON.parse(
              res.bookingDetails
            );
            this.staycationTransactions[index].paymentDetails = JSON.parse(
              res.paymentDetails
            );
          });
          this.isLoading = false;
          this.loadMess = false;
          for (let i = 0; i < this.staycationTransactions?.length; i++) {
            if (
              this.staycationTransactions[i].bookingStatus ===
                'initiatedCancelProcess' ||
              this.staycationTransactions[i].bookingStatus ===
                'refundInitiated' ||
              this.staycationTransactions[i].bookingStatus === 'amountRefunded'
            ) {
              this.staycationTravelCancelled?.push(
                this.staycationTransactions[i]
              );
              this.paginationRecordsCancel?.push(
                this.staycationTransactions[i]
              );
              this.staycationTravelCancelled.sort((a, b) => {
                const dateA = new Date(a.canceledDate);
                const dateB = new Date(b.canceledDate);
                return dateA > dateB ? -1 : dateA > dateB ? 1 : 0;
              });
            } else {
              if (
                this.staycationTransactions[i].bookingStatus ===
                  'completedSuccess' ||
                this.staycationTransactions[i].bookingStatus ===
                  'partialSuccess' ||
                this.staycationTransactions[i].bookingStatus ===
                  'completedFailed'
              ) {
                let travelDatesStaycation = new Date(
                  this.staycationTransactions[i].travelStartDate
                );
                let getTravelDatesStaycation =
                  travelDatesStaycation.getFullYear() +
                  '-' +
                  (travelDatesStaycation.getMonth() + 1) +
                  '-' +
                  travelDatesStaycation.getDate();
                let todayDate =
                  this.today.getFullYear() +
                  '-' +
                  (this.today.getMonth() + 1) +
                  '-' +
                  this.today.getDate();
                var d3 = new Date(getTravelDatesStaycation.replace(/-/g, '/'));
                var d4 = new Date(todayDate.replace(/-/g, '/'));
                console.log(getTravelDatesStaycation);
                console.log(todayDate);
                if (getTravelDatesStaycation == todayDate || d3 > d4) {
                  this.stycationTravelUpcoming?.push(
                    this.staycationTransactions[i]
                  );
                  this.paginationRecordsUpcoming?.push(
                    this.staycationTransactions[i]
                  );
                } else {
                  this.stycationTravelHistory?.push(
                    this.staycationTransactions[i]
                  );
                  this.paginationRecordsHistory?.push(
                    this.staycationTransactions[i]
                  );
                }
              }
            }
          }

          console.log(this.stycationTravelUpcoming, 'stycationTravelUpcoming');
          console.log(this.stycationTravelHistory, 'stycationTravelHistory');
          console.log(
            this.staycationTravelCancelled,
            'staycationTravelCancelled'
          );
          //pagination upcoming
          if (this.stycationTravelUpcoming?.length > 5) {
            this.pageNo_array_upcomimg = [];
            let i = Math.ceil(this.stycationTravelUpcoming?.length / 5);
            for (let p = 1; p <= i; p++) {
              this.pageNo_array_upcomimg.push(p);
            }
          }
          this.selectedPagenumber_upcoming = 1;
          this.stycationTravelUpcoming = this.paginate(
            this.stycationTravelUpcoming,
            5,
            1
          );
          //pagination histort
          if (this.stycationTravelHistory?.length > 5) {
            this.pageNo_array = [];
            let i = Math.ceil(this.stycationTravelHistory?.length / 5);
            for (let p = 1; p <= i; p++) {
              this.pageNo_array.push(p);
            }
          }
          this.selectedPagenumber = 1;
          this.stycationTravelHistory = this.paginate(
            this.stycationTravelHistory,
            5,
            1
          );
          //cancel
          if (this.staycationTravelCancelled?.length > 2) {
            this.pageNo_array_cancel = [];
            let i = Math.ceil(this.staycationTravelCancelled?.length / 5);
            for (let p = 1; p <= i; p++) {
              this.pageNo_array_cancel.push(p);
            }
          }
          this.selectedPagenumber_cancel = 1;
          this.staycationTravelCancelled = this.paginate(
            this.staycationTravelCancelled,
            5,
            1
          );
        });
    } catch (err) {
      console.log('staycation transaction error in booking component.ts', err);
    }
  }

  // for (let i = 0; i < transactionData.length; i++) {
  //   if (transactionData[i].vendorId?.length > 0) {
  //     this.vendorNames = transactionData[i].vendorId;
  //     this.totalstaycation = await this.vendorName();
  //   }
  //   this.totalstaycation = await this.NormalPackages();
  // }

  navigateStaycation() {
    this.router.navigate(['/staycation']);
  }
  getpaginationforhistory(p) {
    this.selectedPagenumber = p + 1;
    this.stycationTravelHistory = this.paginate(
      this.paginationRecordsHistory,
      5,
      p + 1
    );
  }

  getpaginationforupcomimg(p) {
    this.selectedPagenumber_upcoming = p + 1;
    this.stycationTravelUpcoming = this.paginate(
      this.paginationRecordsUpcoming,
      5,
      p + 1
    );
  }

  getpaginationforcancel(p) {
    this.selectedPagenumber_cancel = p + 1;
    this.staycationTravelCancelled = this.paginate(
      this.paginationRecordsCancel,
      5,
      p + 1
    );
  }

  async viewTripstycation(
    packageReference: string,
    packageId: string,
    vendorName: string,
    staycationId
  ) {
    console.log(vendorName);
    if (vendorName?.length > 0) {
      this.totalstaycation1 = await this.staycationService.vendorStaycations(
        vendorName
      );
      console.log(this.totalstaycation1);
      let bookingId = 'Id' + staycationId;
      console.log(packageId, vendorName, '---------');
      this.staycationService.setpreviewOption(this.previewStaycation);
      this.canceltripService.setSelectedBooking(packageId);
      this.canceltripService.setSelectedPackage(this.totalstaycation1);
      console.log(packageReference, vendorName);
      this.router.navigate([
        '/staycation/' + packageReference + '/' + vendorName?.concat(bookingId),
      ]);
    }
    if (vendorName?.length == 0 || vendorName == '') {
      this.totalstaycation = await this.staycationService.stacationListpreview();
      console.log(this.totalstaycation);
      let noramlPackages = 'voyaah';
      let bookingId = 'Id' + staycationId;
      console.log(packageId, '---------');
      this.staycationService.setpreviewOption(this.previewStaycation);
      this.canceltripService.setSelectedBooking(packageId);
      this.canceltripService.setSelectedPackage(this.totalstaycation);
      this.router.navigate([
        '/staycation/' +
          packageReference +
          '/' +
          noramlPackages?.concat(bookingId),
      ]);
    }
  }
  bookingTab(tab) {
    this.bookingTabStr = tab;
  }
}
