import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierItemCard } from './modifier-item-card';

describe('ModifierItemCard', () => {
  let component: ModifierItemCard;
  let fixture: ComponentFixture<ModifierItemCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierItemCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierItemCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
