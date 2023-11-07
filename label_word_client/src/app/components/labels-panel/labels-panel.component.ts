import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Label } from 'src/app/models';
import { LabelsManagementService } from 'src/app/services/labels-management.service';

@Component({
  selector: 'app-labels-panel',
  templateUrl: './labels-panel.component.html',
  styleUrls: ['./labels-panel.component.css'],
})
export class LabelsPanelComponent {
  constructor(private labelManagerService: LabelsManagementService) {}

  @Input() labels!: Label[];
  @Input() selectedLabel!: Label | null;
  @Output() selectLabel: EventEmitter<Label> = new EventEmitter<Label>();
  @Output() deleteLabel: EventEmitter<Label> = new EventEmitter<Label>();

  handleSelectLabel(label: Label) {
    this.selectLabel.emit(label);
  }

  onDeleteLabel(label: Label) {
    this.labelManagerService.deleteLabel(label).subscribe({
      next: () => {
        console.log(label, 'successfully delete');
        this.deleteLabel.emit(label);
      },
      error: () => {
        console.log('error deleting the label', label);
      },
    });
  }
}
