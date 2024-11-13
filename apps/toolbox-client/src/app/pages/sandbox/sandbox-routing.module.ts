import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { SandboxComponent } from './sandbox.component';

const SandboxRoutes: Routes = [

{ 
  path: '',component: SandboxComponent,
},
];

@NgModule({
  imports: [RouterModule.forChild(SandboxRoutes
    )],
  exports: [RouterModule]
})
export class SandboxRoutingModule { }
