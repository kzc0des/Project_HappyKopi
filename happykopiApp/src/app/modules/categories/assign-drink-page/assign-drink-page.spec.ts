import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignDrinkPage } from './assign-drink-page';

describe('AssignDrinkPage', () => {
  let component: AssignDrinkPage;
  let fixture: ComponentFixture<AssignDrinkPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignDrinkPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignDrinkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
