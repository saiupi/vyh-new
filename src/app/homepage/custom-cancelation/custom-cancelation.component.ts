import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BookingServiceService } from '@app/service-module/booking-service.service';
import { UserProfileService } from '@app/service-module/user-profile.service';
import {
  CurrentItinerary,
  PaymentDetails,
  CustomBooking,
  UserProfileDetails,
  CustomBookingCancel,
} from '@ojashub/voyaah-common';

@Component({
  selector: 'app-custom-cancelation',
  templateUrl: './custom-cancelation.component.html',
  styleUrls: ['./custom-cancelation.component.scss'],
})
export class CustomCancelationComponent implements OnInit {
  noOfAdults = undefined;
  currentItineraryData: CustomBooking;
  bookingDetails: CurrentItinerary;
  paymentDetails: PaymentDetails;
  userDetails: UserProfileDetails;
  previewItenaryDetails: any[];
  randomActiveImage: any[];
  sideImg0: any;
  sideImg1: any;
  sideImg2: any;
  sideImg3: any;
  activityCoverImg: any;
  activityCoverImg2: any;
  startDate: Date;
  flightsData = [];
  hotelData = [];
  activityData = [];
  tripStartDate: any;
  cancellationapiData: CustomBookingCancel;
  modelbody: boolean;
  cancelPoliciesstatus: boolean;
  flightpolicyresult = [];
  cancelbuttonstatus = false;
  modelbodyflight: boolean;
  modelbodyhotel: boolean;
  modelbodyactivity: boolean;
  hotelid = 0;
  acyivityid = 0;
  flightid = 0;
  flightErrorMessage = '';
  hotelErrorMessage = '';
  activityErrorMessage = '';
  activitycancelpolicy = [];
  hotelcancelpolicy = '';
  flightcancelpolicy: any;
  constructor(
    private userProfileService: UserProfileService,
    private bookingService: BookingServiceService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.cancellationapiData = {
      id: '',
      email: '',
      name: '',
      hotelDetails: [],
      flightDetails: [],
      activityDetails: [],
      bookingReference: '',
      transactionId: '',
      refundAmount: 0,
    };
  }

  ngOnInit() {
    this.userDetails = this.userProfileService.getUserDetails();
    this.userProfileService.currentUserProfileData.subscribe((res) => {
      this.userDetails = this.userProfileService.getUserDetails();
    });
    this.route.params.subscribe((params) =>
      this.getcustomdetailbyid(params.cancelationid)
    );
  }

  public async getcustomdetailbyid(id) {
    this.flightsData = [];
    this.hotelData = [];
    this.activityData = [];
    this.currentItineraryData = await this.bookingService.getcustomdetailsById(
      id
    );
    this.bookingDetails = JSON.parse(this.currentItineraryData.bookingDetails);
    console.log('currentItineraryData', this.currentItineraryData);
    console.log('this.bookingDetails', this.bookingDetails);

    this.paymentDetails = JSON.parse(this.currentItineraryData.paymentDetails);
    this.previewItenaryDetails = this.bookingDetails.dayPlanner;
    this.noOfAdults = this.bookingDetails.selectedTravellers.adults.length;
    this.startDate = this.bookingDetails.startDate;
    this.tripStartDate = this.bookingDetails.startDate;
    this.getImage();
    this.getUpcomingCountry();
    this.bookingDetails.dayPlanner.find((res) => {
      if (Object.keys(res.flightDetails).length != 0) {
        this.flightsData.push(res.flightDetails);
      }
    });
    this.bookingDetails.returnPlan.map((res) => {
      if (Object.keys(res.flightDetails).length != 0) {
        this.flightsData.push(res.flightDetails);
      }
    });
    this.bookingDetails.dayPlanner.find((res) => {
      if (Object.keys(res.hotelDetails).length != 0) {
        this.hotelData.push(res.hotelDetails);
      }
    });
    this.bookingDetails.dayPlanner.map((res) => {
      if (res.activityDetails) {
        res.activityDetails.map((result) => {
          if (Object.keys(result).length != 0) {
            this.activityData.push(result);
          }
        });
      }
    });
    this.cancellationapiData.bookingReference = this.currentItineraryData.bookingReference;
    this.cancellationapiData.transactionId = this.paymentDetails.txid;
    this.cancellationapiData.id = this.currentItineraryData.id;
    let flightObject = this.flightsData.map((h) => {
      let Object = h;
      Object.isCancel = false;
      return Object;
    });
    this.flightsData = flightObject;
    let hotelObject = this.hotelData.map((h) => {
      let Object = h;
      Object.isCancel = false;
      return Object;
    });
    this.hotelData = hotelObject;
    let activityObject = this.activityData.map((h) => {
      let Object = h;
      Object.isCancel = false;
      return Object;
    });
    this.activityData = activityObject;
    console.log('flightsData', this.flightsData);
    console.log('hotelData', this.hotelData);
    console.log('activityData', this.activityData);
    this.getFlightscancelpolicy(this.flightsData);
    if (this.bookingDetails.cancelDetails) {
      this.flightsData.map((res, id) => {
        this.bookingDetails.cancelDetails.flightDetails.map((f) => {
          if (res.uuid == f.uuid) {
            this.flightsData.splice(id, 1);
          }
        });
      });
      this.hotelData.map((res) => {
        this.bookingDetails.cancelDetails.hotelDetails.map((h) => {
          if (res.uuid == h.uuid) {
            this.hotelData.splice(id, 1);
          }
        });
      });
      this.activityData.map((res) => {
        this.bookingDetails.cancelDetails.activityDetails.map((a) => {
          if (res.activityId == a.activityId) {
            this.activityData.splice(id, 1);
          }
        });
      });
    }
  }

  getFlightscancelpolicy(data) {
    this.flightpolicyresult = [];
    data.map((x) => {
      this.bookingService
        .getflightcancellationpolicy(x.fareSourceCode)
        .subscribe((res) => {
          this.flightpolicyresult.push(res);
          console.log('flightpolicyresult', res);
        });
    });
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

  getImage() {
    let activityImages = [];
    let activityImages2 = [];
    let hotelImgages = [];
    let allImages = [];
    for (let i = 0; i < this.previewItenaryDetails?.length; i++) {
      for (
        let j = 0;
        j <
        this.previewItenaryDetails[i]?.hotelDetails.hotelContent?.images
          ?.length;
        j++
      ) {
        allImages.push(
          this.previewItenaryDetails[i]?.hotelDetails.hotelContent?.images[j]
            .url
        );
        hotelImgages.push(
          this.previewItenaryDetails[i]?.hotelDetails.hotelContent?.images[j]
            .url
        );
      }
    }
    allImages = allImages.filter((value) => JSON.stringify(value) !== '{}');
    allImages = allImages.filter((value) => JSON.stringify(value) !== '[]');

    allImages = allImages.filter(function (x) {
      return x !== undefined || null;
    });

    hotelImgages = hotelImgages.filter(
      (value) => JSON.stringify(value) !== '{}'
    );
    hotelImgages = hotelImgages.filter(
      (value) => JSON.stringify(value) !== '[]'
    );

    hotelImgages = hotelImgages.filter(function (x) {
      return x !== undefined || null;
    });
    allImages = allImages.slice(0, 4);
    hotelImgages = hotelImgages
      .sort(() => Math.random() - Math.random())
      .slice(0, 4);
    hotelImgages = hotelImgages.slice(0, 2);
    for (let i = 0; i < this.previewItenaryDetails?.length; i++) {
      for (
        let j = 0;
        j < this.previewItenaryDetails[i].activityDetails?.length;
        j++
      ) {
        allImages.push(
          this.previewItenaryDetails[i]?.activityDetails[j]?.coverImageUrl
        );
        activityImages.push(
          this.previewItenaryDetails[i]?.activityDetails[j]?.coverImageUrl
        );
        activityImages2.push(
          this.previewItenaryDetails[i]?.activityDetails[j]?.coverImageUrl
        );
      }
    }
    allImages = allImages.filter((value) => JSON.stringify(value) !== '{}');
    allImages = allImages.filter((value) => JSON.stringify(value) !== '[]');

    allImages = allImages.filter(function (x) {
      return x !== undefined || null;
    });
    activityImages = activityImages.filter(
      (value) => JSON.stringify(value) !== '{}'
    );
    activityImages = activityImages.filter(
      (value) => JSON.stringify(value) !== '[]'
    );

    activityImages = activityImages.filter(function (x) {
      return x !== undefined || null;
    });
    this.randomActiveImage = allImages
      .sort(() => Math.random() - Math.random())
      .slice(0, 4);
    if (this.randomActiveImage[0]?.length > 0) {
      this.sideImg0 = this.randomActiveImage[0];
    } else {
      this.sideImg0 =
        'https://voyaah-package-images-dev.s3.ap-south-1.amazonaws.com/public/about/sea.png';
    }
    if (this.randomActiveImage[1]?.length > 0) {
      this.sideImg1 = this.randomActiveImage[1];
    } else {
      this.sideImg1 =
        'https://voyaah-package-images-dev.s3.ap-south-1.amazonaws.com/public/about/Traveler2.png';
    }
    if (this.randomActiveImage[2]?.length > 0) {
      this.sideImg2 = this.randomActiveImage[2];
    } else {
      this.sideImg2 =
        'https://voyaah-package-images-dev.s3.ap-south-1.amazonaws.com/public/about/huts.png';
    }
    if (this.randomActiveImage[3]?.length > 0) {
      this.sideImg3 = this.randomActiveImage[3];
    } else {
      this.sideImg3 =
        'https://voyaah-package-images-dev.s3.ap-south-1.amazonaws.com/public/about/mountain.png';
    }

    if (activityImages?.length > 0) {
      this.activityCoverImg = activityImages[0];
    } else {
      if (hotelImgages?.length > 0) {
        this.activityCoverImg = hotelImgages[0];
      } else {
        this.activityCoverImg =
          'https://voyaah-package-images-dev.s3.ap-south-1.amazonaws.com/public/about/AboutUsBanner.png';
      }
    }
    if (activityImages2?.length >= 2) {
      this.activityCoverImg2 = activityImages[1];
    } else {
      if (hotelImgages?.length > 0) {
        this.activityCoverImg2 = hotelImgages[1];
      } else {
        this.activityCoverImg2 =
          'https://voyaah-package-images-dev.s3.ap-south-1.amazonaws.com/public/about/previewIti16-9.png';
      }
    }
  }

  getUpcomingCountry() {
    let countryArray = [];
    for (let j = 0; j < this.previewItenaryDetails?.length; j++) {
      countryArray.push(this.previewItenaryDetails[j].countryName);
      const lowercased = countryArray?.map((name) => name.toLowerCase());
      let uniqueChars = lowercased?.filter(
        (c, index) => lowercased.indexOf(c) === index
      );
      return uniqueChars;
    }
  }

  goToMyBookings() {
    this.userProfileService.usercustomNavigate(true);
    this.router.navigate(['/myaccount/bookings']);
  }
  navigatetopolicies() {
    this.router.navigate(['policy']);
  }
  trimString(text, range) {
    return text.length > range ? text.substr(0, range - 1) + '...' : text;
  }

  closeModelflight() {
    this.modelbodyflight = false;
  }

  closeModelhotel() {
    this.modelbodyhotel = false;
  }

  closeModelactivity() {
    this.modelbodyactivity = false;
  }

  cancelFlights(f, i) {
    this.flightcancelpolicy = [];
    this.modelbodyflight = true;
    this.flightid = i;
    this.flightcancelpolicy = this.flightsData[i].flightPolicies;
  }

  acceptflightCanl(e) {
    let count = 0;

    if (e.target.checked == true) {
      this.flightsData[this.hotelid].isCancel = true;
    } else {
      this.flightsData[this.hotelid].isCancel = false;
    }

    this.flightsData.map((res) => {
      if (res.isCancel == true) {
        count = 1;
      }
    });
    this.hotelData.map((res) => {
      if (res.isCancel == true) {
        count = 1;
      }
    });
    this.activityData.map((res) => {
      if (res.isCancel == true) {
        count = 1;
      }
    });
    if (count == 1) {
      this.cancelbuttonstatus = true;
    } else {
      this.cancelbuttonstatus = false;
    }
  }

  cancelHotels(h, i) {
    this.hotelcancelpolicy = '';
    this.modelbodyhotel = true;
    this.hotelid = i;
    this.hotelcancelpolicy = this.hotelData[i].selectedRoom.cancellationPolicy;
  }
  accepthotelCanl(e) {
    console.log('well', e.target.checked);
    let count = 0;
    if (e.target.checked == true) {
      this.hotelData[this.hotelid].isCancel = true;
    } else {
      this.hotelData[this.hotelid].isCancel = false;
    }

    this.hotelData.map((res) => {
      if (res.isCancel === true) {
        count = 1;
      }
    });
    this.flightsData.map((res) => {
      if (res.isCancel == true) {
        count = 1;
      }
    });

    this.activityData.map((res) => {
      if (res.isCancel == true) {
        count = 1;
      }
    });
    if (count == 1) {
      this.cancelbuttonstatus = true;
    } else {
      this.cancelbuttonstatus = false;
    }
  }

  cancelActivities(a, i) {
    this.activitycancelpolicy = [];
    this.modelbodyactivity = true;
    this.acyivityid = i;
    this.activitycancelpolicy = this.activityData[i].refundPolicies;
  }
  acceptactivityCanl(e) {
    let count = 0;
    if (e.target.checked == true) {
      this.activityData[this.acyivityid].isCancel = true;
    } else {
      this.activityData[this.acyivityid].isCancel = false;
    }

    this.hotelData.map((res) => {
      if (res.isCancel === true) {
        count = 1;
      }
    });
    this.flightsData.map((res) => {
      if (res.isCancel == true) {
        count = 1;
      }
    });

    this.activityData.map((res) => {
      if (res.isCancel == true) {
        count = 1;
      }
    });
    if (count == 1) {
      this.cancelbuttonstatus = true;
    } else {
      this.cancelbuttonstatus = false;
    }
  }

  cancelall(e) {
    if (e.target.checked == true) {
      this.flightsData.map((x) => {
        x.isCancel = true;
      });
      this.hotelData.map((x) => {
        x.isCancel = true;
      });
      this.activityData.map((x) => {
        x.isCancel = true;
      });
      this.cancelbuttonstatus = true;
    } else {
      this.flightsData.map((x) => {
        x.isCancel = false;
      });
      this.hotelData.map((x) => {
        x.isCancel = false;
      });
      this.activityData.map((x) => {
        x.isCancel = false;
      });
      this.cancelbuttonstatus = false;
    }
  }

  cancellationprocess() {
    let count = 0;
    this.cancellationapiData.flightDetails = [];
    this.cancellationapiData.hotelDetails = [];
    this.cancellationapiData.activityDetails = [];
    this.flightsData.map((res) => {
      if (res.isCancel == true) {
        count = 1;
        let obj = {
          uuid: res.uuid,
          uniqueId: res.ticketRefNumber,
          cancelDetails: {},
          email: this.currentItineraryData.email,
          adultCount: this.bookingDetails.selectedTravellers.adults.length,
          childCount: this.bookingDetails.selectedTravellers.children.length,
          infantCount: this.bookingDetails.selectedTravellers.infants.length,
          airlineLogoURL:
            res.tripDetails.itineraryInfo.reservationItem[0].airlineInfo
              .logoURL,
          airlineName:
            res.tripDetails.itineraryInfo.reservationItem[0].airlineInfo.name,
          fromCity:
            res.tripDetails.itineraryInfo.reservationItem[0].airlineInfo
              .departureCity,
          toCity:
            res.tripDetails.itineraryInfo.reservationItem[
              res.tripDetails.itineraryInfo.reservationItem.length - 1
            ].airlineInfo.arrivalCity,
          fromCountry: '',
          toCountry: '',
          arrivalDate:
            res.tripDetails.itineraryInfo.reservationItem[
              res.tripDetails.itineraryInfo.reservationItem.length - 1
            ].arrivalDateTime,
          departureDate:
            res.tripDetails.itineraryInfo.reservationItem[0].departureDateTime,
        };
        this.cancellationapiData.flightDetails.push(obj);
        this.bookingDetails.dayPlanner.map((fres) => {
          if (fres.flightDetails) {
            if (fres.flightDetails.uuid == res.uuid) {
              fres.flightDetails = res;
            }
          }
        });
      }
    });
    this.hotelData.map((res) => {
      if (res.isCancel == true) {
        count = 1;
        let obj = {
          uuid: res.uuid,
          supplierConfirmationNum: res.bookingDetails.supplierConfirmationNum,
          referenceNum: res.bookingDetails.referenceNum,
          clientRefNum: res.bookingDetails.clientRefNum,
          cancelDetails: {},
          email: this.currentItineraryData.email,
          hotelName: res.hotelContent.name,
          hotelAddress: res.hotelContent.address,
          hotelImageUrl: res.hotelContent.images[0].url,
          roomType: res.selectedRoom.roomType,
          checkIn: res.bookingDetails.roomBookDetails.checkIn,
          checkOut: res.bookingDetails.roomBookDetails.checkOut,
          adultCount: this.bookingDetails.selectedTravellers.adults.length,
          childCount: this.bookingDetails.selectedTravellers.children.length,
          infantCount: this.bookingDetails.selectedTravellers.infants.length,
        };
        this.cancellationapiData.hotelDetails.push(obj);
        this.bookingDetails.dayPlanner.map((fres) => {
          if (fres.hotelDetails) {
            if (fres.hotelDetails.uuid == res.uuid) {
              fres.hotelDetails = res;
            }
          }
        });
      }
    });
    this.activityData.map((res) => {
      if (res.isCancel == true) {
        count = 1;
        let obj = {
          activityId: res.activityId,
          orderId: res.orderUUID,
          email: this.currentItineraryData.email,
          activityName: res.activityName,
          activityCity: res.activityCity,
          activityCountry: res.activityCountry,
          activityDate: res.activityDate,
          duration: res.duration,
          orderIdentifier: res.orderIdentifier,
          imageURL: res.coverImageUrl,
          products: [],
        };
        res.productsInfo.map((p) => {
          let productsobj = {
            itemUUID: '',
          };
          productsobj.itemUUID = p.itemUUID;
          obj.products.push(productsobj);
        });
        this.cancellationapiData.activityDetails.push(obj);
        this.bookingDetails.dayPlanner.map((fres) => {
          if (fres.activityDetails) {
            fres.activityDetails.map((ares) => {
              if (ares.activityId == res.activityId) {
                ares = res;
              }
            });
          }
        });
      }
    });

    if (count != 0) {
      this.modelbody = true;
    }
  }

  proceedapi() {
    this.cancellationapiData.email = this.currentItineraryData.email;
    console.log('well Info', this.cancellationapiData);
    this.bookingService
      .sendCustomCancellationData(this.cancellationapiData)
      .subscribe((res: any) => {
        this.modelbody = false;
        console.log('cancellation response : ', res);
        this.CheckForConfirmation(res);
        console.log(res);
      }),
      (err) => {
        console.log(err);
        // this.modelbody = true;
      };
  }
  CheckForConfirmation(res: any) {
    this.flightErrorMessage = '';
    this.hotelErrorMessage = '';
    this.activityErrorMessage = '';
    let isErrorExists = false;
    for (let i = 0; i < res?.flightDetails?.length; i++) {
      if (res.flightDetails[i].flightInfo?.cancelDetails?.success === false) {
        this.flightErrorMessage =
          res.flightDetails[i].flightInfo?.cancelDetails?.errorMessage;
        isErrorExists = true;
      } else {
        isErrorExists = false;
        this.flightErrorMessage = 'CANCELLED';
      }
    }
    for (let i = 0; i < res?.hotelDetails?.length; i++) {
      if (
        res.hotelDetails[i].hotelInfo?.cancelDetails?.status !== 'CANCELLED'
      ) {
        if (res.hotelDetails[i].hotelInfo?.cancelDetails?.status.error) {
          this.hotelErrorMessage =
            res.hotelDetails[i].hotelInfo?.cancelDetails?.status.error;
          isErrorExists = true;
        } else if (
          res.hotelDetails[i].hotelInfo?.cancelDetails?.status.errors
        ) {
          let msgArray =
            res.hotelDetails[i].hotelInfo?.cancelDetails?.status.errors;
          for (let i = 0; i < msgArray.length; i++) {
            this.hotelErrorMessage += msgArray[i].errorMessage + ', ';
          }
          this.hotelErrorMessage = this.hotelErrorMessage.substr(
            0,
            this.hotelErrorMessage.length - 2
          );
          isErrorExists = true;
        }
      } else {
        isErrorExists = false;
        this.hotelErrorMessage = 'CANCELLED';
      }
    }
    for (let i = 0; i < res?.activityDetails?.length; i++) {
      if (res.flightDetails[i].flightInfo?.cancelDetails?.success === false) {
        this.flightErrorMessage =
          res.flightDetails[i].flightInfo?.cancelDetails?.errorMessage;
        isErrorExists = true;
      }
    }
    if (!isErrorExists) {
      this.goToMyBookings();
    }
  }

  closeModel() {
    this.modelbody = false;
  }

  cancelPolicies() {
    this.cancelPoliciesstatus = true;
  }

  closecancelPolicies() {
    this.cancelPoliciesstatus = false;
  }
}
