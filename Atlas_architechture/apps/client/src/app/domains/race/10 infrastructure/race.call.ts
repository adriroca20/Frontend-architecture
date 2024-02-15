import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '@environment';
import {Observable, throwError} from 'rxjs';
import {catchError, map, tap} from 'rxjs/operators';

import {Race} from '../00 model';

const ENDPOINT_NAME = 'races/';

@Injectable({
  providedIn: 'root',
})
export class RaceService {
  public constructor(private readonly _http: HttpClient) {}

  public getRaces(): Observable<Race[]> {
    return this._http.get<Race[]>(`${environment.apiUrl}${ENDPOINT_NAME}`)
        .pipe(
            tap(data => console.log(JSON.stringify(data))),
            catchError(this.handleError),
        );
  }

  public createRace(race: Race): Observable<Race> {
    // Race Id must be null for the Web API to assign an Id
    const newRace = {...race, id: null};
    return this._http.post<Race>(`${environment.apiUrl}${ENDPOINT_NAME}`, newRace)
        .pipe(
            tap(data => console.log('createRace: ' + JSON.stringify(data))),
            catchError(this.handleError),
        );
  }

  public deleteRace(id: number): Observable<Race> {
    const url = `${`${environment.apiUrl}${ENDPOINT_NAME}`}/${id}`;
    return this._http.delete<Race>(url).pipe(
        tap(data => console.log('deleteRace: ' + id)),
        catchError(this.handleError),
    );
  }

  public updateRace(race: Race): Observable<Race> {
    const url = `${`${environment.apiUrl}${ENDPOINT_NAME}`}/${race.id}`;
    return this._http.put<Race>(url, race).pipe(
        tap(() => console.log('updateRace: ' + race.id)),
        // Return the race on an update
        map(() => race),
        catchError(this.handleError),
    );
  }

  private handleError(err: any) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(() => new Error(errorMessage));
  }
}
