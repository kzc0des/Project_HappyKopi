import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrinkListPage } from './drink-list-page';

describe('DrinkListPage', () => {
  let component: DrinkListPage;
  let fixture: ComponentFixture<DrinkListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrinkListPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrinkListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
