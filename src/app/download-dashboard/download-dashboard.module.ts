import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DownloadDashboardPageRoutingModule } from './download-dashboard-routing.module';

import { DownloadDashboardPage } from './download-dashboard.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DownloadDashboardPageRoutingModule,
  ],
  declarations: [DownloadDashboardPage]
})
export class DownloadDashboardPageModule {}
