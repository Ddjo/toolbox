import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../../core/shell/layout/header/header.component';

@Component({
  selector: 'app-books-crud',
  templateUrl: './books-crud.component.html',
  styleUrls: ['./books-crud.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    HeaderComponent
  ]
})
export class BooksCrudComponent  {


}
