import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierLink } from './modifier-link';

describe('ModifierLink', () => {
  let component: ModifierLink;
  let fixture: ComponentFixture<ModifierLink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierLink]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierLink);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
