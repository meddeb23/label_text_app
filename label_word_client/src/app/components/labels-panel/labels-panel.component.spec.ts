import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LabelsPanelComponent } from './labels-panel.component';

describe('LabelsPanelComponent', () => {
  let component: LabelsPanelComponent;
  let fixture: ComponentFixture<LabelsPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LabelsPanelComponent]
    });
    fixture = TestBed.createComponent(LabelsPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
