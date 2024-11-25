import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IBook } from "@libs/common";
import { LibraryFacade } from '@site/shared-store';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Observable } from 'rxjs';

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
  providers : [
    LibraryFacade
  ]
})
export class LibraryComponent implements OnInit {

  libraryFacade = inject(LibraryFacade);
  allBooksInLibrary$: Observable<IBook[]>;

constructor() {
    this.allBooksInLibrary$ = this.libraryFacade.allBooksInLibrary$;
  }
  
  ngOnInit(): void {
    this.libraryFacade.getBooksFromLibrary();

    this.allBooksInLibrary$.subscribe(console.log)
    }
  
  removeBookFromLibrary(id: string) {
    this.libraryFacade.removeBookFromLibrary(id);
  }

}
