import { Component } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-quantity-button',
  imports: [],
  templateUrl: './quantity-button.html',
  styleUrl: './quantity-button.css',
})
export class QuantityButton implements ControlValueAccessor {
  value: number = 0;
  disabled: boolean = false;

  onChange: (val: number) => void = () => { };
  onTouched: () => void = () => { };

  writeValue(val: number): void {
    this.value = val || 0;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


  incrementCount(): void {
    if (this.disabled) return;
    
    this.value++;
    
    this.onChange(this.value); 
    this.onTouched(); 
  }

  decrementCount(): void {
    if (this.disabled) return;

    if (this.value > 0) { 
      this.value--;
      
      this.onChange(this.value);
      this.onTouched();
    }
  }
}
