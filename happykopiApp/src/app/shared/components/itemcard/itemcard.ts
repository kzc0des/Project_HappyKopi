import { Component, forwardRef, Input, OnInit, Output } from '@angular/core';
import { HeaderService } from '../../../core/services/header/header.service';
import { Subscription } from 'rxjs';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-itemcard',
  imports: [FormsModule],
  templateUrl: './itemcard.html',
  styleUrl: './itemcard.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => Itemcard),
      multi: true
    }
  ]
})
export class Itemcard implements OnInit, ControlValueAccessor {
  @Input() itemTitle: string = 'Item Title';
  @Input() isEditing: boolean = false;

  internalValue: string | number = '';
  private originalValue!: string | number;

  constructor(private headerService: HeaderService) {
  }

  onChange: (value: any) => void = () => { };
  onTouched: () => void = () => { };

  writeValue(value: any): void {
    if (value !== undefined) {
      this.internalValue = value;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  ngOnInit(): void {
    this.originalValue = this.internalValue;
  }

  onValueChange(newValue: string | number): void {
    this.internalValue = newValue;
    this.onChange(this.internalValue);
    this.onTouched();

    if (this.originalValue != newValue) {
      this.headerService.notifyValueChanged(true);
    } else {
      this.headerService.notifyValueChanged(false);
    }
  }


}
