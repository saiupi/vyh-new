import { error } from 'protractor';
import { Injectable } from '@angular/core';
import {
  APIService as APIServiceCurrentItinerary,
  CreateVYCustomBookingModelInput,
  VYTravelType,
  ListVyCustomBookingModelsQuery,
  ModelVYCustomBookingModelFilterInput,
  ModelStringFilterInput,
  UpdateVYCustomBookingModelInput,
} from '../service-module/aws-current-itinerary.service';
import { AccountService } from '@app/account/services';
import { User } from '@app/account/models';
import { CurrentItinerary, TravelType } from '@ojashub/voyaah-common';
import { UserProfileService } from './user-profile.service';

import { CustomBooking } from '@ojashub/voyaah-common';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AwsTranscationSyncService {
  user: User;
  transactionStringId: any;
  transactionData: any;
  currenttransactionId: any;
  private userData = new BehaviorSubject<boolean>(false);
  checkUser$ = this.userData.asObservable();

  createData(data: boolean) {
    this.userData.next(data);
  }

  constructor(
    private apiServiceCurrentItinerary: APIServiceCurrentItinerary,
    private accountService: AccountService,
    private userProfileService: UserProfileService
  ) {
    this._subscribeToUserLogin();
    this.currenttransactionId = localStorage.getItem('currentTransctionId');
    console.log(this.currenttransactionId, 'currenttransactionId');
    this.getTranscationTotalData();
  }

  private _subscribeToUserLogin(): void {
    this.accountService.user.subscribe((user) => {
      this.user = user;
    });
    console.log(this.user, ' this.user');
  }

  public async saveTranscationData(
    transactionModel: CustomBooking
  ): Promise<void> {
    const currentTransction: CreateVYCustomBookingModelInput = {
      id: transactionModel.id,
      username: this.user.username,
      bookingType: transactionModel.bookingType,
      bookingStatus: transactionModel.bookingStatus,
      travelStartDate: transactionModel.travelStartDate,
      bookingDetails: JSON.stringify(transactionModel.bookingDetails),
      email: transactionModel.email,
      mobileNo: transactionModel.mobileNo,
      travelCity: transactionModel.travelCity,
      bookingReference: new Date().valueOf().toString(),
    };
    console.log(
      'AwsTranscationSyncService: saveTranscationData',
      currentTransction
    );
    localStorage.setItem('IdofBooking', currentTransction.id);
    localStorage.setItem('currentTransctionId', currentTransction.id);

    try {
      this.accountService.isLoggedIn().then(async (loggedIn) => {
        console.log(loggedIn, 'loggedin');
        try {
          if (loggedIn) {
            const result = await this.apiServiceCurrentItinerary.CreateVyCustomBookingModel(
              currentTransction
            );
            this.transactionStringId = result.id;
          }
        } catch (error) {
          console.log(error);
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  // public async updateTranscationData(
  //   transactionModel: TransactionModel
  // ): Promise<void> {
  //   const updateTransction: UpdateVYTransactionModelInput = {
  //     id: transactionModel.id,
  //     username: this.user.username,
  //     transactionType: transactionModel.transactionType,
  //     transactionStatus: transactionModel.transactionStatus,
  //     transactionDate: transactionModel.transactionDate,
  //     transactionId: transactionModel.transactionId,
  //     transactionDetails: transactionModel.transactionDetails,
  //   };
  //   console.log(
  //     'AwsTranscationSyncService: saveTranscationData',
  //     updateTransction
  //   );
  //   try {
  //     this.accountService.isLoggedIn().then(async (loggedIn) => {
  //       console.log(loggedIn, 'loggedin');
  //       try {
  //         if (loggedIn) {
  //           const result = await this.apiServiceCurrentItinerary.UpdateAwsTransactionModel(
  //             updateTransction
  //           );
  //           this.transactionStringId = result.transactionId;
  //         }
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  public async getTranscationTotalData(): Promise<
    CreateVYCustomBookingModelInput
  > {
    try {
      if (this.accountService.isLoggedIn()) {
        const customBooking: CreateVYCustomBookingModelInput = await this.apiServiceCurrentItinerary.GetVyCustomBookingModel(
          this.currenttransactionId as string
        );
        return customBooking;
      }
    } catch (error) {
      console.log('getTransaction in sync', error);
      throw error;
    }
  }

  public async getcustomdetailsbyId(id): Promise<CurrentItinerary> {
    try {
      let data = await this.apiServiceCurrentItinerary.GetVyCustomBookingModel(
        id
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  public async getTranscationData(): Promise<CurrentItinerary[]> {
    try {
      let transactions: CurrentItinerary[] = [];
      if (this.accountService.isLoggedIn()) {
        let userFilter: ModelStringFilterInput = {
          eq: this.user.username,
        };
        let filterInput: ModelVYCustomBookingModelFilterInput = {
          username: userFilter,
        };
        let nextToken: string | undefined | null;
        nextToken = '';
        while (nextToken != null) {
          let data: ListVyCustomBookingModelsQuery;
          if (nextToken.length > 0) {
            data = await this.apiServiceCurrentItinerary.ListVyCustomBookingModels(
              filterInput,
              20,
              nextToken
            );
          } else {
            data = await this.apiServiceCurrentItinerary.ListVyCustomBookingModels(
              filterInput
            );
          }
          for (let i = 0; i < data.items.length; i++) {
            let transactionsData = {
              id: data.items[i].id,
              bookingStatus: data.items[i].bookingStatus,
              bookingDetails: JSON.parse(data.items[i].bookingDetails),
              paymentDetails: JSON.parse(data.items[i].paymentDetails),
            };
            transactions.push(transactionsData);
          }
          nextToken = data.nextToken;
        }
        return transactions;
      }
    } catch (error) {
      console.log('getTransaction in sync', error);
      throw error;
    }
  }
}
