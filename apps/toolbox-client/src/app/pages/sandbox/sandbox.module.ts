
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SandboxRoutingModule } from './sandbox-routing.module';
import { SandboxComponent } from './sandbox.component';
import { HeaderModule } from '../../core/shell/layout/header/header.module';


@NgModule({
  declarations: [
    SandboxComponent,
  ],
  imports: [
    CommonModule,
    SandboxRoutingModule,
    HeaderModule
  ],
})
export class SandboxModule { }
