import { TestBed } from '@angular/core/testing';

import { SalesmenService } from './salesmen.service';

describe('SalesmenService', () => {
  let service: SalesmenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SalesmenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
