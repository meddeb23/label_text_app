import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Action, CurrentDocument } from 'src/app/models';
import { DocumentUpdateService } from 'src/app/services/document-update.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css'],
})
export class ControlPanelComponent {
  constructor(
    private documentUpdateService: DocumentUpdateService,
    private fileUploadService: FileUploadService
  ) {}

  @Input() save_progress_status!: null | string;
  @Input() currentDocument!: CurrentDocument;
  @Output() updateTitle: EventEmitter<string> = new EventEmitter<string>();
  @Output() undoEmmitter: EventEmitter<null> = new EventEmitter<null>();
  @Output() redoEmitter: EventEmitter<null> = new EventEmitter<null>();
  @Output() openNewLabelModal: EventEmitter<null> = new EventEmitter<null>();
  @Output() currentDocumentChange: EventEmitter<CurrentDocument> =
    new EventEmitter<CurrentDocument>();

  // updateDocumentTitle(): void {
  //   this.updateTitle.emit(this.currentDocument.title);
  // }
  updateDocumentTitle(): void {
    if (!this.currentDocument.id) return;
    this.documentUpdateService
      .updateDocumentTitle(this.currentDocument.id, this.currentDocument.title)
      .subscribe({
        next: (response) => {
          console.log('Document title updated successfully:', response);
        },
        error: (error) => {
          console.error('Error updating document title:', error);
        },
      });
  }

  onFileSelected(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const file: File = (inputElement.files as FileList)[0];

    if (file) {
      this.fileUploadService.uploadFile(file).subscribe({
        next: (response) => {
          console.log('Upload successful:', response);
          const newDocument = {
            id: response.id,
            content: response.content,
            title: response.title,
            labels: [],
          };
          inputElement.value = '';
          this.currentDocumentChange.emit(newDocument);
        },
        error: (error) => {
          console.error('Upload failed:', error);
        },
      });
    }
  }

  exportDocument() {
    if (!this.currentDocument.id) return;

    this.documentUpdateService
      .exportDocument(this.currentDocument.id)
      .subscribe({
        next: (res) => {
          const blob = new Blob([res], { type: 'application/octet-stream' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = this.currentDocument.title + '_labelled.json'; // Set the desired file name with extension
          link.click();
          window.URL.revokeObjectURL(url);
        },
      });
  }

  redo(): void {
    this.redoEmitter.emit();
  }
  undo(): void {
    this.undoEmmitter.emit();
  }
  onOpenNewLabelModal(): void {
    this.openNewLabelModal.emit();
  }
}
