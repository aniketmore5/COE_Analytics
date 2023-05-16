import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TableLogPage } from './table-log.page';

const routes: Routes = [
  {
    path: '',
    component: TableLogPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TableLogPageRoutingModule {}
