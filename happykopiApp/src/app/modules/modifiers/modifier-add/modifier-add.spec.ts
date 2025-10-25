import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierAdd } from './modifier-add';

describe('ModifierAdd', () => {
  let component: ModifierAdd;
  let fixture: ComponentFixture<ModifierAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
