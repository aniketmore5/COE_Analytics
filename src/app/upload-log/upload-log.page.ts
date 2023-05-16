import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-upload-log',
  templateUrl: './upload-log.page.html',
  styleUrls: ['./upload-log.page.scss'],
})
export class UploadLogPage implements OnInit {

  log_value: any;

  constructor(private http: HttpClient,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,) { 
      this.log()
    }

  ngOnInit() {
  }

  async log() {
  
    this.http.get(environment.API + '/upload_log').subscribe(
      (dbs) => {
        console.log(dbs);
        this.log_value = dbs['result'];
        this.log_value.forEach(record => {
          record.CaptureDate = new Date(record.CaptureDate).toLocaleString()
        });
        console.log(this.log_value);
      },
      async (error) => {
        console.log(error);
      }
    );
  }

}
