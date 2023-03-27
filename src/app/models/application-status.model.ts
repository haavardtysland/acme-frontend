import { AStatus } from '../enums/AStatus';

export class ApplicationStatus {
  private _description: string;
  private _status: AStatus;
  

  constructor() {
    this._description = '';
    this._status = AStatus.PENDING;
  }

  public get description(): string {
    return this._description;
  }

  public get status(): AStatus {
    return this._status;
  }

  public set description(description: string) {
    this._description = description;
  }

  public set status(status: AStatus) {
    this._status = status;
  }

}
