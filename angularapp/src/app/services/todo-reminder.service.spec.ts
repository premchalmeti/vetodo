import { TestBed } from '@angular/core/testing';

import { TodoReminderService } from './todo-reminder.service';

describe('TodoReminderService', () => {
  let service: TodoReminderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoReminderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
