import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierList } from './modifier-list';

describe('ModifierList', () => {
  let component: ModifierList;
  let fixture: ComponentFixture<ModifierList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
