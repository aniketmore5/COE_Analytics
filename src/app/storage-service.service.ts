// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class StorageServiceService {

//   constructor() { }
// }

import { Injectable } from '@angular/core';

const STORE_KEY = "loggedIn";

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor() {}

  public clean(): void {
    window.sessionStorage.clear();
  }

  public store(): void {
    window.sessionStorage.setItem(STORE_KEY, "true");
  }

  public isLoggedIn(): boolean {
    return window.sessionStorage.getItem(STORE_KEY) === "true";
  }
}