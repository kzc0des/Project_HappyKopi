import { Component, ElementRef, forwardRef, HostListener, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { HeaderService } from '../../../../core/services/header/header.service';

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
  day: string = '';
  year: string = '';

  @ViewChild('nativeDatePicker') nativeDatePicker!: ElementRef<HTMLInputElement>;

  private onChange: (value: Date | null) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elementRef: ElementRef, private headerService: HeaderService) {}

  writeValue(value: Date | string | null): void {
    if (value instanceof Date && !isNaN(value.getTime())) {
      this.year = value.getFullYear().toString();
      this.month = (value.getMonth() + 1).toString().padStart(2, '0');
      this.day = value.getDate().toString().padStart(2, '0');
    } else if (typeof value === 'string' && new Date(value)) {
        const date = new Date(value);
        this.year = date.getFullYear().toString();
        this.month = (date.getMonth() + 1).toString().padStart(2, '0');
        this.day = date.getDate().toString().padStart(2, '0');
    }
    else {
      this.year = '';
      this.month = '';
      this.day = '';
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  onDateChange(): void {
    this.month = this.month.slice(0, 2);
    this.day = this.day.slice(0, 2);
    this.year = this.year.slice(0, 4);

    const monthNum = parseInt(this.month, 10);
    const dayNum = parseInt(this.day, 10);
    const yearNum = parseInt(this.year, 10);

    if (monthNum > 12) this.month = '12';
    if (dayNum > 31) this.day = '31';

    if (
      this.month.length >= 1 &&
      this.day.length >= 1 &&
      this.year.length === 4
    ) {
      const date = new Date(yearNum, monthNum - 1, dayNum);
      if (date.getFullYear() === yearNum && date.getMonth() === monthNum - 1 && date.getDate() === dayNum) {
        this.onChange(date);
      } else {
        this.onChange(null);
      }
    } else {
      this.onChange(null);
    }

    this.headerService.notifyValueChanged('changed date', true);
  }

  focusNext(event: Event, nextField: 'day' | 'year'): void {
    this.onDateChange();
    const input = event.target as HTMLInputElement;
    const maxLength = input.maxLength;
    
    if (input.value.length === maxLength) {
      const nextInput = this.elementRef.nativeElement.querySelector(`#${nextField}-input`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  }

  handleBlur(): void {
    this.onTouched();
  }

  /**
   * BAGO: Method para buksan ang native date picker.
   */
  openCalendar(): void {
    try {
      // Modern way para ipakita ang picker
      this.nativeDatePicker.nativeElement.showPicker();
    } catch (error) {
      // Fallback para sa mga lumang browser
      this.nativeDatePicker.nativeElement.click();
    }
  }

  /**
   * BAGO: Kukunin ang value kapag pumili ang user sa native date picker.
   */
  onNativeDateChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value; // Format nito ay "YYYY-MM-DD"

    if (value) {
      // Kinukuha natin ang date pero kailangan i-adjust sa timezone
      // para maiwasan na maging "previous day" ito.
      const date = new Date(value);
      const userTimezoneOffset = date.getTimezoneOffset() * 60000;
      const localDate = new Date(date.getTime() + userTimezoneOffset);

      // I-update ang mga input fields
      this.year = localDate.getFullYear().toString();
      this.month = (localDate.getMonth() + 1).toString().padStart(2, '0');
      this.day = localDate.getDate().toString().padStart(2, '0');

      // I-trigger ang update sa ngModel
      this.onDateChange();
    }
  }
}
