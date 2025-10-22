import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierView } from './modifier-view';

describe('ModifierView', () => {
  let component: ModifierView;
  let fixture: ComponentFixture<ModifierView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModifierView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifierView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
