import { inject, Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { ChatService } from "../../../core/services/chat.service";
import { ChatRoomsStore } from "../../../../../src/app/core/store/chat/chat-room.store";
import { catchError, forkJoin, map, Observable, of } from "rxjs";
import { UsersService } from "../../../../../src/app/core/services/users.service";
import { UsersStore } from "../../../../../src/app/core/store/users/users.store";


@Injectable({ providedIn: 'root' })
export class ChatPageResolver implements Resolve<boolean> {

    readonly chatService = inject(ChatService);
    readonly usersService = inject(UsersService);
    readonly chatRoomsStore = inject(ChatRoomsStore);
    readonly usersStore = inject(UsersStore);

    resolve(): Observable<boolean> {

        const getChatRoom$ = !this.chatRoomsStore.loaded() ? this.chatService.getChatRooms().pipe(
            map(() => true),
            catchError((err) => {
             console.log('chatRoomsStore resolver - get getChatRooms - err : ', err);
             return of(false)}),
         ) : of(true);

        const getUsers$ =  !this.usersStore.loaded() ? this.usersService.getAllUsers().pipe(
            map(() => true),
            catchError((err) => {
             console.log('chatRoomsStore resolver - get getUsers - err : ', err);
             return of(false)}),
         ) : of(true);

         return forkJoin([getChatRoom$, getUsers$]).pipe(map(() => true));

        // if (!this.chatRoomsStore.loaded()) {
        //    return this.chatService.getChatRooms().pipe(
        //        map(() => true),
        //        catchError((err) => {
        //         console.log('chatRoomsStore resolver - get getChatRooms - err : ', err);
        //         return of(false)}),
        //     );
        // } else {
        //     return of(true);
        // }
    }
}
