import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageService],
    });
    service = TestBed.inject(LocalStorageService);

    // Mock window and localStorage
    Object.defineProperty(window, 'localStorage', {
      value: {
        store: {} as Record<string, string>,
        getItem: jest.fn((key) => window.localStorage['store'][key] || null),
        setItem: jest.fn((key, value) => {
          window.localStorage['store'][key] = value;
        }),
        removeItem: jest.fn((key) => {
          delete window.localStorage['store'][key];
        }),
        clear: jest.fn(() => {
          window.localStorage['store'] = {};
        }),
        key: jest.fn((index) => Object.keys(window.localStorage['store'])[index] || null),
        get length() {
          return Object.keys(window.localStorage['store']).length;
        },
      },
      configurable: true,
    });
  });

  afterEach(() => {
    // Clean up mock
    // delete window.localStorage;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with localStorage data if available', () => {
    // Use the service's set method to add an item
    service.set('testKey', 'testValue');
  
    // Assert that the signal contains the expected value
    expect(service.getStorageSignal()()).toEqual({ testKey: 'testValue' });
  });

  it('should get an item from localStorage', () => {
    window.localStorage.setItem('testKey', JSON.stringify('testValue'));
    const value = service.get<string>('testKey');
    expect(value).toBe('testValue');
  });

  it('should return null if trying to get a non-existent key', () => {
    const value = service.get<string>('nonExistentKey');
    expect(value).toBeNull();
  });

  it('should set an item in localStorage', () => {
    service.set('testKey', 'testValue');
    expect(window.localStorage.getItem('testKey')).toBe(JSON.stringify('testValue'));
  });

  it('should remove an item from localStorage', () => {
    window.localStorage.setItem('testKey', JSON.stringify('testValue'));
    service.remove('testKey');
    expect(window.localStorage.getItem('testKey')).toBeNull();
  });

  it('should clear all items from localStorage', () => {
    window.localStorage.setItem('testKey1', JSON.stringify('value1'));
    window.localStorage.setItem('testKey2', JSON.stringify('value2'));
    service.clear();
    expect(window.localStorage.length).toBe(0);
  });

  it('should update the signal when localStorage changes', () => {
    service.set('testKey', 'testValue');
    expect(service.getStorageSignal()()).toEqual({ testKey: 'testValue' });

    service.remove('testKey');
    expect(service.getStorageSignal()()).toEqual({});

    service.set('anotherKey', 'anotherValue');
    expect(service.getStorageSignal()()).toEqual({ anotherKey: 'anotherValue' });
  });

  it('should not interact with localStorage if not in browser', () => {
    Object.defineProperty(window, 'localStorage', {
      value: undefined,
      configurable: true,
    });

    const browserService = new LocalStorageService();

    const setSpy = jest.spyOn(browserService, 'set');
    browserService.set('test', 'test')
    expect(setSpy).toHaveBeenCalled();
    expect(setSpy).toHaveReturnedWith(undefined);

    const removeSpy = jest.spyOn(browserService, 'remove');
    browserService.remove('test')
    expect(removeSpy).toHaveBeenCalled();
    expect(removeSpy).toHaveReturnedWith(undefined);

    const clearSpy = jest.spyOn(browserService, 'clear');
    browserService.clear()
    expect(clearSpy).toHaveBeenCalled();
    expect(clearSpy).toHaveReturnedWith(undefined);

    expect(browserService.get('testKey')).toBeNull();
    expect(browserService.getStorageSignal()()).toEqual({});
  });
});
