import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAddOnsPage } from './edit-add-ons-page';

describe('EditAddOnsPage', () => {
  let component: EditAddOnsPage;
  let fixture: ComponentFixture<EditAddOnsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditAddOnsPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAddOnsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
