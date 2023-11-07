import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ModalComponent } from './components/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ControlPanelComponent } from './components/control-panel/control-panel.component';
import { LabelsPanelComponent } from './components/labels-panel/labels-panel.component';

@NgModule({
  declarations: [AppComponent, ModalComponent, ControlPanelComponent, LabelsPanelComponent],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
