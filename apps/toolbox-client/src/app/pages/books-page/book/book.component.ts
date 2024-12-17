import { CommonModule } from "@angular/common";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { IBook } from "@libs/common";
import { AutoCompleteModule } from "primeng/autocomplete";
import { ButtonModule } from "primeng/button";
import { CalendarModule } from "primeng/calendar";
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from "primeng/inputtext";
import { debounceTime, distinctUntilChanged, filter, of, shareReplay, switchMap, tap } from 'rxjs';
import { BooksService } from "../../../core/services/book.service";
import { BooksStore } from "../../../core/store/books/books.store";

export interface IGoogleBook  {
  volumeInfo : {
    authors?: string[],
    publishedDate: string,
    title: string
  }
}

@Component({
    selector: 'app-book',
    imports: [
        CommonModule,
        AutoCompleteModule,
        ReactiveFormsModule,
        ButtonModule,
        InputTextModule,
        RouterModule,
        CalendarModule,
        CardModule,
        ButtonModule,
        DividerModule
    ],
    templateUrl: './book.component.html',
    styleUrl: './book.component.scss',
    changeDetection: ChangeDetectionStrategy.Default
})
export class BookComponent { 

  filteredBooks: IGoogleBook[] = [];

  editorMode : 'create-book' | 'update-book' = 'create-book';

  googleBookControl = new FormControl<string>('');

  bookForm = new FormGroup({
    _id: new FormControl<string | undefined>(undefined),
    title: new FormControl<string | undefined>(
      undefined, {validators: [Validators.required]
    }),
    authors: new FormArray([new FormControl<string | undefined>(undefined)]),
    publishedDate: new FormControl<Date | undefined>(undefined, {
      validators: [Validators.required],
    }),
  });

  booksStore = inject(BooksStore);

  constructor(
    private booksService: BooksService,
    private router: Router,
    private cd: ChangeDetectorRef,
    activatedRoute: ActivatedRoute,
  ) {
   
    this.googleBookControl.valueChanges.pipe(
      filter(searchTerm => typeof(searchTerm) === 'string'),
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(val => val ? this.booksService.searchBookOnGoogleApi(val) : of()),
      shareReplay(1),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tap((res: any) => this.filteredBooks =  res['items'] ? res['items'] : []),
      tap(() => this.cd.detectChanges())
    ).subscribe();


    // const bookId = route.paramMap.get('id');
    const bookId = activatedRoute.snapshot.params['id']; 

    if(bookId) {
      this.editorMode = "update-book";
      const book: IBook = this.booksStore.booksEntities().find(b => b._id === bookId) as IBook;
      this.bookForm.setValue(book);
    }

  }

  get authors(): FormArray {
    return this.bookForm.get('authors') as FormArray;
  }

  addAuthor() {
    this.authors.push(new FormControl<string>(''));
  }

  removeAuthor(index: number): void {
    this.authors.removeAt(index);
  }

  setupBookFromGoogle(googleBook: IGoogleBook) {
    this.bookForm.setValue({
      _id: this.bookForm.controls._id.value,
      authors: googleBook.volumeInfo.authors || [''],
      publishedDate: googleBook.volumeInfo.publishedDate ? new Date(googleBook.volumeInfo.publishedDate) : undefined,
      title: googleBook.volumeInfo.title || undefined
    })
  }

  submitBook() {
    
    if (this.bookForm.valid){
      const book: IBook = {
        _id: this.bookForm.getRawValue()._id as string,
        title: this.bookForm.getRawValue().title as string,
        authors: this.bookForm.getRawValue().authors as string[],
        publishedDate: this.bookForm.getRawValue().publishedDate as Date,
      };
      
      if (this.editorMode === "create-book") {
        this.booksService.createBook(book)
        .subscribe({
          // error: err => this.errorMsg.set(err?.error?.message),
          complete: () => this.router.navigate(['books'])
        }); 
      } else if(this.editorMode === "update-book") {
        this.booksService.updateBook(book)
        .subscribe({
          // error: err => this.errorMsg.set(err?.error?.message),
          complete: () => this.router.navigate(['books'])
        }); 
      }
    }

  }

}
