import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UploadLogPageRoutingModule } from './upload-log-routing.module';

import { UploadLogPage } from './upload-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    UploadLogPageRoutingModule
  ],
  declarations: [UploadLogPage]
})
export class UploadLogPageModule {}
