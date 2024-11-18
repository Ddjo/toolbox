import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../../core/shell/layout/header/header.component';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    HeaderComponent
  ]
})
export class SandboxComponent  {


}
