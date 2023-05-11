import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-custom-dialog',
  templateUrl: './custom-dialog.component.html',
  styleUrls: ['./custom-dialog.component.css'],
})
export class CustomDialogComponent {
  @Input() title!: string;
  @Input() message!: string;
  @Input() showReasonInput = false;
  @Output() onYesClick = new EventEmitter<{
    confirmed: boolean;
    reason?: string;
  }>();
  @Output() onNoClick = new EventEmitter<{
    confirmed: boolean;
    reason?: string;
  }>();

  reason: string | undefined;

  onReasonChanged(reason: string) {
    this.reason = reason;
  }

  onYesButtonClicked() {
    this.onYesClick.emit({ confirmed: true, reason: this.reason });
  }

  onNoButtonClicked() {
    this.onNoClick.emit({ confirmed: false, reason: this.reason });
  }
}
