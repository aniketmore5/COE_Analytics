import { AlertController, LoadingController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

interface Column {
  name: string ;
  type: string;
  length: string;
  constraint: string;
}

@Component({
  selector: 'app-upload',
  templateUrl: 'upload.page.html',
  styleUrls: ['upload.page.scss'],
})
export class UploadPage implements OnInit {
  databases: any[] = [];
  tables: any[] = [];
  column: any[] = [];
  tableData: any[] = [];
  columns: Column[] = [];
  handlerMessage = '';
  selectedDatabase: any = '';
  isSubmitted:boolean=false;
  selectedTable: any;
  qualifier: any = '';
  seperator: any = '';
  file: any = '';
  newTableName: string = '';
  textfile: boolean = false;
  xlsfile: boolean;
  isSingle: boolean = false;
  isOthers: boolean = true;
  createTable: boolean = false;
  create: boolean = false;
  preview: boolean = false;
  colShown: boolean = false;
  dataType: any;
  constraint: any;
  defaultValue: any;
  myScript: string;
  db_table: any = '';
  selectedSchema: any;
  schemas: any;
  

  constructor(
    private http: HttpClient,
    private alertController: AlertController,
    private router: Router,
    private loadingController: LoadingController,

  ) {

      this.getAllDatabases();

    }

  ngOnInit() {

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
              this.router.navigate(['/upload'])
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

  async getAllTablesByDatabase() {
  
    this.http.post(environment.API + '/database', { dbname: this.selectedDatabase,schema:this.selectedSchema })
    .subscribe(
      (dbs) => {

        this.tables = dbs['result'];
        this.tables.push("Others")
        //console.log(this.tables.push("Others"))
      },

      async (error) => {
          
        console.log(error);

      }

    );
     
  }

  tableSelectEvent(ev) {
    
    this.selectedTable = ev.value;
    const fileLength = ev.value.length;
    this.isSingle = fileLength === 1;
    
    if (this.selectedTable == 'Others') {
      
      this.createTable = true;

    }

  }

  
  qualifierEvent(event) {
    
    this.qualifier = event.detail.value;
    this.getColumns();

  }

  seperatorEvent(event) {
    
    this.seperator = event.detail.value;
    this.getColumns();

  }

  async chooseFile() {
    
    this.xlsfile = false;
    this.textfile = false;
    this.columns = [];
    this.tableData = [];

    let fileHandle = await globalThis.showOpenFilePicker();
    this.file = await fileHandle[0].getFile();


    if (this.file.name.split(".").pop() === "txt") {
      
      this.textfile = true;
      this.xlsfile = true;
      
    }


    if (this.file.name.split(".").pop() === "csv") {
      
      this.xlsfile = true;

    }

    if (this.file.name.split(".").pop() === "tsv") {
      
      this.xlsfile = true;

    }

    else{
      
      this.getColumns();

    }

  }

  getColumns(){
    
    const formData = new FormData();
    formData.append('file', this.file);
    formData.append('separator', this.seperator);
    formData.append('qualifier', this.qualifier);
    
    this.http
    .post(environment.API + '/columns', formData)
    .subscribe(
      (res) => {
        
        this.column = res['columns'];
        this.tableData = res['data'];
        this.preview = false;
        this.colShown = true;

      },
        
      async (error) => {
        console.log(error);
      }
    );

  }


  newTableSelect(event: any) {
    
    this.newTableName = event.detail.value;
    console.log(this.newTableName)

    const formData = new FormData();
    formData.append('dbname', this.selectedDatabase);
    formData.append('tablename', this.newTableName);
    formData.append('schema', this.selectedSchema);

    
    this.http
    .post(environment.API + '/tableColumns', formData)
    .subscribe(
      (res) => {
        
        this.db_table = res['db_table'].toString();
        console.log(this.db_table)

      },
        
      async (error) => {
        console.log(error);
      }
    );
  }



  showColumns() {
    
    if(this.file === '') {
      
      this.presentAlertConfirm("Please Choose a File !", "ALERT", false);
      return;

    }

    if(this.textfile && this.seperator === '') {
      
      this.presentAlertConfirm("Please Input Separator !", "ALERT", false);
      return;

    }

    if(this.xlsfile && this.qualifier === '') {
      
      this.presentAlertConfirm("Please Input Qualifier !", "ALERT", false);
      return;

    }

    if(this.selectedDatabase === "" && this.newTableName === ""){
      
      this.presentAlertConfirm("Please Input the Mandatory fields ! ","ALERT", false); 
      return;

    }

    if(this.selectedDatabase === ""){
      
      this.presentAlertConfirm("Please Select the Database ! ","ALERT", false); 
      return;

    }


    if(this.newTableName === ""){

      this.presentAlertConfirm("Please Name the Table ! ","ALERT", false); 
      return;

    }

    if(this.db_table == this.newTableName){

      this.presentAlertConfirm("Table `"+this.newTableName+"` already exists !","ALERT", false); 
      return;

    }

    for(let i=0; i<this.column.length; i++){

      this.columns.push({
        name: this.column[i],
        type: '',
        length: '',
        constraint:''
      });

    }

  }

  addColumn(){
    
    this.columns.push({
      name: '',
      type: '',
      length: '',
      constraint: ''
    });

  } 


  datatypeEvent(event){
    
    for(let i=0; i<this.columns.length; i++){

      this.dataType = event.detail.value;
      
      if(this.dataType == 'date'){
        
        if(this.columns[i].type == 'date'){
          
          this.columns[i].length = 'YYYY-MM-DD';
          
        }

      }

      if(this.dataType == 'datetime'){
        
        if(this.columns[i].type == 'datetime'){
          
          this.columns[i].length = 'YYYY-MM-DD hh:mm:ss';
        
        }

      }

      if(this.dataType == 'decimal'){
        
        if(this.columns[i].type == 'decimal'){
          
          this.columns[i].length = '(0,0)';
        
        }

      }

      if(this.dataType == 'int'){
        
        if(this.columns[i].type == 'int'){
          
          this.columns[i].length = '11';
          this.isOthers = true;

        }

      }

      if(this.dataType == 'char'){
        
        if(this.columns[i].type == 'char'){
          
          this.columns[i].length = '255';
          this.isOthers = true;

        }

      }

      if(this.dataType == 'varchar'){
        
        if(this.columns[i].type == 'varchar'){
          
          this.columns[i].length = '255';
          this.isOthers = true;

        }

      }

      else{

        this.isOthers = true;

      }

    } 
      
  }


  async constraintEvent(event){
    
    this.constraint = event.detail.value;

    for(let i=0; i< this.columns.length; i++){
 

      if(this.constraint == 'NOT NULL'){
      
        if(this.columns[i].constraint == 'NOT NULL'){
        
          this.columns[i].constraint = 'NOT NULL';
        }

      }

      if(this.constraint == 'DEFAULT'){

        if(this.columns[i].constraint == 'DEFAULT'){

          this.columns[i].constraint = 'DEFAULT';

          const alerts = await this.alertController.create({
            header: 'Please enter the Default Value',
         
            inputs: [
              {
                name: 'default',
                placeholder:'Default value'
              }
            ],
      
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
        
          this.columns[i].constraint = 'UNIQUE';

        };

      }

      if(this.constraint == 'PRIMARY KEY'){
      
        if(this.columns[i].constraint == 'PRIMARY KEY'){
        
          this.columns[i].constraint = 'PRIMARY KEY';

        };

      }

      if(this.constraint == 'AUTO INCREMENT'){
      
        if(this.columns[i].constraint == 'AUTO INCREMENT'){
        
          this.columns[i].constraint = 'AUTO INCREMENT';

          const alerts = await this.alertController.create({
            header: '( seed, increment) \n Seed: Starting value of a column. \n\n Increment: Incremental value that is added to the identity value of the previous row that was loaded. ',
           
            inputs: [
              {
                name: 'default',
                placeholder:'(1,1)',
                value: '(1,1)'
              }
            ],
      
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

    }

  }

  previewScript(){
    
    let columnName = ''
    
    if(this.selectedDatabase == '' && this.newTableName == '' && this.columns.length == 0){
      
      this.presentAlertConfirm("Please fill the mandatory fields","ALERT!", false);
      return;

    }

    if(this.selectedDatabase === ""){
     
      this.presentAlertConfirm("Please Select the Database ","ALERT!", false); 
     return;

    }

    if(this.newTableName === ""){
      
      this.presentAlertConfirm("Please Enter the Table Name ","ALERT!", false); 
      return;

    }

    if(this.columns.length == 0){
      
      this.presentAlertConfirm("Please include atleast one column ","ALERT!", false); 
      return;

    }
    
    else{

      for(let i=0; i<this.columns.length; i++){
      
        let column_number= +i +1   

        if(this.columns[i].type == ''){
        
          this.presentAlertConfirm("Please select the datatype of Column `"+ this.columns[i].name +"`","ALERT!",false);
          return;

        }

        if(this.columns[i].constraint == ''){
        
          this.presentAlertConfirm("Please select the constraint of Column `"+ this.columns[i].name +"`","ALERT!",false);
          return;

        }

        if(this.columns[i].name == ''){
        
          this.presentAlertConfirm("Please name the Column `"+ column_number +"`","ALERT!",false);
          return;

        }
      
        /*if(this.columns[i].constraint == 'PRIMARY KEY' || this.columns[i].constraint ==     'UNIQUE'){
        
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

        }*/

        if(this.columns[i].constraint == 'NOT NULL' || this.columns[i].constraint == 'AUTO INCREMENT' || this.columns[i].constraint == 'PRIMARY KEY' || this.columns[i].constraint == 'UNIQUE'){
        
          if(this.columns[i].type == 'char' || this.columns[i].type == 'varchar'){
        
            columnName = columnName + this.columns[i].name + " "+ this.columns[i].type + "("+ this.columns[i].length +") " +
            this.columns[i].constraint +"," 

          }

          if(this.columns[i].type == 'int'){
        
            columnName = columnName + this.columns[i].name + " "+ this.columns[i].type +" "+// "("+ this.columns[i].length +") " +
            this.columns[i].constraint +"," 

          }

        }

        if(this.columns[i].constraint == 'NOT NULL' || this.columns[i].constraint == 'AUTO INCREMENT' || this.columns[i].constraint == 'PRIMARY KEY' || this.columns[i].constraint == 'UNIQUE'){
        
          if(this.columns[i].type == 'date' || this.columns[i].type == 'datetime' ){
        
            columnName = columnName + this.columns[i].name + " "+ this.columns[i].type +" "+
            this.columns[i].constraint +  ","  

          }

        }

        if(this.columns[i].constraint == 'NOT NULL' || this.columns[i].constraint == 'AUTO INCREMENT' || this.columns[i].constraint == 'PRIMARY KEY' || this.columns[i].constraint == 'UNIQUE'){
        
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
          
            columnName = columnName + this.columns[i].name + " "+ this.columns[i].type + " "+ 
            this.columns[i].constraint +" '"+ this.defaultValue +"'," 

          }

        }
     
      }
   
      columnName = columnName.substring(0,columnName.length-1);
    
    
      this.myScript = `Use ${this.selectedDatabase}; Create Table ${this.selectedSchema}.${this.newTableName}(`+ columnName + `)`

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
          console.log(value);
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

  refresh(){
    
    for(let i=0; i<this.column.length; i++){
    
      this.columns[i].type= "" ;
      this.columns[i].length= "" ;
      this.columns[i].constraint= "" ;
      this.myScript = "" ;
    }

  }

  dismiss(){

    for(let i=0; i<this.column.length; i++){
      
      this.columns.pop();

    }
    
  }

  previewTable() {

    this.preview = true;
    this.colShown = false;

    if(this.file == ''){
      
      this.presentAlertConfirm("Please choose the file first! ","ALERT", false); 
      return;
    
    }
    
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
      ],
    });
    
    this.isSubmitted=true;
    if(this.selectedDatabase == '' && this.selectedSchema == '' &&
      this.selectedTable == '' ){
      
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

    
    await alert.present();
    
  }

  
  
   

  async upload() {

    const tableName = this.createTable ? this.newTableName : this.selectedTable;

    if (this.selectedDatabase === '' || tableName === '' || this.file === '') {
      
      this.presentAlert();
      return false;

    }

    
    let loading = await this.loadingController.create({
      message: 'Uploading',
      mode: 'ios',
      spinner: 'lines',
    });
    await loading.present();


    const formData = new FormData();
    console.log(this.newTableName);
    formData.append("dbname", this.selectedDatabase);
    formData.append("schema", this.selectedSchema);
    formData.append("tablename", tableName);
    formData.append("qualifier", this.qualifier);
    formData.append("seperator", this.seperator);
    formData.append("file", this.file);
    formData.append("createTable", this.createTable.toString());
    formData.append("user", localStorage.getItem("userName"));

    this.http
    .post(environment.API + `/upload`, formData)
    .subscribe(
      async (file) => {
        await loading.dismiss(); 
        this.presentAlertConfirm( Object.values(file).toString(), "Upload Completed!", true
        
        );
      },
        
      async (error) => {
        await loading.dismiss();
        this.presentAlertConfirm(error.error.message, "Upload Failed!", false);

      }
    );

  }
 

  async log() {
    
    this.router.navigate(['/upload-log']);

  }

  createNewTable(){
    
    this.http
    .post(environment.API + `/createtable`, {
      dbname: this.selectedDatabase,
      tablename: this.newTableName,
      schema:this.selectedSchema,
      columns: this.columns,
      user: localStorage.getItem("userName"),
      createTable: this.createTable.toString(),
      script: this.myScript,
     
    })
    .subscribe(
      async (success) => {
        
        this.presentAlertConfirm(Object.values(success).toString(), "Success!", true);

      },
      async (error) => {

        this.presentAlertConfirm(error.error.message, "Table creation Failed!", false);

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

  
}

