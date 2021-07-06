import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-timeline-popup',
  templateUrl: './timeline-popup.component.html',
  styleUrls: ['./timeline-popup.component.scss'],
})
export class TimelinePopupComponent implements OnInit {
  @Input() errorMessageFlag: boolean;
  constructor(public modalController: ModalController) {}

  ngOnInit() {}
  dismiss() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}
