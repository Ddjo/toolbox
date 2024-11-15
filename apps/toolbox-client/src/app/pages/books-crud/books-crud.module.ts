
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BooksCrudComponent } from './books-crud.component';
import { BooksCrudRoutingModule } from './books-crud-routing.module';
import { HeaderModule } from '../../core/shell/layout/header/header.module';


@NgModule({
  declarations: [
    BooksCrudComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    BooksCrudRoutingModule,
    HeaderModule
  ],
  exports : [
    BooksCrudComponent
  ]
})
export class BooksCrudModule { }
