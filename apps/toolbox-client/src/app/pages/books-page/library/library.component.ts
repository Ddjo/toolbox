import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BooksService } from '../../../../../src/app/core/services/book.service';
import { BooksStore } from '../../../core/store/books/books.store';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-library',
    templateUrl: './library.component.html',
    styleUrls: ['./library.component.scss'],
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        ButtonModule,
        RouterModule
    ]
})
export class LibraryComponent  {

  readonly booksStore = inject(BooksStore);
  readonly booksService = inject(BooksService);

  removeBookFromLibrary(id: string) {
    this.booksService.removeBook(id).subscribe();
  }

}
