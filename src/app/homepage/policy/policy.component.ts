import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';
@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss'],
})
export class PolicyComponent implements OnInit {

  constructor(private _location: Location) { }

  ngOnInit() {}
  Navigatehomepage()
  {
    this._location.back();
  }

}
