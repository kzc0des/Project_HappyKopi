import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchDrink } from './search-drink';

describe('SearchDrink', () => {
  let component: SearchDrink;
  let fixture: ComponentFixture<SearchDrink>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchDrink]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchDrink);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
