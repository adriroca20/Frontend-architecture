import {NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';
import {Component, Inject, OnInit, Optional} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatOptionModule} from '@angular/material/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {BasicEntity, GenericPopupInput, GenericPopupOutput} from '@shared/models';

import {Driver} from '../../00 model';

export interface EntryDriverInput extends GenericPopupInput {
  readonly teams: BasicEntity[];
  readonly nationalities: BasicEntity[];

  // Only when editing
  readonly selectedDriver?: Driver;
}

export interface EntryDriverOutput extends GenericPopupOutput {
  selectedDriver: Driver;
}

@Component({
  templateUrl: './entry-driver.component.html',
  styleUrls: ['./entry-driver.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    NgFor,
    MatOptionModule,
    MatInputModule,
    NgIf,
    MatDividerModule,
    NgClass,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
  ],
})
export class EntryDriverComponent implements OnInit {
  public driverForm!: FormGroup;
  public cancelled = false;

  public constructor(
      public dialogRef: MatDialogRef<EntryDriverComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: EntryDriverInput,
  ) {
    dialogRef.disableClose = true;
  }

  public ngOnInit(): void {
    console.log({data: this.data});
    this._buildForm();
  }

  public onSubmit(): void {
    if (!this.cancelled) {
      this._saveData();
    }
  }

  public closeDialog(): void {
    this.cancelled = true;
    this.dialogRef.close({event: 'Cancel'});
  }

  private _buildForm(): void {
    this.driverForm = new FormGroup({
      firstName: new FormControl(this.data.selectedDriver?.firstName || null, [Validators.required]),
      lastName: new FormControl(this.data.selectedDriver?.lastName || null, [Validators.required]),
      age: new FormControl(this.data.selectedDriver?.age || null, [Validators.required]),
      nationalityId: new FormControl(this.data.selectedDriver?.nationality.id || null, [Validators.required]),
      wins: new FormControl(this.data.selectedDriver?.wins || 0, [Validators.required]),
      teamsIds: new FormControl(this.data.selectedDriver?.teams.map(team => team.id) || null),
      currentTeamId: new FormControl(this.data.selectedDriver?.currentTeam?.id || null),
    });
  }

  private _saveData(): void {
    if (!this.driverForm.valid) {
      return;
    }

    const {firstName, lastName, age, nationalityId, wins, teamsIds, currentTeamId}: EntryDriverFormValues = this.driverForm.getRawValue();

    this.driverForm.getRawValue()

    const nationality = this.data.nationalities.find((country) => country.id === nationalityId);
    const currentTeam = this.data.teams.find((team) => team.id === currentTeamId);
    const teams = this.data.teams.filter((team) => teamsIds.includes(team.id));

    if (!nationality || !currentTeam) {
      console.error('Invalid data');
      return;
    }

    const selectedDriver: Driver = {
      id: this.data.selectedDriver?.id || -1,
      firstName,
      lastName,
      age,
      wins,
      nationality,
      teams,
      currentTeam: this.data.teams.find((team) => team.id === currentTeamId),
    };

    const entryUserOutput: EntryDriverOutput = {
      action: this.data.action,
      selectedDriver,
    };

    this.dialogRef.close(entryUserOutput);
  }
}

interface EntryDriverFormValues extends Omit<Driver, 'id'|'nationality'|'teams'|'currentTeam'> {
  nationalityId: number;
  teamsIds: number[];
  currentTeamId: number;
}