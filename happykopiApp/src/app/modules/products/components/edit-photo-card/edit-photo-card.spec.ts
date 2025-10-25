import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPhotoCard } from './edit-photo-card';

describe('EditPhotoCard', () => {
  let component: EditPhotoCard;
  let fixture: ComponentFixture<EditPhotoCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPhotoCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPhotoCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
