import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovePerformanceRecordPageComponent } from './approve-performance-record-page.component';

describe('ApprovePerformanceRecordPageComponent', () => {
  let component: ApprovePerformanceRecordPageComponent;
  let fixture: ComponentFixture<ApprovePerformanceRecordPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApprovePerformanceRecordPageComponent]
    });
    fixture = TestBed.createComponent(ApprovePerformanceRecordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
