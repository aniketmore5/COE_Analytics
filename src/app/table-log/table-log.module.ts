import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TableLogPageRoutingModule } from './table-log-routing.module';

import { TableLogPage } from './table-log.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TableLogPageRoutingModule
  ],
  declarations: [TableLogPage]
})
export class TableLogPageModule {}
