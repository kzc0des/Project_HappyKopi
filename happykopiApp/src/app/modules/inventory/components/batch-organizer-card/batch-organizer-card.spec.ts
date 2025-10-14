import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchOrganizerCard } from './batch-organizer-card';

describe('BatchOrganizerCard', () => {
  let component: BatchOrganizerCard;
  let fixture: ComponentFixture<BatchOrganizerCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchOrganizerCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchOrganizerCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
