import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceRecordApprovalListPageComponent } from './performance-record-approval-list-page.component';

describe('PerformanceRecordApprovalListPageComponent', () => {
  let component: PerformanceRecordApprovalListPageComponent;
  let fixture: ComponentFixture<PerformanceRecordApprovalListPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerformanceRecordApprovalListPageComponent]
    });
    fixture = TestBed.createComponent(PerformanceRecordApprovalListPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
