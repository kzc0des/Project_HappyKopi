import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { HeaderService } from '../../../core/services/header/header.service';

@Component({
  selector: 'app-toggle-button',
  imports: [CommonModule],
  templateUrl: './toggle-button.html',
  styleUrl: './toggle-button.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleButton),
      multi: true,
    },
  ],
})
export class ToggleButton {
  @Input() itemTitle!: string;
  _isOn: boolean = false;
  isDisabled: boolean = false;

  originalValue!:boolean;

  constructor(private headerService: HeaderService) {}

  private onChange: (value: boolean) => void = () => { };
  private onTouched: () => void = () => { };

  writeValue(value: boolean): void {
    this._isOn = !!value;

    this.originalValue = !!value;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  toggle(newValue: boolean) {
    if (this.isDisabled) {
      return;
    }
    this._isOn = !this._isOn;
    this.onChange(this._isOn);
    this.onTouched();

    console.log("Toggle Button Side");
    console.log(`Internal Value: ${this._isOn}`);
    console.log(`Original Value: ${this.originalValue}`);
    

    if (this.originalValue != newValue) {
      this.headerService.notifyValueChanged(this.itemTitle, true);
    } else {
      this.headerService.notifyValueChanged(this.itemTitle, false);
    }
  }
}
