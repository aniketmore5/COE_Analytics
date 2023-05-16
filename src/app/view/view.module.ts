import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { viewPage } from './view.page';
import { ViewRoutingModule } from './view-routing.module';
import { ReactiveFormsModule } from "@angular/forms";
import { SelectAllWithButtonDirective } from './select-all-with-button-directive';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ViewRoutingModule,
    ReactiveFormsModule,
   
  ],
  
  declarations: [viewPage,SelectAllWithButtonDirective]
})
export class ViewModule {}