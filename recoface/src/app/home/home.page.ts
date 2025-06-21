import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import {
  IonToolbar,
  IonHeader,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSegment,
    IonSegmentButton,
    RouterOutlet
  ],
})
export class HomePage {
  selectedTab = 'registro';

  constructor(public router: Router) {
    // Sincroniza el segmento activo con la URL actual
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        if (event.url.includes('/home/registro')) {
          this.selectedTab = 'registro';
        } else if (event.url.includes('/home/lista')) {
          this.selectedTab = 'lista';
        } else if (event.url.includes('/home/validacion')) {
          this.selectedTab = 'validacion';
        }
      });
  }

  onSegmentChange(event: CustomEvent) {
    const value = event.detail.value;
    this.selectedTab = value;
    this.router.navigate(['/home', value]);
  }
}
