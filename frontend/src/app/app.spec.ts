// <reference types="vitest" />
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { App } from './app';

// 1. We build our own fake HttpClient using pure TypeScript. 
// No Jasmine types required. No open request queues to manage!
class MockHttpClient {
  lastPostUrl = '';
  lastDeleteUrl = '';

  get() {
    return of([]); // Instantly returns an empty array for ngOnInit
  }
  post(url: string) {
    this.lastPostUrl = url;
    return of({}); // Instantly returns success
  }
  put() {
    return of({});
  }
  delete(url: string) {
    this.lastDeleteUrl = url;
    return of({});
  }
}

describe('Task Manager - Ultimate Vanilla Tests', () => {

  beforeEach(async () => {
    // 2. THIS IS THE MAGIC LINE! 
    // It forces Vitest/Jest to completely wipe the memory before every test,
    // destroying the "already instantiated" error forever.
    TestBed.resetTestingModule();

    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        // 3. Tell Angular to use our Vanilla Mock instead of the real one
        { provide: HttpClient, useClass: MockHttpClient }
      ]
    }).compileComponents();
  });

  it('Test 1: should load the component successfully', () => {
    const fixture = TestBed.createComponent(App);
    // detectChanges() fires the GET request, which our mock instantly handles safely
    fixture.detectChanges(); 
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('Test 2: should render the Task Manager title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Task Manager');
  });

  it('Test 3: should add a task via POST', () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    // Grab our fake client to see what the component did to it
    const mockHttp = TestBed.inject(HttpClient) as unknown as MockHttpClient;

    component.newTask = { title: 'Vanilla Task', description: 'Test', priority: 'high' };
    component.createTask();

    // Verify the component successfully sent a POST request to the right URL
    expect(mockHttp.lastPostUrl).toBe('http://127.0.0.1:8000/tasks');
  });

  it('Test 4: should delete a task via DELETE', () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    const mockHttp = TestBed.inject(HttpClient) as unknown as MockHttpClient;

    component.deleteTask('test-123');

    // Verify the component sent a DELETE request to the right URL
    expect(mockHttp.lastDeleteUrl).toBe('http://127.0.0.1:8000/tasks/test-123');
  });

  it('Test 5: should filter tasks correctly', () => {
    const fixture = TestBed.createComponent(App);
    const component = fixture.componentInstance;
    fixture.detectChanges();

    // Push test data directly into the Signal
    component.tasks.set([
      { id: '1', title: 'Task 1', description: 'desc', priority: 'low' },
      { id: '2', title: 'Task 2', description: 'desc', priority: 'high' }
    ]);

    // Change the filter dropdown
    component.filterPriority.set('low');

    // The Computed Signal should instantly recalculate
    expect(component.filteredTasks().length).toBe(1);
    expect(component.filteredTasks()[0].priority).toBe('low');
  });
});