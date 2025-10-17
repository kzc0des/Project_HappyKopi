import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOnsPage } from './add-ons-page';

describe('AddOnsPage', () => {
  let component: AddOnsPage;
  let fixture: ComponentFixture<AddOnsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOnsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOnsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
