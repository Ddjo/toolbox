import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../../core/shell/layout/header/header.component';
import { ButtonModule } from 'primeng/button';
import { BookService } from '../../core/services/book.service';
import { CommonModule } from '@angular/common';
import { BookSearchComponent } from './book-search/book-search.component';
import { LibraryComponent } from './library/library.component';
import { LibraryStoreModule } from '@site/shared-store';


@Component({
  selector: 'app-books-crud',
  templateUrl: './books-crud.component.html',
  styleUrls: ['./books-crud.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ButtonModule,
    CommonModule,
    LibraryStoreModule,
    HeaderComponent,
    BookSearchComponent,
    LibraryComponent
  ],
})
export class BooksCrudComponent  {

  constructor(private booksService: BookService) {}

  testBooks() {
    this.booksService.testBooks().subscribe();
  }

}
