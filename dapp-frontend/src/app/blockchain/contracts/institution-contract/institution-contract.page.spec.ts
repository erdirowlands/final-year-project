import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstitutionContractPage } from './institution-contract.page';

describe('InstitutionContractPage', () => {
  let component: InstitutionContractPage;
  let fixture: ComponentFixture<InstitutionContractPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstitutionContractPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionContractPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
