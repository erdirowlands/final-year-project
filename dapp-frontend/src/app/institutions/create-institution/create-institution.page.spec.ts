import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateInstitutionPage } from './create-institution.page';

describe('CreateInstitutionPage', () => {
  let component: CreateInstitutionPage;
  let fixture: ComponentFixture<CreateInstitutionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateInstitutionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateInstitutionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
