import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterBarista } from './register-barista';

describe('RegisterBarista', () => {
  let component: RegisterBarista;
  let fixture: ComponentFixture<RegisterBarista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterBarista]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterBarista);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
