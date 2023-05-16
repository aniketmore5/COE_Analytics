// import { AlertController, LoadingController } from '@ionic/angular';
// import { HttpClient } from '@angular/common/http';
// import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
// import { environment } from 'src/environments/environment';
// import { Router } from '@angular/router';
// import { FormGroup } from '@angular/forms';


// @Component({
//   selector: 'app-home',
//   templateUrl: 'home.page.html',
//   styleUrls: ['home.page.scss'],
// })

// export class HomePage implements OnInit {

//   databases: any[] = [];
//   tables: any[] = [];
//   views: any[] = [];
//   public myForm: FormGroup;

//   handlerMessage = '';

//   @ViewChild('btn', { static: false }) btn: ElementRef;
//   selectedDatabase: any = '';
//   selectedTable: any = '';
//   selectedSeparator: any = '';
//   selectedFileType: any = '';
//   qualifier: any = '';
//   saveName: any = '';
  
//   isSingle: boolean = false;
//   isSeparator: boolean = false;
//   isQualifier: boolean = false;
//   isOthers: boolean = false;
//   isSave:boolean = false;
//   showSearchBar = false;
//   schemas: any = '';
//   selectedSchema: any ='';
//   directory: any = '';

//   constructor(
//     private http: HttpClient,
//     private alertController: AlertController,
//     private router: Router,
//     private loadingController: LoadingController,

//   )

//   {
  
//     this.getAllDatabases();
//     this.getDirectory();
    
//   }

//   ngOnInit(){

//   }

//   async presentAlertConfirm(msg: string, head: string, isSuccess: boolean) {
    
//     const alert = await this.alertController.create({
//       mode: 'ios',
//       header: head,
//       message: msg,
//       buttons: [
//         {
//           text: 'Okay',
//           handler: () => {
//             console.log('Confirm Okay');
            
//             if (isSuccess == true) {
//               this.router.navigate(['home'])
//             }
            
//             if (isSuccess == false) {
//               console.log("Cancelled");

//             }

//           }

//         }
//       ]

//     });

//     await alert.present();

//   }

//   DatabaseSelectEvent(event) {

//     this.selectedDatabase = event.detail.value;
//     this.selectedSchema = '';
//     this.selectedTable = '';
//     this.getAllSchemas();

//   }

//   SchemaSelectEvent(event){

//     this.selectedSchema = event.detail.value;
//     this.selectedTable = '';
//     this.getAllTablesByDatabase();   

//   }

//   tableSelectEvent(ev) {

//     this.selectedTable = ev.value;
//     const fileLength = ev.value.length;
//     this.isSingle = fileLength === 1;   


//   }

//   fileTypeEvent(event) {
    
//     this.selectedFileType = event.detail.value;

//     let value = event.detail.value;

//     if (value == 'txt') {

//       this.isSeparator = true;
//       this.isQualifier = true;
//       return;

//     }

//     if (value == 'tsv') {

//       this.isQualifier = true;
//       return;

//     }

//     if (value == 'csv') {

//       this.isQualifier = true;
//       return;

//     }

//   }

//   seperatorTypeEvent(event) {

//     this.selectedSeparator = event.detail.value;

//     let value = event.detail.value;

//     if (value == 'Others') {

//       this.isOthers = true;
//       return;

//     }

//     else{
      
//       this.isOthers = false;

//     }

//   }

//   otherSeparatorEvent(event) {

//     this.selectedSeparator = event.detail.value;

//   }

//   qualifierEvent(event) {

//     this.qualifier = event.detail.value;

//   }

//   directoryEvent(event){
   
//     this.directory = event.detail.value

//   }

//   async back(){

//     window.location.reload();

//   } 
 
//   async presentAlert() {

//     const alert = await this.alertController.create({
//       header: 'Please Select the Database!',

//       buttons: [
//         {
//           text: 'OK',
//           role: 'confirm',
        
//           handler: () => {
//             this.handlerMessage = 'Please provide all the required values';

//           },

//         },

//       ],

//     });

//     await alert.present();

//   }

//   async save(){

//     if(this.selectedDatabase == '' && this.selectedSchema == '' &&
//       this.selectedTable == '' && this.selectedFileType==  ''){

//       this.presentAlert();
//       return false;

//     }

//     if(this.selectedDatabase == ''){

//       this.presentAlertConfirm("Please Select the Database!","ALERT",false);
//       return;

//     } 

//     if(this.selectedSchema == ''){

//       this.presentAlertConfirm("Please Select the Schema!","ALERT",false);
//       return;

//     } 

//     if(this.selectedTable == ''){
    
//       this.presentAlertConfirm("Please Select alteast one table!","ALERT",false);
//       return;

//     } 

//     if(this.selectedFileType == ''){
    
//       this.presentAlertConfirm("Please Select the File Format!","ALERT",false);
      
//       return;
//     } 

//     const alerts = await this.alertController.create({
//       header: 'Please enter the Configuration Name',
   
//       inputs: [
//         {
//           name: 'Name',
//           placeholder:'Name'
//         }
//       ],

//       buttons: [
//         {
//           text: 'Cancel',
//           role: 'cancel',
//           cssClass: 'secondary',
        
//           handler: () => {
//             console.log('Confirm Cancel');
//             this.isSave = false;
//           }

//         },

//         {
//           text:'OK',
//           handler:(value)=>{
//             this.isSave = true;
//             this.saveName=value.Name;

//             if(this.saveName == ''){
          
//               this.presentAlertConfirm("Please give a name!","ALERT",false);
//               return;
//             } 
             
//             this.onDownload();
//           }

//         }
//       ],
    
//     });

//     await alerts.present();
 
//   }


//   async onDownload() {

//     if(this.selectedDatabase == '' && this.selectedSchema == '' &&
//       this.selectedTable == '' && this.selectedFileType==  ''){
      
//       this.presentAlert();
//       return false;

//     }

//     if(this.selectedDatabase == ''){
    
//       this.presentAlertConfirm("Please Select the Database!","ALERT",false);
//       return;

//     } 

//     if(this.selectedSchema == ''){
      
//       this.presentAlertConfirm("Please Select the Schema!","ALERT",false);
//       return;

//     } 

//     if(this.selectedTable == ''){
      
//       this.presentAlertConfirm("Please Select alteast one table!","ALERT",false);
//       return;

//     } 

//     if(this.selectedFileType == ''){
      
//       this.presentAlertConfirm("Please Select the File Format!","ALERT",false);
//       return;

//     } 

//     {
//       let loading = await this.loadingController.create({
//         message: 'Downloading',
//         mode: 'ios',
//         spinner: 'lines',
//       });
      
//       await loading.present();

//       if (this.isSingle == true) {

//         console.log('Sending single ' + this.selectedTable);
//         console.log(this.selectedTable)

//         this.http
//         .post(environment.API + `/${this.selectedFileType}/`, {
//           dbname: this.selectedDatabase,
//           schema: this.selectedSchema,
//           tablename: this.selectedTable,
//           separator: this.selectedSeparator,
//           fileType: this.selectedFileType,
//           qualifier: this.qualifier,
//           userName:localStorage.getItem("userName"),
//           saveName:this.saveName,
//           isSave:this.isSave,
//           directory:this.directory
//         })
//         .subscribe(
//           async (file) => {
            
//             await loading.dismiss();

//             this.presentAlertConfirm(Object.values(file).toString(), "Download Completed!", true);

//           },

//           async (error) => {
//             console.log(error);

//             await loading.dismiss();

//             this.presentAlertConfirm(error.error.message, "Download Incomplete", false); 

//           }

//         );
     
//       }

//       if (this.isSingle == false) {
//         console.log('Sending Multiple ' + this.selectedTable);
    
//         this.http
//         .post(environment.API + `/${this.selectedFileType}/multi`, {
//           dbname: this.selectedDatabase,
//           schema: this.selectedSchema,
//           tablename: this.selectedTable.toString(),
//           separator: this.selectedSeparator,
//           fileType: this.selectedFileType,
//           qualifier: this.qualifier,
//           userName:localStorage.getItem("userName"),
//           saveName:this.saveName,
//           isSave:this.isSave,
//           directory:this.directory
//         })
//         .subscribe(
//           async (file) => {

//             await loading.dismiss();

//             this.presentAlertConfirm(Object.values(file).toString(), "Download Completed!", true);

//           },
          
//           async (error) => {
            
//             console.log(error);
            
//             await loading.dismiss();
            
//             this.presentAlertConfirm(error.error.message, "Download Failed", false);     

//           }

//         );

//         return;      
//       }

//     }

//   }

//   public showSearch() {

//     this.showSearchBar = !this.showSearchBar;

//   }

//   async getAllDatabases() {
    
//     this.http.get(environment.API + '/databases').subscribe(
//       (dbs) => {
        
//         console.log(dbs['results']);
//         this.databases = dbs['results'];

//       },

//       async (error) => {

//         console.log(error);

//       }

//     );

//   }

//   async getAllSchemas() {
    
//     this.http.post(environment.API + '/schema', { dbname: this.selectedDatabase })
//     .subscribe(
//       (dbs) => {

//         console.log(dbs);
//         this.schemas = dbs['result'];

//       },

//       async (error) => {

//         console.log(error);

//       }

//     );

//   }


//   async getAllTablesByDatabase() {
  
//     this.http.post(environment.API + '/database', { dbname: this.selectedDatabase,schema:this.selectedSchema })
//     .subscribe(
//       (dbs) => {

//         this.tables = dbs['result'];

//       },

//       async (error) => {
          
//         console.log(error);

//       }

//     );
     
//   }

//   async getDirectory() {
    
//     this.http.get(environment.API + '/directory').subscribe(
//       (dbs) => {
        
//         //console.log(dbs['results']);
//         this.directory = dbs['results'];

//       },

//       async (error) => {

//         console.log(error);

//       }

//     );

//   }

// }





import { AlertController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})

export class HomePage implements OnInit {

  databases: any[] = [];
  tables: any[] = [];
  views: any[] = [];

  handlerMessage = '';

  @ViewChild('btn', { static: false }) btn: ElementRef;
  selectedDatabase: any = '';
  selectedTable: any = '';
  selectedSeparator: any = '';
  selectedFileType: any = '';
  qualifier: any = '';
  saveName: any = '';
  isSubmitted:boolean=false;
  isSingle: boolean = false;
  isSeparator: boolean = false;
  isQualifier: boolean = false;
  isOthers: boolean = false;
  isSave:boolean = false;
  showSearchBar = false;
  schemas: any = '';
  selectedSchema: any ='';
  directory: any = '';

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,

  )

  {
  
    this.getAllDatabases();
    this.getDirectory();
    
  }

  ngOnInit(){

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
              this.router.navigate(['home'])
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

  DatabaseSelectEvent(event) {

    this.selectedDatabase = event.detail.value;
    this.selectedSchema = '';
    this.selectedTable = '';
    this.getAllSchemas();

  }

  SchemaSelectEvent(event){

    this.selectedSchema = event.detail.value;
    this.selectedTable = '';
    this.getAllTablesByDatabase();   

  }

  tableSelectEvent(ev) {

    this.selectedTable = ev.value;
    const fileLength = ev.value.length;
    this.isSingle = fileLength === 1;   


  }

  fileTypeEvent(event) {
    
    this.selectedFileType = event.detail.value;

    let value = event.detail.value;

    if (value == 'txt') {

      this.isSeparator = true;
      this.isQualifier = true;
      return;

    }

    if (value == 'tsv') {

      this.isQualifier = true;
      return;

    }

    if (value == 'csv') {

      this.isQualifier = true;
      return;

    }

  }

  seperatorTypeEvent(event) {

    this.selectedSeparator = event.detail.value;

    let value = event.detail.value;

    if (value == 'Others') {

      this.isOthers = true;
      return;

    }

    else{
      
      this.isOthers = false;

    }

  }

  otherSeparatorEvent(event) {

    this.selectedSeparator = event.detail.value;

  }

  qualifierEvent(event) {

    this.qualifier = event.detail.value;

  }

  directoryEvent(event){
   
    this.directory = event.detail.value

  }

  async back(){

    window.location.reload();

  } 
 
  async presentAlert() {

    const alert = await this.alertController.create({
      header: 'Please provide all the required values!',

      buttons: [
        {
          text: 'OK',
          role: 'confirm',
        
          handler: () => {
            this.handlerMessage = 'Please provide all the required values';

          },

        },

      ]

    });

    await alert.present();

  }

  async save(){
this.isSubmitted=true;
    if(this.selectedDatabase == '' && this.selectedSchema == '' &&
      this.selectedTable == '' && this.selectedFileType==  ''){

      this.presentAlert();
      return false;

    }

    if(this.selectedDatabase == ''){

      this.presentAlertConfirm("Please Select the Database!","ALERT",false);
      return;

    } 

    if(this.selectedSchema == ''){

      this.presentAlertConfirm("Please Select the Schema!","ALERT",false);
      return;

    } 

    if(this.selectedTable == ''){
    
      this.presentAlertConfirm("Please Select alteast one table!","ALERT",false);
      return;

    } 

    if(this.selectedFileType == ''){
    
      this.presentAlertConfirm("Please Select the File Format!","ALERT",false);
      
      return;
    } 

    const alerts = await this.alertController.create({
      header: 'Please enter the Configuration Name',
   
      inputs: [
        {
          name: 'Name',
          placeholder:'Name'
        }
      ],

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
        
          handler: () => {
            console.log('Confirm Cancel');
            this.isSave = false;
          }

        },

        {
          text:'OK',
          handler:(value)=>{
            this.isSave = true;
            this.saveName=value.Name;

            if(this.saveName == ''){
          
              this.presentAlertConfirm("Please give a name!","ALERT",false);
              return;
            } 
             
            this.onDownload();
          }

        }
      ],
    
    });

    await alerts.present();
 
  }


  async onDownload() {
this.isSubmitted=true;
    if(this.selectedDatabase == '' && this.selectedSchema == '' &&
      this.selectedTable == '' && this.selectedFileType==  ''){
      
      this.presentAlert();
      return false;

    }

    if(this.selectedDatabase == ''){
    
      this.presentAlertConfirm("Please Select the Database!","ALERT",false);
      return;

    } 

    if(this.selectedSchema == ''){
      
      this.presentAlertConfirm("Please Select the Schema!","ALERT",false);
      return;

    } 

    if(this.selectedTable == ''){
      
      this.presentAlertConfirm("Please Select alteast one table!","ALERT",false);
      return;

    } 

    if(this.selectedFileType == ''){
      
      this.presentAlertConfirm("Please Select the File Format!","ALERT",false);
      return;

    } 

    {
      let loading = await this.loadingController.create({
        message: 'Downloading',
        mode: 'ios',
        spinner: 'lines',
      });
      
      await loading.present();

      if (this.isSingle == true) {

        console.log('Sending single ' + this.selectedTable);
        console.log(this.selectedTable)

        this.http
        .post(environment.API + `/${this.selectedFileType}/`, {
          dbname: this.selectedDatabase,
          schema: this.selectedSchema,
          tablename: this.selectedTable,
          separator: this.selectedSeparator,
          fileType: this.selectedFileType,
          qualifier: this.qualifier,
          userName:localStorage.getItem("userName"),
          saveName:this.saveName,
          isSave:this.isSave,
          directory:this.directory
        })
        .subscribe(
          async (file) => {
            
            await loading.dismiss();

            this.presentAlertConfirm(Object.values(file).toString(), "Download Completed!", true);

          },

          async (error) => {
            console.log(error);

            await loading.dismiss();

            this.presentAlertConfirm(error.error.message, "Download Incomplete", false); 

          }

        );
     
      }

      if (this.isSingle == false) {
        console.log('Sending Multiple ' + this.selectedTable);
    
        this.http
        .post(environment.API + `/${this.selectedFileType}/multi`, {
          dbname: this.selectedDatabase,
          schema: this.selectedSchema,
          tablename: this.selectedTable.toString(),
          separator: this.selectedSeparator,
          fileType: this.selectedFileType,
          qualifier: this.qualifier,
          userName:localStorage.getItem("userName"),
          saveName:this.saveName,
          isSave:this.isSave,
          directory:this.directory
        })
        .subscribe(
          async (file) => {

            await loading.dismiss();

            this.presentAlertConfirm(Object.values(file).toString(), "Download Completed!", true);

          },
          
          async (error) => {
            
            console.log(error);
            
            await loading.dismiss();
            
            this.presentAlertConfirm(error.error.message, "Download Failed", false);     

          }

        );

        return;      
      }

    }

  }

  public showSearch() {

    this.showSearchBar = !this.showSearchBar;

  }

  async getAllDatabases() {
    
    this.http.get(environment.API + '/databases').subscribe(
      (dbs) => {
        
        console.log(dbs['results']);
        this.databases = dbs['results'];

      },

      async (error) => {

        console.log(error);

      }

    );

  }

  async getAllSchemas() {
    
    this.http.post(environment.API + '/schema', { dbname: this.selectedDatabase })
    .subscribe(
      (dbs) => {

        console.log(dbs);
        this.schemas = dbs['result'];

      },

      async (error) => {

        console.log(error);

      }

    );

  }


  async getAllTablesByDatabase() {
  
    this.http.post(environment.API + '/database', { dbname: this.selectedDatabase,schema:this.selectedSchema })
    .subscribe(
      (dbs) => {

        this.tables = dbs['result'];

      },

      async (error) => {
          
        console.log(error);

      }

    );
     
  }

  async getDirectory() {
    
    this.http.get(environment.API + '/directory').subscribe(
      (dbs) => {
        
        //console.log(dbs['results']);
        this.directory = dbs['results'];

      },

      async (error) => {

        console.log(error);

      }

    );

  }

}



















