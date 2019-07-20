import { TestBed } from '@angular/core/testing';

import { InstitutionContractService } from './institution-contract.service';

describe('InstitutionContractService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InstitutionContractService = TestBed.get(InstitutionContractService);
    expect(service).toBeTruthy();
  });
});
