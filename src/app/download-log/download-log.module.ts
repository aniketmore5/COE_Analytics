import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DownloadLogPageRoutingModule } from './download-log-routing.module';

import { DownloadLogPage } from './download-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DownloadLogPageRoutingModule
  ],
  declarations: [DownloadLogPage]
})
export class DownloadLogPageModule {}
