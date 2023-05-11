import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.css'],
})
export class CustomDialogComponent {
  @Input() title!: string;
  @Input() message!: string;
  @Output() onYesClick: EventEmitter<boolean> = new EventEmitter();
  @Output() onNoClick: EventEmitter<boolean> = new EventEmitter();
}
