import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceRecordSalesmanViewComponent } from './performance-record-salesman-view.component';

describe('PerformanceRecordSalesmanViewComponent', () => {
  let component: PerformanceRecordSalesmanViewComponent;
  let fixture: ComponentFixture<PerformanceRecordSalesmanViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerformanceRecordSalesmanViewComponent]
    });
    fixture = TestBed.createComponent(PerformanceRecordSalesmanViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
