import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { viewPage } from './view.page';

const routes: Routes = [
  {
    path: '',
    component: viewPage,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewRoutingModule {}