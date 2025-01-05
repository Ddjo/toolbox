import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';
import { HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environments';
import { usersMocks } from '@libs/common';
import { UsersStore } from '../store/users/users.store';


describe('UserService', () => {

  let usersService: UsersService;
  let httpTestingController: HttpTestingController;
  const url = environment.authApiUrl + '/users';
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });

    usersService = TestBed.inject(UsersService);
    
    httpTestingController = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpTestingController.verify();
  })

  it('should be created', () => {
    expect(usersService).toBeTruthy();
  });

  it('should get the user', () => {
    usersService.getUser().subscribe({
      next: (data) => {
        expect(data).toEqual(usersMocks[0]);
      },
      error: jest.fn(),
    });

    const req = httpTestingController.expectOne(`${url}/me`);
    expect(req.request.method).toBe('GET');
    req.flush(usersMocks[0])

  });

  it('should create the user', () => {
    usersService.createUser({email: 'test-email@test.com', password: 'test-password'}).subscribe({
      next: (data) => {
        expect(data).toEqual(usersMocks[0]);
      },
      error: jest.fn(),
    });

    const req = httpTestingController.expectOne(`${url}`);
    expect(req.request.method).toBe('POST');
    req.flush(usersMocks[0]) 

  });

  it('should load the users list in the store', () => {
    const usersStore = TestBed.inject(UsersStore);
    usersService.loadUsersStore();

    const req = httpTestingController.expectOne(`${url}`);
    expect(req.request.method).toBe('GET');
    req.flush(usersMocks) 

    expect(usersStore.usersEntities()).toEqual(usersMocks);

  });

});
