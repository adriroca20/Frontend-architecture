import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@environment';
import {Observable} from 'rxjs';

import {Country} from '../00 model';

const ENDPOINT_NAME = 'countries/';

@Injectable({
  providedIn: 'root',
})
export class CountryCall {
  private readonly _baseUrl: string = environment.apiUrl + ENDPOINT_NAME;

  public constructor(
      private readonly _http: HttpClient,
  ) {}

  public getCountriesList$(): Observable<Country[]> {
    return this._http.get<Country[]>(this._baseUrl);
  }
}
