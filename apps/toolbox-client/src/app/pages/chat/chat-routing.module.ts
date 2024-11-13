import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat.component';
// import { ExperienceComponent } from './components/experiences/experience/experience.component';

const musicRoutes: Routes = [

{ path: '',
component: ChatComponent
,
},
];

@NgModule({
  imports: [RouterModule.forChild(musicRoutes
    )],
  exports: [RouterModule]
})
export class ChatRoutingModule { }
