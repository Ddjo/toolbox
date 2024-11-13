
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SandboxRoutingModule } from './sandbox-routing.module';
import { SandboxComponent } from './sandbox.component';


@NgModule({
  declarations: [
    SandboxComponent,
  ],
  imports: [
    CommonModule,
    SandboxRoutingModule,
  ],
})
export class SandboxModule { }
