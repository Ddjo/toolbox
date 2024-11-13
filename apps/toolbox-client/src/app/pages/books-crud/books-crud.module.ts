
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BooksCrudComponent } from './books-crud.component';


@NgModule({
  declarations: [
    BooksCrudComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
  ],
  exports : [
    BooksCrudComponent
  ]
})
export class BooksCrudModule { }
