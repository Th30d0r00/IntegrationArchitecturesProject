import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateRejectedPerformanceRecordPageComponent } from './update-rejected-performance-record-page.component';

describe('UpdateRejectedPerformanceRecordPageComponent', () => {
  let component: UpdateRejectedPerformanceRecordPageComponent;
  let fixture: ComponentFixture<UpdateRejectedPerformanceRecordPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateRejectedPerformanceRecordPageComponent]
    });
    fixture = TestBed.createComponent(UpdateRejectedPerformanceRecordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
