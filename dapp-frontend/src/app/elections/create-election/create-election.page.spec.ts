import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateElectionPage } from './create-election.page';

describe('CreateElectionPage', () => {
  let component: CreateElectionPage;
  let fixture: ComponentFixture<CreateElectionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateElectionPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateElectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
