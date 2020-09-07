import { TestBed } from '@angular/core/testing';

import { OngletService } from './onglet.service';

describe('OngletService', () => {
  let service: OngletService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OngletService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
