import { from } from 'rxjs';
import { ConfirmPasswordComponent } from './../account/components/confirm-password/confirm-password.component';
import { EnterEmailComponent } from '@app/account/components/enteremail.component';
import { AccountService } from '@app/account/services';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterComponent, ConfirmComponent } from '@app/account/components';
import { MenuController, ModalController } from '@ionic/angular';
import { LoginComponent } from '.././account/components/login.component';
import { ForgotOtpConfirmComponent } from '@app/account/components/forgototpconfirm/forgototpconfirm.component';
import { UserProfileService } from '@app/service-module/user-profile.service';
import { HttpClient } from '@angular/common/http';
import { UserProfileDetails } from '@ojashub/voyaah-common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StaycationPackagesService } from '@app/service-module/staycation-packages.service';
import { ViewChild, ElementRef } from '@angular/core';
import { UserItineraryService } from '@app/service-module/user-itinerary.service';
import { environment } from '@environments/environment';

declare var $;
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.page.html',
  styleUrls: ['./homepage.page.scss'],
})
export class HomepagePage implements OnInit {
  [x: string]: any;
  @ViewChild('closeAddExpenseModal') private closeAddExpenseModal: ElementRef;
  navs;
  otpconfirmed: any;
  loginModelStatus = true;
  isLoggedIn = false;
  userName = '';
  userNamePrint: any;
  infoMessage = '';
  logInresponce: any;
  userPresent: any;
  Sociallogin: any;
  googleLogin: any;
  googleCheck: any;
  enteredUserDetails: any;
  googleSignup: any;

  iconName: string;
  userNameShow: string;
  userDetails: UserProfileDetails;
  userNavigate: boolean;
  nameChange = true;
  partnerForm: FormGroup;
  submitted = false;
  partnetName = false;
  partnerNameResp: any;
  partnerView = false;
  invalidPartner = false;
  noPackage = false;
  PartnerShow = true;
  partnerNameCode: any;
  production = false;
  partnerBookings = false;
  constructor(
    private route: Router,
    private router: ActivatedRoute,
    private homemenu: MenuController,
    public modalController: ModalController,
    private accountService: AccountService,
    private cdRef: ChangeDetectorRef,
    private useriternaryservice: UserItineraryService,
    private userProfileService: UserProfileService,
    private formBuilder: FormBuilder,
    private staycationService: StaycationPackagesService
  ) {
    this.production = environment.production;
    this.reloadUser();

    this.staycationService.currentpartnerClose.subscribe((status) => {
      const partnerNameSet = JSON.parse(localStorage.getItem('partnerName'));
      if (partnerNameSet?.length === 0) {
        this.partnerNameResp = null;
        this.partnerView = false;
        this.PartnerShow = true;
        this.partnerBookings = false;
      }
    });
    this.staycationService.currentpartnerAdd.subscribe((status) => {
      const partnerNameSet = JSON.parse(localStorage.getItem('partnerName'));
      if (partnerNameSet?.length > 0) {
        this.partnerBookings = true;
        this.getPartnerDetailsRep();
      }
    });
    // this.router.params.subscribe((params) => {
    //   if (params.vendor?.length > 0) {
    //     localStorage.removeItem('partnerName');
    //     this.partnerView = false;
    //     this.PartnerShow = true;
    //     this.staycationService.clearPartnerData();
    //   }
    // });
  }

  ngOnInit() {
    let userName = JSON.parse(localStorage.getItem('user'));
    if (userName?.length === 0) {
      this.isLoggedIn = false;
      this.loginModelStatus = true;
    }

    this.partnerForm = this.formBuilder.group({
      PartnerName: ['', [Validators.required, Validators.minLength(2)]],
    });
    //console.log(this.partnerForm.value.PartnerName, '0');
    this.userDetails = this.userProfileService.getUserDetails();
    this.UserName();
    this.userProfileService.currentUserProfileData.subscribe((res) => {
      this.userDetails = this.userProfileService.getUserDetails();
      this.UserName();
    });

    this.userProfileService.currentUserNavigate.subscribe((res) => {
      //  console.log(res, 'rsep');
      this.userNavigate = res;
      if (this.userNavigate === false) {
        this.nameChange = true;
      }
    });
    window.onclick = (e) => {
      if (e.target) {
        this.invalidPartner = false;
        this.noPackage = false;
        this.submitted = false;
      }
    };

    this.enteredUserDetails = this.accountService.getCognitoUser();
    //console.log(this.enteredUserDetails, 'enteredUserDetails');
    this.accountService.currentLoginEvent.subscribe((x) => {
      switch (x.name) {
        case 'close':
        case 'dismiss':
          this.modalController.dismiss();
          break;
        case 'register':
          this.modalController.dismiss();
          this.presentSignup();

          break;
        case 'login':
          this.modalController.dismiss();
          this.presentLogin();
          break;
        case 'Otp_enter':
          this.modalController.dismiss();
          this.otpEnter();
          break;
        case 'forgot':
          this.modalController.dismiss();
          this.presentForgotPassword();
          break;
        case 'forgotOtp':
          this.modalController.dismiss();
          this.presentForgotOtp((x.data as any).username);
          break;
        case 'forgotConfirmPassword':
          this.modalController.dismiss();
          const data = x.data as any;
          this.presentForgotPasswordConfirm(data.username, data.otp);
          break;
      }
      this.reloadUser();
    });

    this.accountService.user.subscribe((user) => {
      this.reloadUser();
    });
    this.reloadUser();

    //   this.userProfileService.currentUserLogin.subscribe((res) => {
    //  console.log(res)

    this.accountService.isLoggedIn().then((loggedIn) => {
      this.isLoggedIn = loggedIn;
      if (this.isLoggedIn === false) {
        this.loginModelStatus = true;
      }
    });
  }
  closeErrors() {
    this.invalidPartner = false;
    this.noPackage = false;
    this.submitted = false;
    this.partnerForm.controls.PartnerName.setValue('');
  }

  get f() {
    return this.partnerForm.controls;
  }
  // loginSignupTabs() {
  //   this.loginModelStatus = false;
  //   if (this.loginModelStatus === false) {
  //     this.userProfileService.userccNavigate(true);
  //   }
  // }
  UserName() {
    this.userName = this.userDetails.firstName;
    if (this.userName.length > 0) {
      let nameOfUser = this.userName;
      nameOfUser = nameOfUser.substring(1);
      this.nameChange = false;
      this.iconName =
        this.userName[0].toUpperCase() + this.userName[1].toLowerCase();
      this.userNameShow =
        this.userName[0].toUpperCase() + nameOfUser.toLowerCase();
    }
  }

  openhomemenu() {
    this.homemenu.enable(true, 'hm_menu');
    this.homemenu.open('hm_menu');
  }
  onStaycation() {
    // this.Router.navigate(['/staycation/'])
    //console.log('OnSATACTOI');
    this.staycationService.hitStaycation(true);
  }
  menu_click() {
    this.homemenu.close('hm_menu');
  }
  routechange() {
    this.route.navigateByUrl('/destination');
  }
  gotoaccount() {
    this.userProfileService.navigateToTravellers.next('dropdown');
    this.route.navigate(['/myaccount/profile']);
  }
  async presentLogin() {
    const modal = await this.modalController.create({
      component: LoginComponent,
      cssClass: 'login-modal-css',
      // cssClass: 'loginPage',
      componentProps: { value: 123 },
      backdropDismiss: true,
      // presentingElement: await this.modalCtrl.getTop()
    });
    return await modal.present();
  }
  async presentSignup() {
    const modal = await this.modalController.create({
      component: RegisterComponent,
      cssClass: 'signup-modal-css',
      backdropDismiss: true,
      // cssClass: 'loginPage',
      componentProps: { value: 123 },
    });

    return await modal.present();
  }
  async otpEnter() {
    const modal = await this.modalController.create({
      component: ConfirmComponent,
      cssClass: 'signup-modal-css',
      // cssClass: 'loginPage',
      componentProps: { value: 123 },
      backdropDismiss: false,
      // presentingElement: await this.modalCtrl.getTop()
    });
    return await modal.present();
  }
  async presentForgotOtp(username: string) {
    const modal = await this.modalController.create({
      component: ForgotOtpConfirmComponent,
      cssClass: 'forgotOtp-modal-css',
      componentProps: { username },
      backdropDismiss: false,
    });

    return await modal.present();
  }

  async presentForgotPassword() {
    const modal = await this.modalController.create({
      component: EnterEmailComponent,
      cssClass: 'enteremail-modal-css',
    });
    return await modal.present();
  }

  async presentForgotPasswordConfirm(username: string, otp: string) {
    const modal = await this.modalController.create({
      component: ConfirmPasswordComponent,
      cssClass: 'forgotConfirm-modal-css',
      componentProps: { username, otp },
      backdropDismiss: false,
    });
    return await modal.present();
  }

  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
  async onSubmit() {
    this.submitted = true;
    try {
      if (this.partnerForm.invalid) {
        return;
      }
      await this.staycationService
        .getPartnerData(this.partnerForm.value.PartnerName)
        .then((res) => {
          // console.log(res, 'data');
          if (res === 'Invalid Vendor' || res === undefined) {
            this.invalidPartner = true;
          } else {
            localStorage.setItem(
              'partnerName',
              JSON.stringify(this.partnerForm.value.PartnerName)
            );
            this.getPartnerDetailsRep();
            this.route.navigateByUrl('/staycation');
            localStorage.removeItem('user');
            this.staycationService.partnerSet(true);
            this.userProfileService.userccNavigate(false);
            this.loginModelStatus = true;
            this.isLoggedIn = false;

            this.invalidPartner = false;
            this.noPackage = false;
            this.submitted = false;
            this.partnerForm.controls.PartnerName.setValue('');
          }
        });
    } catch (err) {
      console.log('Partner error submit', err);
    }
  }
  async getPartnerDetailsRep() {
    try {
      this.partnerNameCode = JSON.parse(localStorage.getItem('partnerName'));
      if (this.partnerNameCode?.length > 0) {
        this.partnerView = true;
        this.PartnerShow = false;
        console.log(this.closeAddExpenseModal, 'closeAddExpenseModal');
        $('#exampleModalCenter').modal('hide');
        // this.closeAddExpenseModal.nativeElement.click();
      }
      if (this.partnerNameCode?.length > 0) {
        await this.staycationService
          .getPartnerData(this.partnerNameCode)
          .then((res) => {
            // console.log(res, 'data');
            this.partnerNameResp = res;
          });
      }
    } catch (err) {
      console.log(err);
    }
  }
  clearPartner() {
    this.partnerBookings = false;
    localStorage.removeItem('user');
    localStorage.removeItem('vendorName');
    localStorage.removeItem('partnerName');
    this.staycationService.bookPartner(true);
    this.staycationService.partnerClear(true);
    this.userProfileService.userccNavigate(false);
    this.isLoggedIn = false;
    this.loginModelStatus = true;
    this.partnerView = false;
    this.PartnerShow = true;
    this.partnerNameResp = null;
    this.submitted = false;
    this.partnerForm.reset();

    this.staycationService.clearPartnerData();
  }

  reloadUser() {
    let userDetail = JSON.parse(localStorage.getItem('user'));

    // console.log(this.otpconfirmed);
    this.userPresent = userDetail;
    // console.log(this.userPresent, this.googleCheck);
    if (this.userPresent === null) {
      this.isLoggedIn = false;
      this.loginModelStatus = true;
    }
    this.otpconfirmed = localStorage.getItem('otpconfirmed');
    this.googleSignup = localStorage.getItem(
      'amplify-redirected-from-hosted-ui'
    );
    //console.log(this.otpconfirmed, this.googleSignup, 'otpconfirmed');
    if (
      (this.userPresent !== null && this.otpconfirmed == 'yes') ||
      (this.userPresent !== null && this.googleSignup == 'true')
    ) {
      this.userProfileService.userccNavigate(true);
      let xname = this.userPresent?.username.split('@');
      // console.log(this.userPresent, 'userPresent');
      this.infoMessage = xname[0];
      if (this.infoMessage?.length > 0) {
        this.loginModelStatus = false;
      }
    }
    if (
      this.userPresent !== undefined &&
      this.userPresent?.username === 'true'
    ) {
      // console.log(this.userPresent, 'user');
      let x = this.userPresent?.username.split('@');
      this.infoMessage = x[0];
    }

    try {
      this.cdRef.detectChanges();
    } catch (e) {}
  }
  userhomeNavigate() {
    this.route.navigate(['/']);
  }

  clearUser() {
    this.loginModelStatus = true;
    this.isLoggedIn = false;
    this.menu_click();
    localStorage.removeItem('user');
    localStorage.removeItem('itinerary-storage');
    sessionStorage.removeItem('timeline-Data');
    localStorage.removeItem('otpconfirmed');

    this.useriternaryservice.copy();
    this.useriternaryservice.removeData('delete');
    this.reloadUser();

    this.userProfileService.userccNavigate(false);
    this.userProfileService.userccNavigatehome(true);
    this.accountService.logout();
    this.userProfileService.clearOnLogout();
    this.userhomeNavigate();
  }
}
