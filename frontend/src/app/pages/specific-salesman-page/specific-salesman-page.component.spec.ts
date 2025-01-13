import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecificSalesmanPageComponent } from './specific-salesman-page.component';

describe('SpecificSalesmanPageComponent', () => {
  let component: SpecificSalesmanPageComponent;
  let fixture: ComponentFixture<SpecificSalesmanPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SpecificSalesmanPageComponent]
    });
    fixture = TestBed.createComponent(SpecificSalesmanPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
