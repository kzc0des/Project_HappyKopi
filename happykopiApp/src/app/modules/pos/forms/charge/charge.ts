import { Component } from '@angular/core';
import { Header } from '../../../../shared/components/header/header';
import { YellowButton } from '../../../../shared/components/yellow-button/yellow-button';
import { TextBoxPrice } from '../../../../shared/components/text-box-price/text-box-price';

@Component({
  selector: 'app-charge',
  imports: [Header, YellowButton, TextBoxPrice],
  templateUrl: './charge.html',
  styleUrl: './charge.css'
})
export class Charge {

}
