import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { Label } from 'src/app/models';
import { LabelsManagementService } from 'src/app/services/labels-management.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css'],
})
export class ModalComponent {
  @ViewChild('myModal') modal!: ElementRef;

  constructor(
    private renderer: Renderer2,
    private labelManagerService: LabelsManagementService
  ) {}
  @Output() onAddLabel: EventEmitter<Label> = new EventEmitter();
  text: string = '';
  color: string = '';

  openModal(): void {
    this.renderer.setStyle(this.modal.nativeElement, 'display', 'block');
  }

  closeModal(): void {
    this.renderer.setStyle(this.modal.nativeElement, 'display', 'none');
  }

  // Expose the openModal method as part of the component's public API
  public exposeOpenModal(): void {
    this.openModal();
  }
  onSubmit() {
    if (!this.text) {
      alert('Please add a label!');
      return;
    } else if (!this.color) {
      alert('Please add a color to the label!');
      return;
    }

    this.labelManagerService.addLabel(this.color, this.text).subscribe({
      next: (res) => {
        const newTask: Label = res;
        this.onAddLabel.emit(newTask);

        this.text = '';
        this.color = '';
        this.closeModal();
      },
      error: (err) => console.error(err),
    });
  }
}
