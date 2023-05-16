import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-download-dashboard',
  templateUrl: './download-dashboard.page.html',
  styleUrls: ['./download-dashboard.page.scss'],
})
export class DownloadDashboardPage implements OnInit {
  dashboard: any;
  ID: any;
  userName: any;
  databaseName: any;
  schemaName: any;
  tableDetails: any;
  captureDate: any;
  saveName: any;
  directory: any;
  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,) {
    this.getDashboard()
   
    // this.postDashboard() }
  }
  ngOnInit() {
   
  }
  async getDashboard() {
    this.http.get(environment.API + '/dashboard').subscribe(
      (dbs) => {
        console.log(dbs);
        this.dashboard = dbs['result'];
        this.dashboard.forEach(record => {
          record.CaptureDate = new Date(record.CaptureDate).toLocaleString()
          record.directory=this.getDirectory(record.ID)
        });
        
      },
      async (error) => {
        console.log(error);
      }
    );
  }

  async presentAlertConfirm(msg: string, head: string, isSuccess: boolean) {
    const alert = await this.alertController.create({
      mode: 'ios',
      header: head,
      message: msg,
      buttons: [
         {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            if (isSuccess == true) {
              this.router.navigate(['/download-dashboard'])
            }
            if (isSuccess == false) {
              console.log("Cancelled");

            }
          }
        }
      ]
    });

    await alert.present();
  }

  async download(id: Number) {
    let record = this.dashboard.find(each => each.ID == id);
    let isSingle = (record.TableDetails.split(",").length === 1);
    let loading = await this.loadingController.create({
      message: 'Downloading',
      mode: 'ios',
      spinner: 'lines',

    });
    console.log(record)
    await loading.present();

    this.http
      .post(environment.API + `/${record.Format}/` + (isSingle ? "" : "multi"), {
        dbname: record.DatabaseName,
        schema: record.SchemaName,
        tablename: record.TableDetails,
        separator: record.Seperator,
        fileType: record.Format,
        qualifier: record.Qualifier,
        user: localStorage.getItem("user"),
        directory: record.directory
      })
      .subscribe(
        async (file) => {
          await loading.dismiss();
          this.presentAlertConfirm(Object.values(file).toString(), "Download Completed!", true);
        },
        async (error) => {
          await loading.dismiss();
          this.presentAlertConfirm(error.error.message, "Download Failed", false);
        }
      );
  }

  directoryEvent(event,i:number){
   
    this.directory[i] = event.detail.value

  }
  async getDirectory(i:number) {
    
    this.http.get(environment.API + '/directory').subscribe(
      (dbs) => {
        
        //console.log(dbs['results']);
        this.dashboard.forEach(record => {
         
          record.directory = dbs['results'];
        }); 

      },

      async (error) => {

        console.log(error);

      }

    );

  }
}