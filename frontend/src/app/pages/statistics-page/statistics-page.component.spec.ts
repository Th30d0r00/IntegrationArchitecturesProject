/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { StatisticsPageComponent } from './statistics-page.component';

describe('StatisticsPageComponent', () => {
  let component: StatisticsPageComponent;
  let fixture: ComponentFixture<StatisticsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatisticsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatisticsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
