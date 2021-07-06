import { json } from 'express';
import { Component, OnInit } from '@angular/core';
import { DestinationsApisService } from '../destinations-apis.service';
@Component({
  selector: 'app-select-activities-preference',
  templateUrl: './select-activities-preference.component.html',
  styleUrls: ['./select-activities-preference.component.scss'],
})
export class SelectActivitiesPreferenceComponent implements OnInit {
  activitiesPreferences: any;
  selectedActivities: any[] = [];
  activityarray_data = [];
  activityPreferncesMapping = [
    {
      name: 'Adventure',
      musementType: [],
      categoryName: ['Snorkeling', 'Aerial tramway tours'],
      categoryCode: ['snorkeling', 'aerial-tramway-tours'],
      coverImageUrl: '../../assets/activityPreference/Group 134392.svg',
      verticalType: ['Active & adventure'],
    },
    {
      name: 'History & Culture',
      musementType: [],
      categoryName: [
        'Castle & palace Tours',
        'Museums',
        'Walking tours',
        'Food  & winery tours',
        'Walking and bike tours',
        'National park tours',
        'Day trips & excursions',
        'City passes',
        'Transportation',
        'Attractions & monuments',
        'City tours',
      ],
      categoryCode: [
        'castle-palace-tours',
        'museums',
        'walking-tours',
        'food-winery-tours',
        'Walking-and-bike-tours',
        'national-park-tours',
        'day-trips-excursions',
        'city-passes',
        'transportation',
        'attractions-and-monuments',
        'city-tours',
      ],
      coverImageUrl: '../../assets/activityPreference/Group 134393.svg',
      verticalType: ['Tours and Attractions'],
    },
    {
      name: 'Glamping',
      musementType: [],
      categoryName: ['Snorkeling', 'Aerial tramway tours'],
      categoryCode: ['snorkeling', 'aerial-tramway-tours'],
      coverImageUrl: '../../assets/activityPreference/Group 134394.svg',
      verticalType: ['Active & adventure'],
    },
    {
      name: 'Culinary',
      musementType: [],
      categoryName: ['Food  & winery tours'],
      categoryCode: ['food-winery-tours'],
      coverImageUrl: '../../assets/activityPreference/Group 134397.svg',
      verticalType: ['Food & wine'],
    },
    {
      name: 'Romance',
      musementType: [],
      categoryName: ['Nightclubs', 'Ballet'],
      categoryCode: ['nightclubs', 'ballet'],
      coverImageUrl: '../../assets/activityPreference/Group 134396.svg',
      verticalType: ['Nightlife'],
    },
    {
      name: 'Kids Activities',
      musementType: [],
      categoryName: ['Ballet', 'Walking tours', 'Bike Tours'],
      categoryCode: ['ballet', 'walking-tours', 'bike-tours'],
      coverImageUrl: '../../assets/activityPreference/Group 134395.svg',
      verticalType: [],
    },
    {
      name: 'Wildlife',
      musementType: [],
      categoryName: ['Snorkeling', 'Aerial tramway tours'],
      categoryCode: ['snorkeling', 'aerial-tramway-tours'],
      coverImageUrl: '../../assets/activityPreference/Group 56053.svg',
      verticalType: ['Active & adventure'],
    },
    {
      name: 'Wellness',
      musementType: [],
      categoryName: [],
      categoryCode: ['walking-tours', 'bike-tours', 'snorkeling'],
      coverImageUrl: '../../assets/activityPreference/Group 134398.svg',
      verticalType: [],
    },
  ];

  activityPreferenceObject = [];
  clearstatus: boolean;

  constructor(private destinationsApisService: DestinationsApisService) {}

  ngOnInit() {
    this.activitiesPreferences = [];
    this.activityarray_data = this.activityPreferncesMapping;
    let new_activity_Data = this.activityarray_data.map((h) => {
      let activityObject = h;
      activityObject.selecttrack = false;
      return activityObject;
    });
    this.activitiesPreferences = new_activity_Data;
    let data = JSON.parse(sessionStorage.getItem('activityPreference'));
    if (data != null) {
      this.clearstatus = true;
      this.activitiesPreferences.map((h) => {
        data.map((x) => {
          if (x.name == h.name) {
            h.selecttrack = true;
          }
        });
      });
    }
  }

  selectActivity(e, i, t) {
    this.activitiesPreferences[i].selecttrack = !this.activitiesPreferences[i]
      .selecttrack;
    let count = 0;
    this.activitiesPreferences.map((element) => {
      if (element.selecttrack == true) {
        count = 1;
      }
    });
    if (count == 1) {
      this.clearstatus = true;
    } else {
      this.clearstatus = false;
    }
    if (!t) {
      if (this.selectedActivities.length === 0) {
        this.selectedActivities.push(e);
      } else {
        let searchavail = this.selectedActivities.filter((x) => x == e);
        if (searchavail.length == 0) {
          this.selectedActivities.push(e);
        }
      }
    } else {
      let filterd_name_activity;
      let searchavail = this.selectedActivities.filter((x) => {
        if (x === e) {
          filterd_name_activity = e;
        }
      });
      if (searchavail.length == 0) {
        let index_value = this.selectedActivities.indexOf(
          filterd_name_activity
        );
        this.selectedActivities.splice(index_value, 1);
      }
    }
  }
  act_back() {
    this.destinationsApisService.getBooleanToShowActivityPreferense(true);
    this.destinationsApisService.changeViewStatus('Activities');
  }

  clearpreferences() {
    this.activitiesPreferences.map((x) => {
      x.selecttrack = false;
    });
    sessionStorage.removeItem('activityPreference');
    this.destinationsApisService.getBooleanToShowActivityPreferense(true);
    this.destinationsApisService.changeViewStatus('Activities');
    this.clearstatus = false;
  }

  SaveSelectedActivity() {
    let data = JSON.parse(sessionStorage.getItem('activityPreference'));
    if (data != null) {
      this.activitiesPreferences.map((x) => {
        if (x.selecttrack == true) {
          this.selectedActivities.push(x.name);
        }
      });
    }
    this.activityPreferenceObject = [];
    for (let j = 0; j < this.activityPreferncesMapping.length; j++) {
      for (let i = 0; i < this.selectedActivities.length; i++) {
        if (
          this.activityPreferncesMapping[j].name === this.selectedActivities[i]
        ) {
          let addActivityPreferenceObject = {
            categoryCode: this.activityPreferncesMapping[j].categoryCode,
            name: this.activityPreferncesMapping[j].name,
          };
          this.activityPreferenceObject.push(addActivityPreferenceObject);
        }
      }
    }
    this.destinationsApisService.getBooleanToShowActivityPreferense(true);
    this.destinationsApisService.getSelectedactivity(
      this.activityPreferenceObject
    );
    this.destinationsApisService.changeViewStatus('Activities');
    sessionStorage.setItem(
      'activityPreference',
      JSON.stringify(this.activityPreferenceObject)
    );
  }
}
