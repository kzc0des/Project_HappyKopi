import { Component, ElementRef, forwardRef, HostListener, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DropdownOption } from './dropdown-option';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { HeaderService } from '../../../core/services/header/header.service';

@Component({
  selector: 'app-dropdown-button',
  imports: [TitleCasePipe],
  templateUrl: './dropdown-button.html',
  styleUrl: './dropdown-button.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DropdownButton),
      multi: true,
    },
  ],
})
export class DropdownButton {
  @Input() options: DropdownOption[] = [];
  @Input() placeholder: string = 'Select an option';
  @Input() selected!: number;

  selectedValue!: number;
  originalValue!: number;
  isOpen = false;
  isDisabled = false;

  private onChange: (value: any) => void = () => { };
  private onTouched: () => void = () => { };

  constructor(private _elementRef: ElementRef, private headerService: HeaderService) { }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this._elementRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  writeValue(value: any): void {
    this.selectedValue = value;
    this.originalValue = this.selected;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  toggleDropdown(): void {
    if (!this.isDisabled) {
      this.isOpen = !this.isOpen;
      this.onTouched();
    }
  }

  selectOption(option: DropdownOption): void {
    if (!this.isDisabled) {
      this.selectedValue = option.value;
      this.onChange(this.selectedValue);
      this.isOpen = false;

      console.log('Dropdown Button Side');
      console.log(`Internal Value: ${this.selectedValue}`);
      console.log(`Original Value: ${this.originalValue}`);

      if (this.originalValue != this.selectedValue) {
        this.headerService.notifyValueChanged(this.placeholder, true);
      } else {
        this.headerService.notifyValueChanged(this.placeholder, false);
      }
    }
  }

  get selectedLabel(): string {
    const selectedOption = this.options.find(opt => opt.value === this.selectedValue);
    return selectedOption ? selectedOption.label : this.placeholder;
  }
}
