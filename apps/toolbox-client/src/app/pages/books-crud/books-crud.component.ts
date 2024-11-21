import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../../core/shell/layout/header/header.component';
import { ButtonModule } from 'primeng/button';
import { BookService } from '../../core/services/book.service';

@Component({
  selector: 'app-books-crud',
  templateUrl: './books-crud.component.html',
  styleUrls: ['./books-crud.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    HeaderComponent,
    ButtonModule
  ]
})
export class BooksCrudComponent  {

  constructor(private booksService: BookService) {}

  testBooks() {
    this.booksService.testBooks().subscribe();
  }

}
