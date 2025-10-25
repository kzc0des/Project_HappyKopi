import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddButtonCard } from './add-button-card';

describe('AddButtonCard', () => {
  let component: AddButtonCard;
  let fixture: ComponentFixture<AddButtonCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddButtonCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddButtonCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
