import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPerformanceRecordPageComponent } from './add-performance-record-page.component';

describe('AddPerformanceRecordPageComponent', () => {
  let component: AddPerformanceRecordPageComponent;
  let fixture: ComponentFixture<AddPerformanceRecordPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddPerformanceRecordPageComponent]
    });
    fixture = TestBed.createComponent(AddPerformanceRecordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
