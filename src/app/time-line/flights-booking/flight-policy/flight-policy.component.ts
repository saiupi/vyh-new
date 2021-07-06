import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { DestinationsApisService } from '@app/time-line/destinations-apis.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-flight-policy',
  templateUrl: './flight-policy.component.html',
  styleUrls: ['./flight-policy.component.scss'],
})
export class FlightPolicyComponent implements OnInit {
  @Input() flightFareSourceCode: string;
  loader = true;
  policyApiResponse;
  constructor(
    public modalController: ModalController,
    private destinationsApisService: DestinationsApisService
  ) {}

  ngOnInit() {
    console.log(this.flightFareSourceCode);
    this.getFlightPolciies();
  }
  getFlightPolciies() {
    this.destinationsApisService
      .getflightcancellationpolicy(this.flightFareSourceCode)
      .subscribe(
        (res) => {
          this.loader = false;
          this.policyApiResponse = res;
          console.log('flight polocies', res);
        },
        (error) => {
          this.loader = false;
          console.log(error);
        }
      );
  }
  dismiss() {
    this.modalController.dismiss();
  }
}
