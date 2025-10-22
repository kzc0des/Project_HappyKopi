import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateDrinkPage } from './create-drink-page';

describe('CreateDrinkPage', () => {
  let component: CreateDrinkPage;
  let fixture: ComponentFixture<CreateDrinkPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateDrinkPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateDrinkPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
