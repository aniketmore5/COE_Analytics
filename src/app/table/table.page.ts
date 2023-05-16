import { AlertController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
//import { type } from 'os';

interface Column {
  name: string;
  type: string;
  length: string;
  constraint: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.page.html',
  styleUrls: ['./table.page.scss'],
})

export class TablePage implements OnInit {

  databases: any[] = [];
  selectedDatabase: any='';
  tableName = '';
  fieldLength: any;
  dataType = ''
  columns: Column[] = [];
  isOthers : boolean = true;
  precision : number;
  scale : number;
  myScript: any;
  constraint = '';
  isDefault: boolean;
  defaultValue: any;
  isEdit: boolean;
  log_value: any;
  selectedSchema: any;
  schemas: any;
  selectedTable: string;
  


  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private router: Router,
  ) {
    this.getAllDatabases();

      this.columns.push({
        name: '',
        type: '',
        length: '',
        constraint:''
      });

  }
  

  ngOnInit() {
  }

  addColumn(){
    this.columns.push({
      name: '',
      type: '',
      length: '',
      constraint: ''
    });
  }

  async getAllDatabases() {
    this.http.get(environment.API + '/databases').subscribe(
      (dbs) => {
        this.databases = dbs['result'];
      },
      async (error) => {
        console.log(error);
      }
    );
  }

  
  

  DatabaseSelectEvent(event) {
    
    this.selectedDatabase = event.detail.value;
    this.selectedSchema = '';
    this.selectedTable = '';
    this.getAllSchemas();
  }

  

  getAllSchemas() {
    throw new Error('Method not implemented.');
  }

  tableNameEvent(event) {
    this.tableName = event.detail.value;
  }

  datatypeEvent(event){
    
    for(let i=0; i<this.columns.length; i++){

      this.dataType = event.detail.value;
      
      if(this.dataType == 'date'){
        if(this.columns[i].type == 'date'){
          this.columns[i].length = 'YYYY-MM-DD'
          
        }
      }
      if(this.dataType == 'datetime'){
        if(this.columns[i].type == 'datetime'){
          this.columns[i].length = 'YYYY-MM-DD hh:mm:ss'
        
        }
      }

      if(this.dataType == 'decimal'){
        if(this.columns[i].type == 'decimal'){
          this.columns[i].length = '(0,0)'
        
        }
      }

      if(this.dataType == 'int'){
        if(this.columns[i].type == 'int'){
          this.columns[i].length = '11'
          this.isOthers = true;
        }
      }

      if(this.dataType == 'char'){
        if(this.columns[i].type == 'char'){
          this.columns[i].length = '255'
          this.isOthers = true;
        }
      }

      if(this.dataType == 'varchar'){
        if(this.columns[i].type == 'varchar'){
          this.columns[i].length = '255'
          this.isOthers = true;
        }
      }

      else{
        this.isOthers = true;
      }
      console.log(this.columns[i])
    } 
  
  }

  columnLengthEvent(event){
    this.fieldLength = event.detail.value;
  }

  async constraintEvent(event){
    this.constraint = event.detail.value;

    for(let i=0; i< this.columns.length; i++){
 

    if(this.constraint == 'NOT NULL'){
      if(this.columns[i].constraint == 'NOT NULL'){
        this.columns[i].constraint = 'NOT NULL'
      }
    }

    if(this.constraint == 'DEFAULT'){
      if(this.columns[i].constraint == 'DEFAULT'){
        this.columns[i].constraint = 'DEFAULT'
        const alerts = await this.alertController.create({
          header: 'Please enter the Default Value',
         
          inputs: [
            {
              name: 'default',
              placeholder:'Default value'
            }],
      
            buttons: [{
              text: 'Cancel',
              role: 'cancel',
              cssClass: 'secondary',
              handler: () => {
                console.log('Confirm Cancel');
              }
            },
            {text:'OK',
            handler:(value)=>{
              this.defaultValue = value.default;
              console.log(this.defaultValue);
            }
          }],
          
       });
       await alerts.present();
      };
    }

    if(this.constraint == 'UNIQUE'){
      if(this.columns[i].constraint == 'UNIQUE'){
        this.columns[i].constraint = 'UNIQUE'
      };
    }

    if(this.constraint == 'PRIMARY KEY'){
      if(this.columns[i].constraint == 'PRIMARY KEY'){
        this.columns[i].constraint = 'PRIMARY KEY'
      };
    }

    if(this.constraint == 'AUTO INCREMENT'){
      if(this.columns[i].constraint == 'AUTO INCREMENT'){
        this.columns[i].constraint = 'AUTO INCREMENT'
      };
    }

    }
    console.log(this.constraint)
  }

  remove() {
    this.columns.pop()
  }

  preview(){
    let columnName = ''
    
    if(this.selectedDatabase == '' && this.tableName == '' && this.columns.length == 0){
      this.presentAlertConfirm("Please fill the mandatory fields","ALERT!", false);
      return;
    }

    if(this.selectedDatabase === ""){
     this.presentAlertConfirm("Please Select the Database ","ALERT!", false); 
     return;
    }

    if(this.tableName === ""){
      this.presentAlertConfirm("Please Enter the Table name ","ALERT!", false); 
      return;
    }

    if(this.columns.length == 0){
      this.presentAlertConfirm("Please include atleast one column ","ALERT!", false); 
      return;
    }

    
    else{
    console.log(this.columns.length)
    for(let i=0; i<this.columns.length; i++){
      let column_number= +i +1   

      if(this.columns[i].name == ''){
        this.presentAlertConfirm("Please give name to Column "+column_number,"ALERT!",false)
        return
      }
      
      if(this.columns[i].constraint == 'PRIMARY KEY' || this.columns[i].constraint == 'UNIQUE'){
        if(this.columns[i].type == 'int' || this.columns[i].type == 'char' || this.columns[i].type == 'varchar'){
          
          columnName = columnName + this.columns[i].name + " "+ this.columns[i].type + "("+ this.columns[i].length +"), " +
          this.columns[i].constraint +"("+ this.columns[i].name +")," 
          
        }
      }

      if(this.columns[i].constraint == 'PRIMARY KEY' || this.columns[i].constraint == 'UNIQUE'){
        if(this.columns[i].type == 'date' || this.columns[i].type == 'datetime' ){
          
          columnName = columnName + this.columns[i].name + " "+ this.columns[i].type +  ", " +
          this.columns[i].constraint +"("+ this.columns[i].name +"),"
        
        }
      }

      if(this.columns[i].constraint == 'PRIMARY KEY' || this.columns[i].constraint == 'UNIQUE'){
        if(this.columns[i].type == 'decimal'  ){
          
          columnName = columnName + this.columns[i].name + " "+ this.columns[i].type +  this.columns[i].length +", " +
          this.columns[i].constraint +"("+ this.columns[i].name +"),"  
        
        }
      }

      if(this.columns[i].constraint == 'NOT NULL' || this.columns[i].constraint == 'AUTO INCREMENT'){
        if(this.columns[i].type == 'int' || this.columns[i].type == 'char' || this.columns[i].type == 'varchar'){
        
          columnName = columnName + this.columns[i].name + " "+ this.columns[i].type + "("+ this.columns[i].length +") " +
          this.columns[i].constraint +"," 

        }
      }

      if(this.columns[i].constraint == 'NOT NULL' || this.columns[i].constraint == 'AUTO INCREMENT'){
        if(this.columns[i].type == 'date' || this.columns[i].type == 'datetime' ){
        
          columnName = columnName + this.columns[i].name + " "+ this.columns[i].type +" "+
          this.columns[i].constraint +  ","  

        }
      }

      if(this.columns[i].constraint == 'NOT NULL' || this.columns[i].constraint == 'AUTO INCREMENT'){
        if(this.columns[i].type == 'decimal' ){

          columnName = columnName + this.columns[i].name + " "+ this.columns[i].type +" " + this.columns[i].length +
          " "+this.columns[i].constraint +"," 

        }
      }
      
      if(this.columns[i].constraint == 'DEFAULT'){
        if(this.columns[i].type == 'decimal'){
          columnName = columnName + this.columns[i].name + " "+ this.columns[i].type +" " + this.columns[i].length +
          " "+ this.columns[i].constraint + " " + this.defaultValue +"," 
        }

        if(this.columns[i].type == 'date' || this.columns[i].type == 'datetime'){
          columnName = columnName + this.columns[i].name + " "+ this.columns[i].type +" "+
          this.columns[i].constraint +" "+ this.defaultValue +  ","  
        }

        if(this.columns[i].type == 'int' || this.columns[i].type == 'char' || this.columns[i].type == 'varchar'){
          columnName = columnName + this.columns[i].name + " "+ this.columns[i].type + "("+ this.columns[i].length +") " +
          this.columns[i].constraint +" "+ this.defaultValue +","+'\n' 
        }
      }
     
    }
   
    columnName = columnName.substring(0,columnName.length-1);
    
    
    this.myScript = 'Create Table '+ this.selectedDatabase +'.'+this.tableName+' ( '+columnName+' )'
    console.log(this.myScript)
    this.preview_presentAlert();
  }
  }

  async edit(){
    const alerts = await this.alertController.create({
      header: 'You can edit the script now!',
     
      inputs: [
        {
          name: 'Script',
          placeholder:'Default value',
          value: this.myScript
        }],
  
        buttons: [{
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {text:'OK',
        handler:(value)=>{
          this.myScript = value.Script;
          console.log(this.myScript);
        }
      }],
      
   });
   await alerts.present();
  }

  async preview_presentAlert() {
    const alert = await this.alertController.create({
      header: 'Table Creation Script',
      message: this.myScript,
      buttons: [{
        text:'EDIT',
        handler: ()=>{
         this.edit();
        }
      },'Ok'],
    });

    await alert.present();
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
            if (isSuccess === true) {
              this.router.navigate(['/upload'])

            }
            if (isSuccess === false) {
              console.log("Cancelled");
            }
          }
        }
      ]
    });

    await alert.present();

  }

  createTable(){

  console.log(this.columns)

  if(this.selectedDatabase == "" && this.tableName == "" && this.columns.length == 1){
    this.presentAlertConfirm("Please fill the mandatory fields","ALERT!", false);
    return;
   }

  if(this.selectedDatabase === ""){
    this.presentAlertConfirm("Please Select the Database ","ALERT!", false); 
    return;
   }

   if(this.tableName === ""){
     this.presentAlertConfirm("Please Enter the Table name ","ALERT!", false); 
     return;
   }

   if(this.columns.length == 0){
     this.presentAlertConfirm("Please include atleast one column ","ALERT!", false); 
     return;
   }

    this.http
      .post(environment.API + `/createtable`, {
        dbname: this.selectedDatabase,
        tablename: this.tableName,
        columns: this.columns,
        user: localStorage.getItem("userName"),
        script: this.myScript
      })
      .subscribe(
        async (success) => {
          this.presentAlertConfirm(Object.values(success).toString(), "Success!", true);
        },
        async (error) => {
          console.log(error.error.message)
          this.presentAlertConfirm(error.error.message, "Table creation Failed!", false);
        }
      );
  }

  async log() {
    this.router.navigate(['/table-log'])
 
  }

 
}

