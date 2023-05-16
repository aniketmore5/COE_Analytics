import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UploadLogPage } from './upload-log.page';

const routes: Routes = [
  {
    path: '',
    component: UploadLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UploadLogPageRoutingModule {}
