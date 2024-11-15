import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksCrudComponent } from './books-crud.component';

const booksCrudRoutes: Routes = [
  {
    path: '',
    component: BooksCrudComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(booksCrudRoutes)],
  exports: [RouterModule]
})
export class BooksCrudRoutingModule { }
