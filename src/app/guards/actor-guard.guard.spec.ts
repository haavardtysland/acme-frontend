import { TestBed } from '@angular/core/testing';

import { ActorGuardGuard } from './actor-guard.guard';

describe('ActorGuardGuard', () => {
  let guard: ActorGuardGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ActorGuardGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
