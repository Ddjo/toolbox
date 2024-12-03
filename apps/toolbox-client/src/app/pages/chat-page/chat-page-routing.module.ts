import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatPageComponent } from './chat-page.component';

const chatPageRoutes: Routes = [
  { 
    path: '',
    component: ChatPageComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(chatPageRoutes)],
  exports: [RouterModule]
})
export class ChatRoutingModule { } 
