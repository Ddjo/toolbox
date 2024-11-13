import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

const SandboxRoutes: Routes = [

{ path: '',
component: HomeComponent
,
},
];

@NgModule({
  imports: [RouterModule.forChild(SandboxRoutes
    )],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
