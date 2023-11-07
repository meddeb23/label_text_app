import { Component, ElementRef, ViewChild } from '@angular/core';
import {
  Action,
  ActionTypes,
  CurrentDocument,
  Label,
  LabelledText,
} from './models';
import { test_document } from './data/testDocument';
import { ModalComponent } from './components/modal/modal.component';
import { FileUploadService } from './services/file-upload.service';
import { DocumentUpdateService } from './services/document-update.service';
import { LabelsManagementService } from './services/labels-management.service';
import { SegmentManagementService } from './services/segment-management.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  constructor(
    private labelManagerService: LabelsManagementService,
    private segmentMangerService: SegmentManagementService,
    private documentService: DocumentUpdateService
  ) {}

  @ViewChild(ModalComponent) modalComponent!: ModalComponent;
  @ViewChild('textContainer') textContainer!: ElementRef;
  save_progress_status: null | string = null;
  openNewLabelModal = false;
  docs: CurrentDocument[] = [];
  document: CurrentDocument = {
    id: null,
    content: '',
    labels: [],
    title: '',
  };
  labels: Label[] = [];
  selectedLabel: Label | null = null;
  hisotry: { pointer: number; actions: Action[] } = {
    pointer: -1,
    actions: [],
  };

  ngOnInit() {
    this.labelManagerService.getLabels().subscribe({
      next: (res) => {
        this.labels = res;
      },
      error: (err) => console.log(err),
    });
    this.documentService.getDocuments().subscribe({
      next: (res) => {
        this.docs = res;
      },
      error: (err) => console.log(err),
    });
  }

  addAction(segment: LabelledText) {
    this.hisotry.actions.push({ action: 'Add', label: segment });
    this.hisotry.pointer++;
  }

  undo() {
    if (
      this.hisotry.pointer < 0 ||
      this.hisotry.pointer >= this.hisotry.actions.length
    )
      return;
    const segment = this.hisotry.actions[this.hisotry.pointer];
    if (segment.action === 'Add') this.deleteSegment(segment.label);
    else if (segment.action === 'delete') this.addSegment(segment.label);
    this.hisotry.pointer--;
  }
  redo() {
    if (this.hisotry.pointer + 1 >= this.hisotry.actions.length) return;
    const segment = this.hisotry.actions[this.hisotry.pointer + 1];
    if (segment.action === 'Add') this.addSegment(segment.label);
    else if (segment.action === 'delete') this.deleteSegment(segment.label);
    this.hisotry.pointer++;
  }

  onOpenNewLabelModal() {
    this.modalComponent.exposeOpenModal();
  }

  handleAddLabelEvent(label: Label): void {
    this.labels.push(label);
  }

  onTextSelection(segmentStart: number) {
    const selection = getSelection();
    const selectionText = selection?.toString();
    const anchorOffset = selection?.anchorOffset;
    const focusOffset = selection?.focusOffset;
    const notSameNode = selection?.anchorNode !== selection?.focusNode;
    const cantSelect =
      anchorOffset === undefined ||
      focusOffset === undefined ||
      !selectionText ||
      !this.selectedLabel ||
      notSameNode;
    console.log(
      selectionText,
      anchorOffset,
      focusOffset,
      notSameNode,
      cantSelect
    );
    if (cantSelect) return;
    const startIndex = Math.min(anchorOffset, focusOffset) + segmentStart;
    const endIndex = Math.max(anchorOffset, focusOffset) + segmentStart;

    const labelledText: LabelledText = {
      id: 1,
      start: Math.max(startIndex, 0),
      end: endIndex,
      label: this.selectedLabel as Label,
      text: selectionText,
    };

    this.addSegment(labelledText);
    this.addToHisotry(labelledText, 'Add');
    // selection.collapseToEnd();
  }

  selectLabel(label: Label): void {
    this.selectedLabel = label;
  }

  getLabelledText(): {
    start: number;
    text: string;
    label: LabelledText | null;
  }[] {
    const sortedLabels = this.document.labels.sort((a, b) => a.start - b.start);
    const originalText = this.document.content;
    const textToDisplay: {
      start: number;
      text: string;
      label: LabelledText | null;
    }[] = [];
    var currenIndex = 0;
    sortedLabels.forEach((i) => {
      if (i.start !== currenIndex) {
        var normalText = originalText.slice(currenIndex, i.start);
        textToDisplay.push({
          start: currenIndex,
          text: normalText,
          label: null,
        });
      }
      const labelledText = originalText.slice(i.start, i.end + 1);
      textToDisplay.push({ start: i.start, text: labelledText, label: i });
      currenIndex = i.end + 1;
    });
    const restOfText = originalText.slice(currenIndex, originalText.length);
    textToDisplay.push({ start: currenIndex, text: restOfText, label: null });
    return textToDisplay;
  }

  deleteLabel(label: Label) {
    this.document.labels = this.document.labels.filter(
      (i) => i.label.text !== label.text
    );
    this.labels = this.labels.filter((i) => i.text !== label.text);
  }

  handleDeleteSegment(segment: LabelledText | null) {
    if (!segment) return;
    this.deleteSegment(segment);
    this.addToHisotry(segment, 'delete');
  }

  deleteSegment(segment: LabelledText) {
    if (!this.document.id) return;

    this.segmentMangerService
      .deleteLabelledText(segment, this.document.id)
      .subscribe({
        next: () => (this.save_progress_status = 'changes saved'),
        error: () => (this.save_progress_status = 'changes not saved'),
      });
    this.document.labels = this.document.labels.filter(
      (i) => i.start !== segment.start
    );
  }

  addSegment(segment: LabelledText) {
    const shouldNotBeLabelled: boolean = !!this.document.labels.find(
      (i) => !(i.end <= segment.start || i.start >= segment.end)
    );
    if (shouldNotBeLabelled) return;
    if (!this.document.id) return;
    this.segmentMangerService
      .addLabel({
        ...segment,
        document_id: this.document.id,
      })
      .subscribe({
        next: () => (this.save_progress_status = 'changes saved'),
        error: () => (this.save_progress_status = 'changes not saved'),
      });
    this.document.labels.push(segment);
  }
  addToHisotry(segment: LabelledText, action: ActionTypes) {
    this.unvalidateHisotry();
    this.hisotry.actions.push({ label: segment, action });
    this.hisotry.pointer++;
  }
  unvalidateHisotry() {
    this.hisotry.actions = this.hisotry.actions.slice(
      0,
      this.hisotry.pointer + 1
    );
  }
  selectDoc(doc: CurrentDocument) {
    this.document = doc;
  }
}
