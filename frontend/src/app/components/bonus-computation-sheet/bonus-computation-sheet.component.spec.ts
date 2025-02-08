import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusComputationSheetComponent } from './bonus-computation-sheet.component';

describe('BonusComputationSheetComponent', () => {
  let component: BonusComputationSheetComponent;
  let fixture: ComponentFixture<BonusComputationSheetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BonusComputationSheetComponent]
    });
    fixture = TestBed.createComponent(BonusComputationSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
