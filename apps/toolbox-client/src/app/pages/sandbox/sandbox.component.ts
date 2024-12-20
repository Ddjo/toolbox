import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'app-sandbox',
    templateUrl: './sandbox.component.html',
    styleUrls: ['./sandbox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SandboxComponent  {


}
