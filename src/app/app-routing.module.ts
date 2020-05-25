import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ViewResultComponent } from './view-result/view-result.component';

const routes: Routes = [
  {
    path: 'view-result',
    component: ViewResultComponent 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
