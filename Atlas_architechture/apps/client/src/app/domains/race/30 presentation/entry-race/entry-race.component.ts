import {NgClass, NgFor, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';
import {Component, Inject, OnInit, Optional} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatOptionModule} from '@angular/material/core';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {GenericPopupInput, GenericPopupOutput} from '@shared/models';

import {Race} from '../../00 model';

export interface EntryRaceInput extends GenericPopupInput {
  race?: Race;
}

export interface EntryRaceOutput extends GenericPopupOutput {
  selectedRace: Race;
}

@Component({
  templateUrl: './entry-race.component.html',
  styleUrls: ['./entry-race.component.scss'],
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
export class EntryRaceComponent implements OnInit {
  public raceForm!: FormGroup;
  public cancelled = false;

  public constructor(
      public dialogRef: MatDialogRef<EntryRaceComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: EntryRaceInput,
  ) {
    dialogRef.disableClose = true;
  }

  public ngOnInit(): void {
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
    this.raceForm = new FormGroup({
      name: new FormControl(this.data.race?.name || '', [Validators.required]),
      code: new FormControl(this.data.race?.code || '', [Validators.required]),
      description: new FormControl(this.data.race?.description || ''),
      starRating: new FormControl(this.data.race?.starRating || 0),
      laps: new FormControl(this.data.race?.laps || 0),
    });
  }

  private _saveData(): void {
    if (!this.raceForm.valid) {
      return;
    }

    const {name, code, description, starRating, laps} = this.raceForm.getRawValue();
    const selectedRace: Race = {
      id: this.data.race?.id || -1,
      name,
      code,
      description,
      starRating,
      laps,
    };

    const entryUserOutput: EntryRaceOutput = {action: this.data.action, selectedRace};
    this.dialogRef.close(entryUserOutput);
  }
}
