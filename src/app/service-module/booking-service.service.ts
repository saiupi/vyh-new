import { Injectable } from '@angular/core';
import { UserItineraryService } from './user-itinerary.service';
import { HttpClient } from '@angular/common/http';
import { AwsTranscationSyncService } from './aws-transcation-sync.service';
import { CurrentItinerary } from '@ojashub/voyaah-common';
import { error } from 'protractor';
import { BehaviorSubject } from 'rxjs';
import { CreateVYCustomBookingModelInput } from './aws-current-itinerary.service';
import { environment } from '../../environments/environment';
import { ConfigService } from '@app/config.service';

@Injectable({
  providedIn: 'root',
})
export class BookingServiceService {
  baseURL: any = environment.apiServer;
  bookingDetails: any;
  bookingHistory: any = [];

  public customBook = new BehaviorSubject<boolean>(false);
  customBookingRes = this.customBook.asObservable();

  constructor(
    public http: HttpClient,
    public awsTransactionService: AwsTranscationSyncService,
    private configService: ConfigService
  ) {}

  public async getBookingHistory(): Promise<CurrentItinerary[]> {
    this.bookingHistory = [];
    try {
      await this.awsTransactionService
        .getTranscationData()
        .then((transactions: CurrentItinerary[]) => {
          this.bookingHistory = transactions;
        });
      console.log('booking history', this.bookingHistory);
      return this.bookingHistory;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async getBookingHistoryTranscation(): Promise<
    CreateVYCustomBookingModelInput
  > {
    let bookingHistory: CreateVYCustomBookingModelInput;
    try {
      await this.awsTransactionService
        .getTranscationTotalData()
        .then((transactions: CreateVYCustomBookingModelInput) => {
          bookingHistory = transactions;
        });
      console.log('booking history', bookingHistory);
      return bookingHistory;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  public async getcustomdetailsById(id) {
    let data = await this.awsTransactionService.getcustomdetailsbyId(id);
    return data;
  }
  custombooking(data: boolean) {
    this.customBook.next(data);
  }
  sendCustomCancellationData(data) {
    return this.http.post(this.configService.apiUrl.customCancel, data);
  }

  getflightcancellationpolicy(id) {
    return this.http.get(
      this.configService.apiUrl.getFareRules + `?fareSourceCode=${id}`
    );
  }
}
