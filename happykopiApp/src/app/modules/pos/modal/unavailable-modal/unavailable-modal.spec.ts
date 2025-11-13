import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UnavailableProductModal } from './unavailable-modal';
 

describe('UnavailableModal', () => {
  let component: UnavailableProductModal;
  let fixture: ComponentFixture<UnavailableProductModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnavailableProductModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnavailableProductModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
