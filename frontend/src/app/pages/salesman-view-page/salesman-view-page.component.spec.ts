import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesmanViewPageComponent } from './salesman-view-page.component';

describe('SalesmanViewPageComponent', () => {
  let component: SalesmanViewPageComponent;
  let fixture: ComponentFixture<SalesmanViewPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SalesmanViewPageComponent]
    });
    fixture = TestBed.createComponent(SalesmanViewPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
