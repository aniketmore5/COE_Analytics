import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'view',
    loadChildren: () => import('./view/view.module').then( m => m.ViewModule)
  },
  {
    path: 'choose-options',
    loadChildren: () => import('./choose-options/choose-options.module').then( m => m.ChooseOptionsPageModule)
  },
  {
    path: 'download-dashboard',
    loadChildren: () => import('./download-dashboard/download-dashboard.module').then( m => m.DownloadDashboardPageModule)
  },
  {
    path: 'upload',
    loadChildren: () => import('./upload/upload.module').then( m => m.UploadPageModule)
  },
  {
    path: 'table',
    loadChildren: () => import('./table/table.module').then( m => m.TablePageModule) 
   },
  {
    path: 'table-log',
    loadChildren: () => import('./table-log/table-log.module').then( m => m.TableLogPageModule)
  },
  {
    path: 'upload-log',
    loadChildren: () => import('./upload-log/upload-log.module').then( m => m.UploadLogPageModule)
  },
  {
    path: 'download-log',
    loadChildren: () => import('./download-log/download-log.module').then( m => m.DownloadLogPageModule)
  },
  

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
