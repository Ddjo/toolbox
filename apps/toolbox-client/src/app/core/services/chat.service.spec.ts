import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CHAT_ROOM_UPDATE_EVENT, ChatRoomUpdateType } from '@constants';
import { chatRoomsMock, ChatRoomUpdateEvent, usersMocks } from '@libs/common';
import { Socket, SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { of, Subject } from 'rxjs';
import { environment } from '../../../environments/environments';
import { ChatService } from './chat.service';


// jest.mock('ngx-socket-io', () => ({
//   Socket: jest.fn().mockImplementation(() => ({
//     fromEvent: jest.fn(),
//     emit: jest.fn(),
//   })),
// }));

const config: SocketIoConfig = { url: environment.chatWsUrl };
const mockChatRoomId = 'room1';
const chatRoomMock = chatRoomsMock[0];

describe('ChatService', () => {

  const url = environment.gatewayApiUrl + '/chat';
  
  let chatService: ChatService;
  let mockSocket: Socket;
  let chatRoomUpdateSubject: Subject<ChatRoomUpdateEvent>;
  let httpTestingController: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ SocketIoModule.forRoot(config) ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        
      ]
    });
    
    chatService = TestBed.inject(ChatService);
    // mockSocket = TestBed.inject(Socket);
    chatRoomUpdateSubject = new Subject<ChatRoomUpdateEvent>();
    
    httpTestingController = TestBed.inject(HttpTestingController);
    
    // chatService.connect((val) => {
    //   console.log(val)
    // })

    // Mock `fromEvent` to use the subject
    chatService.fromEvent = jest.fn().mockImplementation((event) => {
      if (event.includes(`${mockChatRoomId}-${CHAT_ROOM_UPDATE_EVENT}`)) {
        return chatRoomUpdateSubject.asObservable();
      }
      return of();
    });

  });

  afterEach(() => {
    // httpTestingController.verify();
  })

  it('should be created', () => {
    // console.log('chatService', chatService)
    expect(chatService).toBeTruthy();
  });

  it('should handle NewMessage event correctly', done  => {
    const mockMessage = { content: 'Hello', sender: 'user1' };
    const mockEvent: ChatRoomUpdateEvent = {
      updateType: ChatRoomUpdateType.NewMessage,
      payload: mockMessage,
      chatRoomId: mockChatRoomId
    };

    chatRoomMock._id = mockChatRoomId;
    chatService.chatRoomsStore.setChatRoom(chatRoomMock);

    const addMessageToChatRoomSpy = jest.spyOn(chatService.chatRoomsStore, 'addMessageToChatRoom');
    const activateChatRoomInStorageSpy = jest.spyOn(chatService, 'activateChatRoomInStorage');

    chatService.subscribeToChatRoomUpdates(mockChatRoomId);
    chatRoomUpdateSubject.next(mockEvent);

    expect(addMessageToChatRoomSpy).toHaveBeenCalledWith(
      mockChatRoomId,
      mockMessage
    );

    expect(activateChatRoomInStorageSpy).toHaveBeenCalledWith(
      mockChatRoomId,
    );

    done();
  });

  it('should handle user typing event correctly', done  => {
    // const mockMessage = { content: 'Hello', sender: 'user1' };
    const mockEvent: ChatRoomUpdateEvent = {
      updateType: ChatRoomUpdateType.UserTyping,
      payload: {userEmail: usersMocks[0].email},
      chatRoomId: mockChatRoomId
    };

    chatRoomMock._id = mockChatRoomId;
    chatService.chatRoomsStore.setChatRoom(chatRoomMock);

    const addTypingUserSpy = jest.spyOn(chatService.chatRoomsStore, 'addTypingUser');
    const checkTypingUserInStoreSpy = jest.spyOn(chatService, 'checkTypingUserInStore');

    jest.useFakeTimers();

    chatService.subscribeToChatRoomUpdates(mockChatRoomId);
    chatRoomUpdateSubject.next(mockEvent);
    // jest.useRealTimers();

    expect(addTypingUserSpy).toHaveBeenCalledWith(
      mockChatRoomId,
      usersMocks[0].email
    );

    
    jest.runAllTimers()
    // jest.advanceTimersByTime(chatService.typingUserDisplayTimeMs);
    setTimeout(() => {
      expect(checkTypingUserInStoreSpy).toHaveBeenCalledWith(
        mockChatRoomId,
        usersMocks[0].email
      );
      });

      
    done();
  });

  it('should handle user untyping event correctly', done  => {
    // const mockMessage = { content: 'Hello', sender: 'user1' };
    const mockEvent: ChatRoomUpdateEvent = {
      updateType: ChatRoomUpdateType.UserUntyping,
      payload: {userEmail: usersMocks[0].email},
      chatRoomId: mockChatRoomId
    };

    chatRoomMock._id = mockChatRoomId;
    chatService.chatRoomsStore.setChatRoom(chatRoomMock);

    const removeTypingUserSpy = jest.spyOn(chatService.chatRoomsStore, 'removeTypingUser');

    chatService.subscribeToChatRoomUpdates(mockChatRoomId);
    chatRoomUpdateSubject.next(mockEvent);

    expect(removeTypingUserSpy).toHaveBeenCalledWith(
      mockChatRoomId,
      usersMocks[0].email
    );

    done();
  });

  it('should handle seen message event correctly', done  => {
    const mockMessage = { content: 'Hello', sender: 'user1' };
    const mockEvent: ChatRoomUpdateEvent = {
      updateType: ChatRoomUpdateType.SeenMessage,
      payload: mockMessage,
      chatRoomId: mockChatRoomId
    };

    chatRoomMock._id = mockChatRoomId;
    chatService.chatRoomsStore.setChatRoom(chatRoomMock);

    const updateChatMessageInChatRoomSpy = jest.spyOn(chatService.chatRoomsStore, 'updateChatMessageInChatRoom');

    chatService.subscribeToChatRoomUpdates(mockChatRoomId);
    chatRoomUpdateSubject.next(mockEvent);

    expect(updateChatMessageInChatRoomSpy).toHaveBeenCalledWith(
      mockChatRoomId,
      mockMessage
    );

    done();
  });
  // it('should send a message via WebSocket', () => {
  //   const mockChatRoom = { _id: 'room1' } as IChatRoom;
  //   const mockSender = usersMocks[0];
  //   const mockContent = 'Hello';
  //   const mockSocketEmitSpy = jest.spyOn(chatService, 'emit');

  //   chatService.subscribeToChatRoomUpdates('room1');
  //   chatService.sendMessage(mockChatRoom, mockSender, mockContent);

  //   expect(mockSocketEmitSpy).toHaveBeenCalledWith('CHAT_MESSAGE_SEND_MESSAGE', {
  //     chatRoom: mockChatRoom,
  //     sender: mockSender,
  //     content: mockContent,
  //   });
  // });

  // it('should clean up on destroy', () => {
  //   const destroySpy = jest.spyOn(chatService['destroy$'], 'next');
  //   chatService.ngOnDestroy();
  //   expect(destroySpy).toHaveBeenCalledWith();
  // });

});
