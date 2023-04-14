import { ApplicationStatus } from './application-status.model';

export class Application {
  private _dateCreated: string;
  private _status: ApplicationStatus;
  private _comments: string[];
  private _explorerId: string;

  constructor() {
    this._dateCreated = '';
    this._status = new ApplicationStatus();
    this._comments = [];
    this._explorerId = '';
  }

  public get explorerId(): string {
    return this._explorerId;
  }
  public get dateCreated(): string {
    return this._dateCreated;
  }

  public get status(): ApplicationStatus {
    return this._status;
  }

  public get comments(): string[] {
    return this._comments;
  }
  public set dateCreated(dateCreated: string) {
    this._dateCreated = dateCreated;
  }
  public set explorerId(explorerId: string) {
    this._explorerId = explorerId;
  }

  public set status(status: ApplicationStatus) {
    this._status = status;
  }

  public set comments(comments: string[]) {
    this._comments = comments;
  }
}
