// import { Component } from '@angular/core';
// import { StorageService } from './storage-service.service';

// @Component({
//   selector: 'app-root',
//   templateUrl: 'app.component.html',
//   styleUrls: ['app.component.scss'],
// })
// export class AppComponent {
//   constructor(private storageService: StorageService){}

//   ngOnInit() {
//     const loggedIn = this.storageService.isLoggedIn();
//     if(window.location.pathname != "/auth" && !loggedIn) window.location.href = "/auth";
//   }
// }


import { Component } from '@angular/core';
import { StorageService } from './storage-service.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  lastEvent = new Date();

  // Expires after 10secs
  expireTime = 10;

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    const loggedIn = this.storageService.isLoggedIn();
    if (window.location.pathname != '/auth' && !loggedIn)
      window.location.href = '/auth';

    document.body.addEventListener('mousemove', (event) => {
      this.lastEvent = new Date();
    });

    setInterval(() => {
      const now = new Date();
      if (Number(now) - Number(this.lastEvent) > this.expireTime * 30000) {
        if (window.location.pathname !== '/auth') {
          this.storageService.clean();
          window.location.href = '/auth';
        }
      }
    }, 1000);
  }
}
