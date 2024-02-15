import {NgFor} from '@angular/common';
import {Component, Inject, Optional} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MAT_DIALOG_DATA, MatDialogModule, MatDialogRef} from '@angular/material/dialog';

export enum Action {
  create = 'Create',
  edit = 'Edit',
  delete = 'Delete',
  cancel = 'Cancel',
  confirm = 'Confirm',
}

export interface DeletePopupInput {
  keys: string[];
  labels: string[];
  item: any;
  headerMessage: string;
  action: Action;
}

export interface DeletePopupOutput {
  event: string;
}

@Component({
  templateUrl: './delete-item-popup.component.html',
  styleUrls: ['./delete-item-popup.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    NgFor,
    MatButtonModule,
  ],
})
export class DeleteItemPopupComponent {
  public cancelled = false;

  public constructor(
      public dialogRef: MatDialogRef<DeleteItemPopupComponent>,
      // @Optional() is used to prevent error if no data is passed
      @Optional() @Inject(MAT_DIALOG_DATA) public data: DeletePopupInput,
  ) {
    dialogRef.disableClose = true;
  }

  public onSubmit(): void {
    if (!this.cancelled) {
      this._confirmDeletion();
    }
  }

  public closeDialog(): void {
    this.cancelled = true;
    this.dialogRef.close({event: 'Cancel'});
  }

  private _confirmDeletion(): void {
    const deleteTablePopupOutput: DeletePopupOutput = {
      event: Action.delete,
    };
    this.dialogRef.close(deleteTablePopupOutput);
  }
}
