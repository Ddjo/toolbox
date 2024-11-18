import { ChangeDetectionStrategy, Component } from '@angular/core';
import { HeaderComponent } from '../../core/shell/layout/header/header.component';

const SystemMessage = {
    id: 1,
    body: "Welcome to the Nest Chat app",
    author: "Bot",
};

@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrl: './chat.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
      HeaderComponent
    ]
})
export class ChatComponent  {
    // socket = io('http://localhost:3000', { autoConnect: false });

    // ngOnInit(): void {
    //     this.socket.connect(); // connect to socket

    //     this.socket.on("connect", () => { // fire when we have connection
    //       console.log("Socket connected");
    //     });
    
    //     this.socket.on("disconnect", () => { // fire when socked is disconnected
    //       console.log("Socket disconnected");
    //     });
    
    //     // listen chat event messages
    //     this.socket.on("chat", (newMessage) => {
    //       console.log("New message added", newMessage);
    //     //   setMessages((previousMessages) => [...previousMessages, newMessage]);
    //     });
    // }
    
 }
