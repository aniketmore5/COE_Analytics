import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../storage-service.service';

import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  serverName:String = "";
  userName: String = "";
  serverPassword: String = "";

  constructor(private http: HttpClient, 
    private router: Router,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private storageService: StorageService) { }

ngOnInit() {
}
  async presentAlertConfirm(msg: string, head:string, isSuccess: boolean) {
    const alert = await this.alertController.create({
      mode: 'ios',
      header: head,
      message: msg,
      buttons: [
        {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            if(isSuccess == true){
              this.router.navigate(['choose-options'])
            }
            if(isSuccess == false){
              console.log("Cancelled");
              
            }
          }
        }
      ]
    });
  
    await alert.present();
  }

  async onSubmit(){
    console.log(this.serverName.trim());

    let loading = await this.loadingController.create({
      message: "Connecting to your database...",
      mode: 'ios',
      spinner: 'lines',
      duration: 3000
    })

    await loading.present();
    let body = {
      host: this.serverName,
      user: this.userName,
      password: this.serverPassword,
    }
    this.http.post("http://localhost:3000/connection", body).subscribe(async (data)=>{
      
      if(this.serverName.trim() == '192.168.180.30\\analyticsdv2' && this.userName.trim() == 'anikmore' && this.serverPassword.trim() == 'Password123'){
      await loading.dismiss();
      this.storageService.store();
      this.presentAlertConfirm("The Verification is Successfull", "Authenticated!", true);
      }

      if(this.serverName.trim() != '192.168.180.30\\analyticsdv2' || this.userName.trim() != 'anikmore' || this.serverPassword.trim() != 'Password123'){
        await loading.dismiss();
        this.presentAlertConfirm("Please Enter the Login credentials ", "Verification Error!", false);
        }
        console.log(body.user)
    }, async(error) =>{
      console.log(error);
      console.log('192.168.180.30\\analyticsdv2')
      await loading.dismiss();

    this.presentAlertConfirm("The Verification is Unsuccessful", "Verification Error!", false);
      
    })

  }
  nameEvent(event){
    this.userName=event.detail.value;
    let val: string;
    val=String(this.userName);
    localStorage.setItem('userName',val);
  }
}
