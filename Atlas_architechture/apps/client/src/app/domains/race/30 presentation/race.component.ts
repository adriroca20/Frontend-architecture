import {AsyncPipe, NgFor, NgIf, UpperCasePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, OnDestroy, OnInit, Signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {CalypsoTableComponent, ColumnTypes, TableHeaders} from '@calypso-components/calypso-table';
import {Store} from '@ngrx/store';
import {
  Action,
} from '@shared/models';
import {Subject} from 'rxjs';
import {filter, map, tap} from 'rxjs/operators';

import {Race} from '../00 model';
import {RaceFeature, RacePageActions, RaceSelectors} from '../10 infrastructure';

import {EntryRaceComponent, EntryRaceInput, EntryRaceOutput} from './entry-race/entry-race.component';

@Component({
  templateUrl: './race.component.html',
  styleUrls: ['./race.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    NgIf,
    NgFor,
    AsyncPipe,
    UpperCasePipe,
    // Calypso
    CalypsoTableComponent,

  ],
})
export class RaceComponent implements OnInit, OnDestroy {
  public racesAsSignal$: Signal<Race[]|undefined> = toSignal(this._store.select(RaceSelectors.getRaces));

  public tableHeaders: TableHeaders[] = [
    {
      name: 'name',
      displayName: 'Name',
      type: ColumnTypes.Standard,
    },
    {
      name: 'laps',
      displayName: 'Laps',
      type: ColumnTypes.Standard,
    },
    {
      name: 'code',
      displayName: 'Code',
      type: ColumnTypes.Standard,
    },
    {
      name: 'starRating',
      displayName: 'Rating',
      type: ColumnTypes.Standard,
    },
  ];
  private _destroyed$ = new Subject();

  public constructor(
      private readonly _store: Store<RaceFeature.RaceState>,
      public readonly _dialog: MatDialog,
  ) {}

  public ngOnInit(): void {
    this._store.dispatch(RacePageActions.loadRaces());
  }

  public ngOnDestroy(): void {
    this._destroyed$.next({});
    this._destroyed$.complete();
  }

  public addRace(): void {
    const entryRaceInput: EntryRaceInput = {
      action: Action.create,
      headerMessage: 'Create race',
    };

    const dialogRef: MatDialogRef<EntryRaceComponent> = this._dialog.open(EntryRaceComponent, {
      width: '500px',
      data: entryRaceInput,
    });

    dialogRef.afterClosed()
        .pipe(
            filter((result: EntryRaceOutput) => result.action === Action.create),
            map((result: EntryRaceOutput) => result.selectedRace),
            tap((race: Race) => this._store.dispatch(RacePageActions.createRace({race}))))
        .subscribe();
  }

  public updateRace(raceToUpdate: Race): void {
    const entryRaceInput: EntryRaceInput = {
      action: Action.edit,
      headerMessage: 'Edit race',
      race: raceToUpdate,
    };

    const dialogRef: MatDialogRef<EntryRaceComponent> = this._dialog.open(EntryRaceComponent, {
      width: '500px',
      data: entryRaceInput,
    });

    dialogRef.afterClosed()
        .pipe(
            filter((result: EntryRaceOutput) => result.action === Action.edit),
            map((result: EntryRaceOutput) => result.selectedRace),
            tap((race: Race) => this._store.dispatch(RacePageActions.updateRace({race}))),
            )
        .subscribe();
  }

  public deleteRace(race: Race): void {
    this._store.dispatch(RacePageActions.deleteRace({raceId: race.id}));
  }
}
