import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { HeaderComponent } from '../../core/shell/layout/header/header.component';
import { BookSearchComponent } from './book-search/book-search.component';
import { LibraryComponent } from './library/library.component';


@Component({
  selector: 'app-books-crud',
  templateUrl: './books-crud.component.html',
  styleUrls: ['./books-crud.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    HeaderComponent,
    BookSearchComponent,
    LibraryComponent
  ],
})
export class BooksCrudComponent  {


}
