import { Component, ElementRef, forwardRef, HostListener } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-expiry-date-card',
  imports: [FormsModule],
  templateUrl: './expiry-date-card.html',
  styleUrl: './expiry-date-card.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ExpiryDateCard),
      multi: true,
    },
  ],
})
export class ExpiryDateCard implements ControlValueAccessor {
  month: string = '';
  year: string = '';

  private onChange: (value: string) => void = () => { };
  private onTouched: () => void = () => { };

  constructor(private elementRef: ElementRef) { }

  writeValue(value: string): void {
    if (value && value.includes('/')) {
      const [month, year] = value.split('/');
      this.month = month;
      this.year = year;
    } else {
      this.month = '';
      this.year = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onDateChange(): void {
    if (this.month && this.month.length > 2) {
      this.month = this.month.substring(0, 2);
    }
    if (this.year && this.year.length > 2) {
      this.year = this.year.substring(0, 2);
    }

    const monthNum = parseInt(this.month, 10);
    if (monthNum < 1) this.month = '';
    if (monthNum > 12) this.month = '12';

    if (this.month && this.month.length === 2 && this.year && this.year.length === 2) {
      this.onChange(`${this.month}/${this.year}`);
    } else {
      this.onChange('');
    }
  }

  onMonthInput(event: Event): void {
    this.onDateChange();
    const monthInput = event.target as HTMLInputElement;
    if (monthInput.value.length === 2) {
      const yearInput = this.elementRef.nativeElement.querySelector('#year-input');
      if (yearInput) {
        yearInput.focus();
      }
    }
  }

  @HostListener('focusout')
  onBlur() {
    this.onTouched();
  }
}
