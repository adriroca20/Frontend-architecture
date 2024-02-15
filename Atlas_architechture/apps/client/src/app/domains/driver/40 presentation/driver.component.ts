import {AsyncPipe, NgFor, NgIf, UpperCasePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, Signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {CalypsoTableComponent, ColumnTypes, TableHeaders} from '@calypso-components/calypso-table';
import {
  Action,
} from '@shared/models';
import {Observable, Subject} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';

import {CountryFacade} from '../../country';
import {TeamFacade} from '../../team';
import {Driver} from '../00 model';
import {DriverFacade} from '../20 abstraction';

import {EntryDriverComponent, EntryDriverInput, EntryDriverOutput} from './entry-driver/entry-driver.component';

@Component({
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    // Angular
    FormsModule,
    NgIf,
    NgFor,
    AsyncPipe,
    UpperCasePipe,

    // Material
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,

    // Calypso
    CalypsoTableComponent,
  ],
})
export class DriverComponent implements OnInit, OnDestroy {
  public drivers$!: Observable<Driver[]>;
  public driversAsSignal$: Signal<Driver[]|undefined> = toSignal(this._driverFacade.getDrivers$());

  public showSpinner$ = toSignal(this._driverFacade.isUpdating$());
  public showSpinner2$ = this._driverFacade.isUpdating$();

  public tableHeaders: TableHeaders[] = [
    {
      name: 'firstName',
      displayName: 'Name',
      type: ColumnTypes.Standard,
    },
    {
      name: 'lastName',
      displayName: 'Last Name',
      type: ColumnTypes.Standard,
    },
    {
      name: 'currentTeamName',
      displayName: 'Team',
      type: ColumnTypes.Standard,
    },
    {
      name: 'wins',
      displayName: 'Wins',
      type: ColumnTypes.Standard,
    },
  ];
  private _destroyed$ = new Subject();

  public constructor(
      private readonly _driverFacade: DriverFacade,
      private readonly _teamFacade: TeamFacade,
      private readonly _countryFacade: CountryFacade,
      public readonly _dialog: MatDialog,
  ) {
    // this.driversAsSignal$ = toSignal(this._driverFacade.getDrivers$());
  }

  public ngOnInit(): void {
    this.drivers$ = this._driverFacade.getDrivers$();
  }

  public ngOnDestroy(): void {
    this._destroyed$.next({});
    this._destroyed$.complete();
  }

  public addDriver(): void {
    const entryDriverInput: EntryDriverInput = {
      action: Action.create,
      headerMessage: 'Create driver',
      nationalities: this._countryFacade.getCountriesList(),
      teams: this._teamFacade.getTeamsAsBasicEntities(),
    };

    const dialogRef: MatDialogRef<EntryDriverComponent> = this._dialog.open(EntryDriverComponent, {
      width: '500px',
      data: entryDriverInput,
    });

    dialogRef.afterClosed()
        .pipe(
            filter((result: EntryDriverOutput) => result.action === Action.create),
            map((result: EntryDriverOutput) => result.selectedDriver),
            tap((driver: Driver) => this._driverFacade.addDriver(driver)))
        .subscribe();
  }

  public updateDriver(driverToUpdate: Driver): void {
    const entryDriverInput: EntryDriverInput = {
      action: Action.edit,
      headerMessage: 'Edit driver',
      nationalities: this._countryFacade.getCountriesList(),
      teams: this._teamFacade.getTeamsAsBasicEntities(),
      selectedDriver: driverToUpdate,
    };

    const dialogRef: MatDialogRef<EntryDriverComponent> = this._dialog.open(EntryDriverComponent, {
      width: '500px',
      data: entryDriverInput,
    });

    dialogRef.afterClosed()
        .pipe(
            filter((result: EntryDriverOutput) => result.action === Action.edit),
            map((result: EntryDriverOutput) => result.selectedDriver),
            tap((driver: Driver) => this._driverFacade.updateDriver(driver)),
            )
        .subscribe();
  }

  public deleteDriver(driver: Driver): void {
    this._driverFacade.deleteDriver(driver);
  }
}
