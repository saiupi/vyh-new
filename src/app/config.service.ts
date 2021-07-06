import { Platform } from '@ionic/angular';
import { environment } from './../environments/environment';
import { Injectable } from '@angular/core';

const API_NAMES = [
  'hotelcities',
  'flights',
  'airports',
  'hotels',
  'packages',
  'activities',
  'activitypreferences',
  'payments',
  'paymentResponse',
  'staycations',
  'revalidate',
  'changeNotify',
  'validateStaycationBooking',
  'getRefundDetails',
  'cancelStaycationBooking',
  'vendorCode',
  'getCouponDetails',
  'vendorStaycations',
  'packagesByVendorName',
  'availableDates',
  'slots',
  'pickupPoints',
  'activityDetails',
  'cities',
  'createCart',
  'checkInventory',
  'customCancel',
  'getFareRules',
] as const;

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  baseApi: string;
  apiUrl: Record<typeof API_NAMES[number], string> = {
    hotelcities: '',
    flights: '',
    hotels: '',
    packages: '',
    airports: '',
    activities: '',
    activitypreferences: '',
    payments: '',
    paymentResponse: '',
    staycations: '',
    revalidate: '',
    changeNotify: '',
    validateStaycationBooking: '',
    getRefundDetails: '',
    cancelStaycationBooking: '',
    vendorCode: '',
    getCouponDetails: '',
    vendorStaycations: '',
    packagesByVendorName: '',
    availableDates: '',
    slots: '',
    pickupPoints: '',
    activityDetails: '',
    cities: '',
    createCart: '',
    checkInventory: '',
    customCancel: '',
    getFareRules: '',
  };

  constructor(private platform: Platform) {
    if (platform.is('mobile')) {
      this.baseApi = `${environment.apiServer}/api`;
    } else {
      this.baseApi = `/api`;
    }
    for (const apiName of API_NAMES) {
      this.apiUrl[apiName] = `${this.baseApi}/${apiName}`;
    }
  }
}
