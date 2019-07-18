import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllElectionsPage } from './all-elections.page';

describe('AllElectionsPage', () => {
  let component: AllElectionsPage;
  let fixture: ComponentFixture<AllElectionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllElectionsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllElectionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
