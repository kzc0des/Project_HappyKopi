import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierSizeCard } from './modifier-size-card';

describe('ModifierSizeCard', () => {
  let component: ModifierSizeCard;
  let fixture: ComponentFixture<ModifierSizeCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierSizeCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierSizeCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
