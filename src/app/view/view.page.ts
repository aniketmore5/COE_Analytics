import { AlertController, IonSelect, LoadingController, Platform } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from "@angular/forms";
import { Router } from '@angular/router';
@Component({
  selector: 'app-view',
  templateUrl: 'view.page.html',
  styleUrls: ['view.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class viewPage {
  public items: string[] = [];
  public myForm: FormGroup;
  public myJoin: FormGroup;
  ionicForm: FormGroup;
  isSubmitted = false;
  public ShowSearchBar = false;
  public ShowScript = false;
  joinscript: string;
  filterscript: string;
  isUrlSet: boolean;
  main_column: string = '';
  handlerMessage: string;
  selectedfirsttable: string;
  selectedsecondtable: string;
  selectedtable: string;
  jointables: any[] = [];
  joindatabases: any[] = [];
  col1: any;
  col2: any;
  selectedfirstdb: string;
  selectedseconddb: string;
  maincol: any[];
  databases: any[] = [];
  tabs: any[] = [];
  col: any[] = [];
  seccols: [] = [];
  sectable: any[] = [];
  filterdb: any[] = [];
  myScript: string;
  filtercol = [];
  filtertable: string[] = [];
  joincolumn: string = '';
  selectedDatabase: string;
  selectedtb: string;
  selectedmaincol: string = '';
  selectedsecDatabase: string = '';
  selectedsectab: string = '';
  selectedfiltertb: string = '';
  selectedfilterDb: string = '';
  include_join_col: string[] = [];
  selectedcolumns: any;
  outputArray: string[] = [];
  form: any;
  isPrimaryDone = false;

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9_]+')]],
      db: ['', [Validators.required]],
      tab: ['', [Validators.required]],
      column: ['', [Validators.required]],
    })
  }
  public ShowSearch() {
    this.ShowSearchBar = !this.ShowSearchBar;
  }
  filter(): FormArray {
    return this.myForm.get("filter") as FormArray
  }
  join(): FormArray {
    return this.myJoin.get("join") as FormArray
  }
  onCondn(onIndex: number): FormArray {
    return this.join()
      .at(onIndex)
      .get('onCondition') as FormArray;
  }
  newfilter(): FormGroup {
    return this.fb.group({
      condition: [''],
      table: ['', Validators.required],
      column: ['', Validators.required],
      operator: ['', Validators.required],
      criteria: ['', Validators.required]
    })
  }
  newJoin(): FormGroup {
    return this.fb2.group({
      secondary_database: ['', Validators.required],
      secondary_table: ['', Validators.required],
      include_columns: ['', Validators.required],
      join_type: ['', Validators.required],
      onCondition: this.fb.array([], Validators.required)
    })
  }
  newonCondition(): FormGroup {
    return this.fb.group({

      condition: [''],
      table_1: ['', Validators.required],
      column_1: ['', Validators.required],
      table_2: ['', Validators.required],
      column_2: ['', Validators.required]
    });
  }

  addFilter() {
   /* this.isPrimaryDone = true;
    if (!this.ionicForm.valid || !this.myJoin.valid) {

      this.presentAlert();
      return false;
    }
    else {*/
      this.filtertable = [];
      this.filter().push(this.newfilter());
      if (!this.filtertable.includes(this.ionicForm.get('db').value + '.' + this.ionicForm.get('tab').value)) {
        this.filtertable[0] = this.ionicForm.get('db').value + '.' + this.ionicForm.get('tab').value;
      }
      for (let i = 0; i < this.myJoin.get('join').value.length; i++) {
        if (!this.filtertable.includes(this.myJoin.get('join').value[i]['secondary_database'] + '.' + this.myJoin.get('join').value[i]['secondary_table'])) {
          this.filtertable.push(this.myJoin.get('join').value[i]['secondary_database'] + '.' + this.myJoin.get('join').value[i]['secondary_table']);
        }
      }
    //}

  }
  addJoin() {
    
   /* this.isPrimaryDone = true;
    if (!this.ionicForm.valid) {

      this.presentAlert();
      return false;
    }
    else {*/
      this.join().push(this.newJoin());
   // }
  }
  addOnCondition(joinIndex: number) {
    this.jointables = [];
    this.onCondn(joinIndex).push(this.newonCondition());
    if (!this.jointables.includes(this.ionicForm.get('db').value + '.' + this.ionicForm.get('tab').value)) {
      this.jointables[0] = this.ionicForm.get('db').value + '.' + this.ionicForm.get('tab').value;
    }
    for (let i = 0; i < this.myJoin.get('join').value.length; i++) {
      if (!this.jointables.includes(this.myJoin.get('join').value[i]['secondary_database'] + '.' + this.myJoin.get('join').value[i]['secondary_table'])) {
        this.jointables.push(this.myJoin.get('join').value[i]['secondary_database'] + '.' + this.myJoin.get('join').value[i]['secondary_table']);
      }
    }
  }
  removeOnCondition(joinIndex: number, onIndex: number) {
    this.onCondn(joinIndex).removeAt(onIndex);
  }
  removeFilter(i: number) {
    this.filter().removeAt(i);
  }
  removejoin(i: number) {
    this.join().removeAt(i);
  }

  get errorControl() {
    return this.ionicForm.controls;
  }

  constructor(private http: HttpClient,
    private alertController: AlertController,
    private loadingController: LoadingController,
    public formBuilder: FormBuilder,
    private router: Router,
    private fb: FormBuilder,
    private fb2: FormBuilder,
    public platform: Platform) {
    this.myForm = this.fb.group({
      filter: this.fb.array([]),
    });
    this.myJoin = this.fb2.group({
      join: this.fb2.array([]),
    });
    this.getAllDatabases();
    return;
  }
  async getmaincolumns() {
    if (this.ionicForm.get('column').value.length == 1) {
      this.selectedmaincol = this.ionicForm.get('column').value.toString().trim();
      this.main_column = this.selectedmaincol;
    }
    if (this.ionicForm.get('column').value.length > 1) {
      let column = '\'' + this.ionicForm.get('column').value[0] + '\'';
      for (let i = 1; i < this.ionicForm.get('column').value.length; i++) {
        column += ',\'' + this.ionicForm.get('column').value[i] + '\'';
      }
      this.selectedmaincol = column;
      let column2 = this.ionicForm.get('tab').value.toString().trim() + '.' + this.ionicForm.get('column').value[0].toString().trim();
      for (let i = 1; i < this.ionicForm.get('column').value.length; i++) {
        column2 += ',\t' + this.ionicForm.get('tab').value.toString().trim() + '.' + this.ionicForm.get('column').value[i].toString().trim();
      }
      this.main_column = column2;
    }
  }
  async getfiltercondn() {
    const filter0 = this.myForm.get('filter').value[0];
    let condition1: string;
    condition1 = '\n' + 'WHERE ' + filter0['table'].split('.')[1].trim() + '.' + filter0['column'].toString().trim() + ' ' + filter0['operator'].toString().trim() + ' ' + filter0['criteria'].toString().trim();
    console.log(Object.keys(this.myForm.get('filter')).length);
    console.log(this.myForm.get('filter').value);
    for (let k = 1; k < Object.keys(this.myForm.get('filter').value).length; k++) {
      const filters = this.myForm.get('filter').value[k];
      condition1 += '\n ' + filters['condition'].toString().trim() + ' ' + filters['table'].split('.')[1].toString().trim() + '.' + filters['column'].toString().trim() + ' ' + filters['operator'].toString().trim() + ' ' + filters['criteria'].toString().trim();
    }
    this.filterscript = condition1;
  }
  async getjoincondn() {
    let condition2: string;
    let condition3: string = ' ';
    let condition4: string = ' ';
    for (let k = 0; k < Object.keys(this.myJoin.get('join').value).length; k++) {
      const joins = this.myJoin.get('join').value[k];
      const onCondition0 = joins['onCondition'];
      condition2 = '\n' + onCondition0[0]['table_1'].split('.')[1].toString().trim() + '.' + onCondition0[0]['column_1'].toString().trim() + ' = ' + onCondition0[0]['table_2'].split('.')[1].toString().trim() + '.' + onCondition0[0]['column_2'].toString().trim() + ' ';
      condition3 = joins['join_type'].toString().trim() + ' ' + joins['secondary_database'].toString().trim() + '.' + joins['secondary_table'].toString().trim() + ' ON '
      for (let j = 1; j < Object.keys(this.myJoin.get('join').value[k]['onCondition']).length; j++) {
        const on = joins['onCondition'][j];
        condition2 += '\n' + on['condition'].toString().trim() + ' ' + on['table_1'].split('.')[1].toString().trim() + '.' + on['column_1'].toString().trim() + ' = ' + on['table_2'].split('.')[1].toString().trim() + '.' + on['column_2'].toString().trim() + ' ';
      }
      condition4 += condition3 + condition2;
      condition2 = '';
    }
    this.joinscript = condition4;
    this.include_join_col = [];
    for (let k = 0; k < this.myJoin.get('join').value.length; k++) {
      for (let j = 0; j < this.myJoin.get('join').value[k]['include_columns'].length; j++) {
        this.include_join_col.push(this.myJoin.get('join').value[k]['secondary_table'].trim() + '.' + this.myJoin.get('join').value[k]['include_columns'][j]);
      }
    }
    this.joincolumn = '';
    this.joincolumn = ',' + this.include_join_col[0].trim();
    for (let i = 1; i < this.include_join_col.length; i++) {
      this.joincolumn += ',\t' + this.include_join_col[i].trim();
    }
  }
  async ViewScript() {
    this.isSubmitted = true;
    if (!this.ionicForm.valid || !this.myJoin.valid || !this.myForm.valid) {
      this.presentAlert();
      return false;
    }

    this.getScript();
    this.ShowScript = true;

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
    await alert.present();
  }
  async presentduplicateAlert() {
    const alert = await this.alertController.create({
      header: 'Second table cannot be same as first table !',
      buttons: [
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.handlerMessage = 'Second table cannot be same as first table';
          },
        },
      ],
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
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel: Cancelled');
          }
        }, {
          text: 'Okay',
          handler: () => {
            console.log('Confirm Okay');
            if (isSuccess == true) {
              this.router.navigate(['/view'])
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
  async submitForm() {
    this.isSubmitted = true;

    if (!this.ionicForm.valid || !this.myJoin.valid || !this.myForm.valid) {
      this.presentAlert();
      return false;
    } else {
      let loading = await this.loadingController.create({
        message: 'Creating',
        mode: 'ios',
        spinner: 'lines',
        duration: 5000,
      });
      await loading.present();
      await loading.dismiss();
      this.getScript();
      this.http.post(environment.API + '/ViewCreate', { 'script': this.myScript }).subscribe((dbs) => {
        console.log(dbs);
        this.presentAlertConfirm("Success!", "View Creation Completed!", true);
      }, async (error) => {
        console.log(error);
        console.log(error);
        this.isUrlSet = false;
        await loading.dismiss();
        this.presentAlertConfirm("Failed!", "View Creation Incomplete", false);
      })
      console.log(this.ionicForm.value);
    }
  }
  async getScript() {
    this.getmaincolumns();
    if (this.myJoin.get('join').value.length === 0 && this.myForm.get('filter').value.length === 0) {
      this.myScript = 'CREATE VIEW\t' + this.ionicForm.get('db').value.toString().trim() + '.' + this.ionicForm.get('name').value.toString().trim() + '\n' + ' AS SELECT ' + '\n' + this.main_column.trim() + '\n' + ' FROM\t' + this.ionicForm.get('db').value.toString().trim() + '.' + this.ionicForm.get('tab').value.toString().trim();
      return
    }
    else if (this.myJoin.get('join').value.length === 0 && this.myForm.get('filter').value.length != 0) {
      this.getfiltercondn();
      this.myScript = 'CREATE VIEW\t' + this.ionicForm.get('db').value.toString().trim() + '.' + this.ionicForm.get('name').value.toString().trim() + '\n' + ' AS SELECT ' + '\n' + this.main_column.trim() + '\n' + ' FROM ' + this.ionicForm.get('db').value.toString().trim() + '.' + this.ionicForm.get('tab').value.toString().trim() + ' ' + this.filterscript;
      return
    }
    else if (this.myJoin.get('join').value.length != 0 && this.myForm.get('filter').value.length === 0) {
      this.getjoincondn();
      this.myScript = 'CREATE VIEW\t' + this.ionicForm.get('db').value.toString().trim() + '.' + this.ionicForm.get('name').value.toString().trim() + '\n' + ' AS SELECT ' + '\n' + this.main_column.trim() + '\n' + this.joincolumn + '\n' + ' FROM ' + this.ionicForm.get('db').value.toString().trim() + '.' + this.ionicForm.get('tab').value.toString().trim() + ' ' + this.joinscript;
      return
    }
    else if (this.myJoin.get('join').value.length != 0 && this.myForm.get('filter').value.length !== 0) {
      this.getjoincondn();
      this.getfiltercondn();
      this.myScript = 'CREATE VIEW\t' + this.ionicForm.get('db').value.toString().trim() + '.' + this.ionicForm.get('name').value.toString().trim() + '\n' + ' AS SELECT ' + '\n' + this.main_column.trim() + '\n' + this.joincolumn + '\n' + ' FROM ' + this.ionicForm.get('db').value.toString().trim() + '.' + this.ionicForm.get('tab').value.toString().trim() + ' ' + this.joinscript + ' ' + this.filterscript;
      return
    }
  }
  DatabaseSelectEvent(event: { detail: { value: string; }; }) {

    this.selectedDatabase = event.detail.value;
    this.selectedtable = null;

    this.gettablesforselect();

  }
  tbSelectEvent(ev: { detail: { value: string; }; }) {
    this.selectedtb = ev.detail.value;
    this.selectedcolumns = null;
    if (this.selectedtable != null) {
      this.getcolforselect();
    }

  }



  SecDatabaseSelectEvent(event: { detail: { value: string; }; }) {
    this.selectedsecDatabase = event.detail.value;
    this.getsectable();

  }
  sectableSelectEvent(ev: { detail: { value: string; }; }) {
    this.selectedsectab = ev.detail.value;
    this.getseccol();
  }
  onCondnSelectEvent(ev: { detail: { value: string; }; }) {

  }
  firsttableSelectEvent(ev: { detail: { value: string; }; }) {
    this.col1=null;
    this.selectedfirsttable = ev.detail.value;
    this.getfirsttablecolumns();


  }
  secondtableSelectEvent(ev: { detail: { value: string; }; }) {
this.col2=null;
    if (this.selectedfirsttable === ev.detail.value) {
      this.presentduplicateAlert();
      return false;
    }
    else {
      this.selectedsecondtable = ev.detail.value;
      this.getsecondtablecolumns();
    }
  }

  filtertbSelectEvent(ev: { detail: { value: string; }; }) {
    this.filtercol=null;
    this.selectedfiltertb = ev.detail.value;
    this.getfiltercolforselect();
  }

  async getAllDatabases() {
    this.http.get(environment.API + '/databases').subscribe((dbs) => {
      console.log(dbs);
      this.databases = dbs['result'];
    }, async (error) => {
      console.log(error);
    })
  }
  async gettablesforselect() {
    this.http.post(environment.API + '/gettables', { 'dbname': this.selectedDatabase.trim() }).subscribe((dbs) => {
      console.log(dbs);
      this.tabs = dbs['results'];
    }, async (error) => {
      console.log(error);
    })
  }
  async getcolforselect() {
    this.http.post(environment.API + '/getcolumns', { 'dbname': this.selectedDatabase.trim(), 'table': this.selectedtb.trim() }).subscribe((dbs) => {
      console.log(dbs);
      this.col = dbs['results'];
      this.items = dbs['results'];
    }, async (error) => {
      console.log(error);
    })
  }
  async getfirsttablecolumns() {
    this.http.post(environment.API + '/getseccolumns', { 'query': this.selectedfirsttable.trim() }).subscribe((dbs) => {
      console.log(dbs);
      this.col1 = dbs['results'];
    }, async (error) => {
      console.log(error);
    })
  }
  async getsecondtablecolumns() {
    this.http.post(environment.API + '/getseccolumns', { 'query': this.selectedsecondtable.trim() }).subscribe((dbs) => {
      console.log(dbs);
      this.col2 = dbs['results'];
    }, async (error) => {
      console.log(error);
    })
  }
  async getfiltercolforselect() {
    this.http.post(environment.API + '/getseccolumns', { 'query': this.selectedfiltertb.trim() }).subscribe((dbs) => {
      console.log(dbs);
      this.filtercol = dbs['results'];
    }, async (error) => {
      console.log(error);
    })
  }
  async getsectable() {
    this.http.post(environment.API + '/gettables', { 'dbname': this.selectedsecDatabase.trim() }).subscribe((dbs) => {
      console.log(dbs);
      this.sectable = dbs['results'];
    }, async (error) => {
      console.log(error);
    })
  }
  async getseccol() {
    this.http.post(environment.API + '/getcolumns', { 'dbname': this.selectedsecDatabase.trim(), 'table': this.selectedsectab.trim() }).subscribe((dbs) => {
      console.log(dbs);
      this.seccols = dbs['results'];
    }, async (error) => {
      console.log(error);
    })
  }
}