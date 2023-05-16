import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DownloadDashboardPage } from './download-dashboard.page';

const routes: Routes = [
  {
    path: '',
    component: DownloadDashboardPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DownloadDashboardPageRoutingModule {}
