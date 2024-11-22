import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-button',
  standalone: true,
  imports: [],
  templateUrl: './custom-button.component.html',
  styleUrl: './custom-button.component.css'
})
export class CustomButtonComponent {
  @Input() buttonText = '';
  @Input() formValid = false;

  @Output() onButtonClick: EventEmitter<boolean> = new EventEmitter<boolean>();

  emitButtonClick() {
    this.onButtonClick.emit(true); // Emit true (or whatever you prefer)
  }
}
