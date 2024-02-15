import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@environment';
import {GenericCreate, GenericUpdate} from '@shared/models';
import {Observable} from 'rxjs';

import {Driver} from '../00 model';
import {CreateDriverInput, UpdateDriverInput} from '../00 model/';

const ENDPOINT_NAME = 'drivers/';

@Injectable({
  providedIn: 'root',
})
export class DriverCall {
  private readonly _baseUrl: string = environment.apiUrl + ENDPOINT_NAME;

  public constructor(
      private readonly _http: HttpClient,
  ) {}

  public getDriversOutput(): Observable<Driver[]> {
    return this._http.get<Driver[]>(this._baseUrl);
  }

  public addDriver(createDriverInput: CreateDriverInput): Observable<GenericCreate> {
    return this._http.post<GenericCreate>(`${this._baseUrl}`, createDriverInput);
  }

  public updateDriver(updateDriverInput: UpdateDriverInput): Observable<GenericUpdate> {
    return this._http.put<GenericUpdate>(`${this._baseUrl}${updateDriverInput.id}`, updateDriverInput);
  }

  public deleteDriver(driver: Driver): Observable<GenericUpdate> {
    return this._http.delete(`${this._baseUrl}${driver.id}`);
  }
}
