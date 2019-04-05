import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  private loaderSubject = new Subject<any>();
  private showUserSubject = new Subject<any>();

  loaderState = this.loaderSubject.asObservable();
  displayState = this.showUserSubject.asObservable();

  constructor() { }

  show() {
    this.loaderSubject.next(<any>{ show: true });
  }

  display() {
    this.showUserSubject.next(<any>{ show: true });
  }

  hide() {
    this.loaderSubject.next(<any>{ show: false });
  }

}