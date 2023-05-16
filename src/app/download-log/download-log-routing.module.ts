import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DownloadLogPage } from './download-log.page';

const routes: Routes = [
  {
    path: '',
    component: DownloadLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DownloadLogPageRoutingModule {}
