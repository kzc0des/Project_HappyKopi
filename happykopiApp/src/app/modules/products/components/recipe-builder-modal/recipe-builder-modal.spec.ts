import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeBuilderModal } from './recipe-builder-modal';

describe('RecipeBuilderModal', () => {
  let component: RecipeBuilderModal;
  let fixture: ComponentFixture<RecipeBuilderModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecipeBuilderModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeBuilderModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
