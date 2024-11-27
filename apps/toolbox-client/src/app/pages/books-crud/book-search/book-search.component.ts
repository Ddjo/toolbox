import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { debounceTime, distinctUntilChanged, filter, of, shareReplay, switchMap, tap } from 'rxjs';
import { BooksService } from "../../../core/services/book.service";
import { IBook } from "@libs/common";
import { BooksStore } from "../../../../../src/app/core/store/book.store";

export interface IGoogleBook  {
  volumeInfo : {
    authors?: string[],
    publishedDate: string,
    title: string
  }
}

@Component({
    selector: 'app-book-search',
    standalone: true,
    imports: [
        CommonModule,
        AutoCompleteModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        ButtonModule
    ],
    templateUrl: './book-search.component.html',
    styleUrl: './book-search.component.scss',
    changeDetection: ChangeDetectionStrategy.Default,
})
export class BookSearchComponent { 

  JSON = JSON;
  filteredBooks: IGoogleBook[] = [];
  selectedBook?: IGoogleBook;
  bookForm = new FormGroup({
      bookSearchInput: new FormControl<string>('')
  });
   
  booksStore = inject(BooksStore);

  constructor(
    private bookService: BooksService,
    private cd: ChangeDetectorRef
  ) {
   
    this.bookForm.controls.bookSearchInput.valueChanges.pipe(
      filter(searchTerm => typeof(searchTerm) === 'string'),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(val => val ? this.bookService.searchBookOnGoogleApi(val) : of()),
      shareReplay(1),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tap((res: any) => this.filteredBooks =  res['items'] ? res['items'] : []),
      tap(() => this.cd.detectChanges())
    ).subscribe()
  }

  saveBookIntoLibrary() {

    if (this.selectedBook) {

      const book: Omit<IBook, '_id'> = {
        authors: this.selectedBook.volumeInfo.authors || [],
        publishedDate: this.selectedBook.volumeInfo.publishedDate,
        title: this.selectedBook.volumeInfo.title,
      }

      this.bookService.createBook(book).subscribe();

    }

  }

}
