import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';
import { IonicSelectableModule } from 'ionic-selectable';
import { HomePageRoutingModule } from './home-routing.module';
import { AuthPage } from '../auth/auth.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    IonicSelectableModule
  ],
  declarations: [HomePage],
  providers:[AuthPage]
})
export class HomePageModule {}
