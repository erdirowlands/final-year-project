import { TestBed } from '@angular/core/testing';

import { ElectionContractService } from './election-contract.service';

describe('ElectionContractService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ElectionContractService = TestBed.get(ElectionContractService);
    expect(service).toBeTruthy();
  });
});
