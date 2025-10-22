import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrinkDetailPage } from './drink-detail-page';

describe('DrinkDetailPage', () => {
  let component: DrinkDetailPage;
  let fixture: ComponentFixture<DrinkDetailPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DrinkDetailPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrinkDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
