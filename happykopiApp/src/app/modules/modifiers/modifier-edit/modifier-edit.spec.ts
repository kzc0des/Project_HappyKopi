import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierEdit } from './modifier-edit';

describe('ModifierEdit', () => {
  let component: ModifierEdit;
  let fixture: ComponentFixture<ModifierEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierEdit]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierEdit);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
