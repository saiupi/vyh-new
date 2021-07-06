import { Analytics } from 'aws-amplify';
import {
  Router,
  Event,
  NavigationStart,
  NavigationEnd,
  NavigationError,
} from '@angular/router';
import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router
  ) {
    this.initializeApp();
    this.routeChangeMethod();
  }
  routeChangeMethod() {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        let enteredtime: any = new Date();
        let prevPage = 'Home';
        let duration = 0;
        let currentpagename = '';
        if (event.url === '/') {
          currentpagename = 'Home';
        } else {
          currentpagename = event.url.replace('/', '');
        }
        //to check whether user already visited any page before coming to current page
        if (localStorage.getItem('enteredpage')) {
          prevPage = localStorage.getItem('enteredpage');
        }
        localStorage.setItem('enteredpage', currentpagename);
        if (localStorage.getItem('enteredtime')) {
          duration =
            Math.abs(
              enteredtime - Date.parse(localStorage.getItem('enteredtime'))
            ) / 36e5;
          // console.log(duration * 60);
        } else {
          localStorage.setItem('enteredtime', enteredtime.toString());
        }
        //console.log('end event:', JSON.stringify(event));
        let user = 'Guest';
        if (localStorage.getItem('user')) {
          user = JSON.parse(localStorage.getItem('user')).username.toString();
        }
        if (duration != 0 && prevPage !== currentpagename) {
          let objAttributes = {};
          let navigationflow = prevPage + ' - ' + currentpagename;
          objAttributes[navigationflow] =
            duration.toFixed(2).toString() + ' minutes spent on ' + prevPage;
          // objAttributes['duration'] =
          //   duration.toFixed(2).toString() + ' minutes on ' + prevPage;
          Analytics.record({
            name: user,
            // attributes: {
            //   navigationflow: prevPage + ' - ' + currentpagename,
            //   duration:
            //     duration.toFixed(2).toString() + ' minutes on ' + prevPage,
            // },
            attributes: objAttributes,
          });
        }
      }
    });
  }
  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
