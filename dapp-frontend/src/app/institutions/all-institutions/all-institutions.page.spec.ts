import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllInstitutionsPage } from './all-institutions.page';

describe('AllInstitutionsPage', () => {
  let component: AllInstitutionsPage;
  let fixture: ComponentFixture<AllInstitutionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllInstitutionsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllInstitutionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
