import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({  providedIn: 'root' })
export class ApiRequestService {
  baseUrl= 'https://node-hnapi.herokuapp.com/';
  constructor(private httpClient: HttpClient) { }

  getNewsPage(): Observable<any>{
    return this.httpClient.get<any>(`${this.baseUrl}news?page=1`);
  }

  getNewsById(id: string): Observable<any>{
    return this.httpClient.get<any>(`${this.baseUrl}item/${id}`);
  }


}
