import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {


  questionType: any = "";
  devUrl: any = "https://feedbkserver.herokuapp.com";
  // devUrl: any = "http://localhost:8080";


  constructor(private http: HttpClient) { }

  getLocalData(url) {
    return this.http.get("assets/json/" + url + ".json");
  }

  postInputs(serviceAPI, params): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.token });
    let url = this.devUrl + serviceAPI;
    return this.http.post(url, params, { headers: headers })
  }

  loginInputs(serviceAPI, params): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let url = this.devUrl + serviceAPI;
    return this.http.post(url, params, { headers: headers })
  }

  feedbackPost(serviceAPI, params): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    let url = this.devUrl + serviceAPI;
    return this.http.post(url, params, { headers: headers })
  }

  getInputs(serviceAPI): Observable<any> {
    let headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': localStorage.token });
    let url = this.devUrl + serviceAPI;
    return this.http.get(url, { headers: headers });
  }




}
