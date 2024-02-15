

import {DatePipe, NgClass, NgFor, NgIf} from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatOptionModule} from '@angular/material/core';
import {MatDialog} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatPaginator, MatPaginatorIntl, MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatTooltipModule} from '@angular/material/tooltip';
import {RouterLink} from '@angular/router';
import {filter, Subject, Subscription} from 'rxjs';

import {Action, DeleteItemPopupComponent, DeletePopupInput, DeletePopupOutput} from './delete-item/delete-item-popup.component';

export enum ColumnTypes {
  /**
   * To adjust some masks in the output
   * 'date' is piped with date pipe:  {{ value | date: 'dd/MM/yyyy' }}
   * 'standard' won't be piped.
   */
  Boolean = 'boolean',
  Standard = 'standard',
  Date = 'date',
  DateTime = 'datetime',
}

export enum Alignment {
  Left = 'left',
  Center = 'center',
  Right = 'right'
}

export interface TableHeaders {
  // Name of the property as on the database
  name: string;
  // Title shown in the table
  displayName: string;
  // Defines some types for piping the output
  type: ColumnTypes;
  // Alignment for cell and header cell content
  align?: Alignment;
}

@Component({
  selector: 'calypso-table',
  templateUrl: './calypso-table.component.html',
  styleUrls: ['./calypso-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    NgIf,
    MatCheckboxModule,
    FormsModule,
    ReactiveFormsModule,
    NgFor,
    MatIconModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatButtonModule,
    MatTooltipModule,
    RouterLink,
    NgClass,
    MatPaginatorModule,
    DatePipe,
  ],
})
export class CalypsoTableComponent implements OnDestroy, AfterViewInit {
  @Input()
  public set dataSource(newValue) {
    if (newValue === this._updatedSource) {
      return;
    }
    this._dataSource = new MatTableDataSource(newValue);
    this._updatedSource = newValue;
    this._dataSource.sort = this.sort;
    this._dataSource.paginator = this.paginator;
  }
  public get dataSource(): any {
    return this._dataSource;
  }

  /**
   * Each of the attributes that a row can have, i.e: ["Type", "height", ....].
   * They must have been set following the TableHeaders Interface
   */
  @Input()
  public set columns(newValue: TableHeaders[]) {
    if (newValue === this._columns) {
      return;
    }
    const cols = newValue;
    this._recievedLabels = cols.map((column: TableHeaders) => column.name);

    if (this.showDefaultActions && this.showActions) {
      this.columnLabels = ['action'];
    }

    if (this.showDefaultActions) {
      this.columnLabels = this._recievedLabels.concat(this.columnLabels);
    } else {
      this.columnLabels = this._recievedLabels;
    }

    this._columns = newValue;
  }
  public get columns(): TableHeaders[] {
    return this._columns;
  }

  @Input()
  public showActions: boolean = true;

  // Default actions
  @Input()
  public showDefaultActions: boolean = true;

  // Paginators
  @Input()
  public showPaginators: boolean = true;

  @Input()
  public pageSize: number = 20;

  @Input()
  public pageSizeOptions: number[] = [10, 20, 50, 100];

  @Input()
  public set pageIndex(newValue: number) {
    if (this.paginator) {
      this.paginator.pageIndex = newValue;
    }

    this._pageIndex = newValue;
  }

  public get pageIndex(): number {
    return this._pageIndex;
  }

  @Input()
  public showFirstLastButtonsOfPaginator = true;

  @Input()
  public hidePageSize = false;

  /** OUTPUTS */
  @Output()
  public createdRow = new EventEmitter<any>();

  @Output()
  public deletedRow = new EventEmitter<any>();

  @Output()
  public updatedRow = new EventEmitter<any>();

  /** Special */
  @ViewChild(MatPaginator)
  protected paginator!: MatPaginator;

  @ViewChild(MatSort)
  protected sort!: MatSort;

  // Ennumerations
  public columnTypes = ColumnTypes;
  public alignment = Alignment;

  public columnLabels!: string[];

  public resultsLength: number = 0;

  public loading: boolean = false;

  protected _paginatorStatus!: PageEvent;
  protected _pageIndex: number = 0;

  // Source displayed on the table, it can be modified by the internal filters
  public _dataSource: any;
  protected _columns: any;

  // Right now it's prepared to just have one selectable per row
  protected _dropdownRowFCSubscriptions: Subscription[] = [];

  // Subscription for the input formControl
  protected _inputFCSubscriptions: Subscription[] = [];

  protected _destroyed$ = new Subject();
  protected _recievedLabels!: string[];

  // Static source within the component
  protected _updatedSource!: any;

  public constructor(
      protected readonly paginators: MatPaginatorIntl,
      protected readonly _dialog: MatDialog,
      protected readonly _cd: ChangeDetectorRef,
  ) {}

  public ngOnDestroy(): void {
    this._destroyed$.next({});
    this._destroyed$.complete();
  }

  public ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.pageIndex = this.pageIndex;
      this._cd.detectChanges();

      if (this._dataSource) {
        this._dataSource.paginator = this.paginator;
      }
      if (this._dataSource && this.sort) {
        this._dataSource.sort = this.sort;
      }
    }
  }

  // Not implemented in the layout yet
  public createRow(): void {
    this.createdRow.emit();
  }

  public deleteRow(row: any): void {
    const deleteRowInput: DeletePopupInput = {
      action: Action.delete,
      headerMessage: 'Are you sure you want to delete this item?',
      item: row,
      keys: this._recievedLabels,
      labels: this.columns.map((column: TableHeaders) => column.displayName),
    };

    const dialogRef = this._dialog.open(DeleteItemPopupComponent, {
      width: '500px',
      data: deleteRowInput,
    });

    dialogRef.afterClosed().pipe(filter((result: DeletePopupOutput) => result.event === Action.delete)).subscribe(() => {
      this.deletedRow.emit(row);
    });
  }

  public updateRow(row: any): void {
    this.updatedRow.emit(row);
  }

  public trackByItems(index: number, item: any): number {
    return item.id;
  }
}
