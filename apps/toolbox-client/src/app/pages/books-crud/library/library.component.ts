import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BooksService } from '../../../../../src/app/core/services/book.service';
import { BooksStore } from '../../../../../src/app/core/store/book.store';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
  ], 
})
export class LibraryComponent  {

  readonly booksStore = inject(BooksStore);
  readonly booksService = inject(BooksService);

  removeBookFromLibrary(id: string) {
    this.booksService.removeBook(id).subscribe();
  }

}
