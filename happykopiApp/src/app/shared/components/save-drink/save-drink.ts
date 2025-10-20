import { Component } from '@angular/core';

@Component({
  selector: 'app-save-drink',
  templateUrl: './save-drink.html',
  styleUrls: ['./save-drink.css']
})
export class SaveDrinkComponent {

  // Function to handle the Save Drink button click
  onSaveDrink(): void {
    console.log('Drink has been saved.');
    alert('Your drink has been saved successfully!');
  }

}
