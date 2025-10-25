import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchFieldCard } from './search-field-card';

describe('SearchFieldCard', () => {
  let component: SearchFieldCard;
  let fixture: ComponentFixture<SearchFieldCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchFieldCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchFieldCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
