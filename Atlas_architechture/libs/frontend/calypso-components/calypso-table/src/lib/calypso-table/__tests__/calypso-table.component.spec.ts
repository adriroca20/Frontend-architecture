import {ComponentFixture, TestBed} from '@angular/core/testing';

import {CalypsoTableComponent} from '../calypso-table.component';

describe('CalypsoTableComponent', () => {
  let component: CalypsoTableComponent;
  let fixture: ComponentFixture<CalypsoTableComponent>;

  beforeEach(async () => {
    await TestBed
        .configureTestingModule({
          imports: [CalypsoTableComponent],
        })
        .compileComponents();

    fixture = TestBed.createComponent(CalypsoTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
