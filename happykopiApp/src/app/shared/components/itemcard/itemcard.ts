import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HeaderService } from '../../../core/services/header/header.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-itemcard',
  imports: [],
  templateUrl: './itemcard.html',
  styleUrl: './itemcard.css'
})
export class Itemcard implements OnInit {
  @Input() itemTitle: string = 'Item Title';
  @Input() value: string | number = '';
  @Input() isEditing: boolean = false;
  @Output() valueChange = new EventEmitter<string>();

  originalValue!: string | number;
  constructor(private headerService: HeaderService) {
  }

  ngOnInit(): void {
    this.originalValue = this.value;
  }

  onValueChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);

    if (this.originalValue != target.value) {
      this.headerService.notifyValueChanged(true);
    }else {
      this.headerService.notifyValueChanged(false);
    }
  }
}
