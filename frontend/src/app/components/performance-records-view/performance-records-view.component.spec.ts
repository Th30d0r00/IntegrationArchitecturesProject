import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerformanceRecordsViewComponent } from './performance-records-view.component';

describe('PerformanceRecordsViewComponent', () => {
  let component: PerformanceRecordsViewComponent;
  let fixture: ComponentFixture<PerformanceRecordsViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PerformanceRecordsViewComponent]
    });
    fixture = TestBed.createComponent(PerformanceRecordsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
