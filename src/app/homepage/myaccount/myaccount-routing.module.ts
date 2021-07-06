import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddtravellersComponent } from './addtravellers/addtravellers.component';
import { BookingsComponent } from './bookings/bookings.component';

import { MyaccountPage } from './myaccount.page';
import { ProfileComponent } from './profile/profile.component';
import { StaycationBookingsComponent } from './staycation-bookings/staycation-bookings.component';

const routes: Routes = [
  {
    path: '',
    component: MyaccountPage,
    children: [
      { path: 'profile', component: ProfileComponent },
      { path: 'addtravellers', component: AddtravellersComponent },
      { path: 'bookings', component: BookingsComponent },
      { path: 'staycation-bookings', component: StaycationBookingsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyaccountPageRoutingModule {}
