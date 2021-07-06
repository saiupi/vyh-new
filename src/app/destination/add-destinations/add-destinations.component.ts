import { UserItineraryService } from './../../service-module/user-itinerary.service';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DestinationsApiService } from '../destinations-api.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Router, ActivatedRoute } from '@angular/router';
import { City } from '@ojashub/voyaah-common';
import { CitiesListService } from './../../service-module/cities-list.service';
import { StaycationPackagesService } from '@app/service-module/staycation-packages.service';
import { DestinationsApisService } from '@app/time-line/destinations-apis.service';

@Component({
  selector: 'app-add-destinations',
  templateUrl: './add-destinations.component.html',
  styleUrls: ['./add-destinations.component.scss'],
})
export class AddDestinationsComponent implements OnInit {
  apiData = [];
  locationName: any;
  locationData: any;
  citiesdata = [];
  dataobject: any;
  fromandtodata: any = [];
  isShowDiv = true;
  lat = 24.799448;
  lng = 120.979021;
  zoom = 14;
  count = 0;
  fulldestinationname;
  fromcity;
  dragflag = false;
  screenWidth: number;
  hideOptions = true;
  dir = undefined;
  additionalvalue: any;
  searchedterm;
  dataContainer: any[] = [];
  listLatCityCount: any[] = [];
  // madhu code
  originCity: City;
  destinationCities: City[];
  citysearchTerm: FormControl = new FormControl();
  showcitydata = false;
  filteritems = [];
  checkRegion = true;
  routedFrom = '';
  constructor(
    private ser: DestinationsApiService,
    private destinationsApisService: DestinationsApisService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private userItineraryService: UserItineraryService,
    private staycationService :StaycationPackagesService,
    private citiesListService: CitiesListService
  ) {
    window.addEventListener('resize', this.callme);
  }

  ngOnInit(): void {
    // madhu code
    const userItineraryData = this.userItineraryService.userItineraryData();
    console.log('saved data', userItineraryData);
    this.originCity = userItineraryData.originCity;
    this.destinationCities = userItineraryData.destinationCities;
    this.subscribeToCityChanges();
    // madhu code end
    this.getDirection();
    this.activatedRoute.params.subscribe((res) => {
      this.additionalvalue = res.setvalue;
      sessionStorage.setItem(
        'saveDestinations',
        JSON.stringify(this.locationData)
      );
    });
    this.citiesdata?.forEach((x) => {
      if (x.latitude) {
        this.dataContainer.push(x);
        this.count = this.count + 1;
      }
    });

    this.dataContainer?.forEach((y) => {
      if (y.countryName == 'Italy') {
        if (y) this.listLatCityCount.push(y);
      }
    });
    this.userItineraryService.toDestinationFrom.subscribe((res) => {
      this.routedFrom = res;
    });
  }
  searchCity(cityname: any) {
    return this.listLatCityCount.some((x) => {
      return x.cityName === cityname;
    });
  }
  selectedDestination(): void {
    setTimeout(() => {
      this.dragflag = false;
    }, 390);
  }

  drop(event: CdkDragDrop<string[]>): void {
    this.dragflag = false;
    moveItemInArray(
      this.destinationCities,
      event.previousIndex,
      event.currentIndex
    );
    this.ser.changeDestinationData(this.destinationCities);
    this.userItineraryService.addDestinations(this.destinationCities);
    this.userItineraryService.getBooleanValue("home");
  }

  callme(): void {
    this.screenWidth = document.documentElement.clientWidth;
  }
  public getDirection(): void {
    this.dir = {
      origin: { lat: 24.799448, lng: 120.979021 },
      destination: { lat: 24.799524, lng: 120.975017 },
    };
  }

  subscribeToCityChanges(): void {
    this.citysearchTerm.valueChanges.subscribe((partialName: string) => {
      if (partialName === undefined || partialName === '') {
        this.showcitydata = false;
        return;
      }
      console.log(partialName);
      if (partialName.length > 0) this.checkRegion = false;

      this.showcitydata = true;
      // this.filteritems = this.citiesListService.filterCitiesByPartialName(
      //   partialName
      // );
      this.citiesListService.getNewCities(partialName).subscribe(res=>{
     this.filteritems=res
        this.filteritems?.filter((filterData: any, id) => {
          if (
            this.originCity?.cityName === filterData?.cityName &&
            this.originCity?.countryName === filterData?.countryName
          ) {
            this.filteritems.splice(id, 1);
          }
        });
        for (let i = 0; i < this.filteritems.length; i++) {
          for (let j = 0; j < this.destinationCities.length; j++) {
            if (
              this.destinationCities[j]?.cityName ===
                this.filteritems[i]?.cityName &&
              this.destinationCities[j]?.countryName ===
                this.filteritems[i]?.countryName
            ) {
              this.filteritems.splice(i, 1);
            }
          }
        }
        this.filteritems=this.filteritems.splice(0,5)
      })
      console.log(this.filteritems, this.showcitydata);
    });
  }

  location(): void {
    this.apiData.slice(0, this.locationData.length).forEach((x) => {
      if (this.locationName !== '') {
        this.locationName = x.name;
      }
    });
  }

  // madhu code
  onsavelocattion(place: any) {
    this.isShowDiv = true;
    const selectedDestinationCity = place;
    this.filteritems = [];
    this.userItineraryService.appendDestination(selectedDestinationCity);
    this.userItineraryService.getBooleanValue("home");
    this.citysearchTerm.setValue('');
  }
  // madhu code
  saveDestinations() {
    if (this.routedFrom == 'home') {
      this.route.navigateByUrl('home/confirmDesitinations');
    } else {
      this.destinationsApisService.changeViewStatus('');
      this.route.navigateByUrl('/time-line');
    }
  }
  // madhu code end

  toggleDisplayDiv(): void {
    this.isShowDiv = !this.isShowDiv;
  }

  active(): void {
    setTimeout(() => {
      this.dragflag = true;
    }, 400);
  }
  mseup(): void {
    this.dragflag = false;
  }

  deletedestination(id) {
    this.destinationCities.splice(id, 1);
    this.userItineraryService.addDestinations(this.destinationCities);
    this.userItineraryService.getBooleanValue("home");
  }
  act_back() {
    this.route.navigateByUrl('/');
  }
}
