import { Component, forwardRef, Input, OnInit, Output } from '@angular/core';
import { HeaderService } from '../../../core/services/header/header.service';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-itemcard',
  imports: [FormsModule, TitleCasePipe],
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
export class Itemcard implements ControlValueAccessor {
  @Input() itemTitle: string = 'Item Title';
  @Input() isEditing: boolean = false;
  @Input() type!: string;

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

    this.originalValue = value;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  onValueChange(newValue: string | number): void {
    this.internalValue = newValue;
    this.onChange(this.internalValue);
    this.onTouched();

    console.log("Item Card Side");
    console.log(`Internal Value: ${this.internalValue}`);
    console.log(`Original Value: ${this.originalValue}`);

    if (this.originalValue != newValue) {
      this.headerService.notifyValueChanged(this.itemTitle, true);
    } else {
      this.headerService.notifyValueChanged(this.itemTitle, false);
    }
  }


}
