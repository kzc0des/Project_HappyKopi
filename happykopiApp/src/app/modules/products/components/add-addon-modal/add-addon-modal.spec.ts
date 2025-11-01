import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAddonModal } from './add-addon-modal';

describe('AddAddonModal', () => {
  let component: AddAddonModal;
  let fixture: ComponentFixture<AddAddonModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddAddonModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddAddonModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
