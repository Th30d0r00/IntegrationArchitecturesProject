import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceRecordPageComponent } from './performance-record-page.component';

describe('PerformanceRecordPageComponent', () => {
  let component: PerformanceRecordPageComponent;
  let fixture: ComponentFixture<PerformanceRecordPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerformanceRecordPageComponent]
    });
    fixture = TestBed.createComponent(PerformanceRecordPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
