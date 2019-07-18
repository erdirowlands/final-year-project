import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionsPage } from './elections.page';

describe('ElectionsPage', () => {
  let component: ElectionsPage;
  let fixture: ComponentFixture<ElectionsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectionsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectionsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
