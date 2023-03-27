import { TStatus } from '../enums/TStatus';

export class TripStatus {
  private _status: TStatus;
  private _description: string;

  constructor() {
    this._status = TStatus.ACTIVCE;
    this._description = '';
  }

  public get status(): TStatus {
    return this._status;
  }

  public get description(): string {
    return this._description;
  }

  public set status(status: TStatus) {
    this._status = status;
  }

  public set description(description: string) {
    this._description = description;
  }

  
}
