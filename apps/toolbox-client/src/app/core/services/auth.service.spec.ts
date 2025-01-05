import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { usersMocks } from '@libs/common';
import { environment } from '../../../environments/environments';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';


describe('AuthService', () => {

  let authService: AuthService;
  let localStorageService: LocalStorageService;
  let httpTestingController: HttpTestingController;
  const url = environment.authApiUrl + '/auth';
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    });

    authService = TestBed.inject(AuthService);
    localStorageService = TestBed.inject(LocalStorageService);

    httpTestingController = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpTestingController.verify();
  })

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should login', () => {
    authService.login({email: 'test-email@test.com', password: 'test-password'}).subscribe({
      next: (data) => {
        expect(data).toEqual(usersMocks[0]);
      },
      error: jest.fn(),
    });

    const req = httpTestingController.expectOne(`${url}/login`);
    expect(req.request.method).toBe('POST');
    req.flush(usersMocks[0])

  });

  it('should logout', () => {
    authService.logout().subscribe({
      next: (data) => {
        expect(data).toEqual(usersMocks[0]);
      },
      error: jest.fn(),
    });

    const req = httpTestingController.expectOne(`${url}/logout`);
    expect(req.request.method).toBe('POST');
    req.flush(usersMocks[0]) 

  });

  it('should get no user infos in local storage', () => {
    const accessInfoSpy = jest.spyOn(authService, 'getAccessInfo');

    authService.getAccessInfo();

    expect(accessInfoSpy).toHaveBeenCalled();
    expect(accessInfoSpy).toHaveReturnedWith(null);

  });

  it('should return user from getAccessInfo', () => {
    // Mock the get method of LocalStorageService
    const mockUser = 'mockAccessToken';
    jest.spyOn(localStorageService, 'get').mockReturnValue(mockUser);

    // Call getAccessInfo and expect it to return the mocked user
    const result = authService.getAccessInfo();
    expect(result).toBe(mockUser);

    // Ensure the get method was called with the correct key
    expect(localStorageService.get).toHaveBeenCalledWith('access-token'); // Replace 'accessToken' with LocalStorageVars.accessToken if it's a variable
  });

});
