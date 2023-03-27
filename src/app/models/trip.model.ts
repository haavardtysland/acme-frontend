import { Entity } from './entity.model';
import { Stage } from './stage.model';
import { TripStatus } from './trip-status.model';

export class Trip extends Entity {
  private _ticker: string;
  private _title: string;
  private _description: string;
  private _price: number;
  private _requirements: string[];
  private _startDate: string;
  private _endDate: string;
  private _pictures!: string;
  private _status: TripStatus;
  private _stages: Stage[];

  constructor() {
    super();
    this._ticker = '';
    this._description = '';
    this._title = '';
    this._price = 0;
    this._requirements = [];
    this._startDate = '';
    this._endDate = '';
    this._stages = [];
    this._status = new TripStatus();
  }

  public get ticker(): string {
    return this._ticker;
  }

  public get description(): string {
    return this._description;
  }

  public get price(): number {
    return this._price;
  }

  public get requirements(): string[] {
    return this._requirements;
  }

  public get startDate(): string {
    return this._startDate;
  }

  public get endDate(): string {
    return this.endDate;
  }

  public get status(): TripStatus {
    return this._status;
  }

  public get stages(): Stage[] {
    return this._stages;
  }

  public set ticker(ticker: string) {
    this._ticker = ticker;
  }

  public set description(description: string) {
    this._description = description;
  }

  public set price(price: number) {
    this._price = price;
  }

  public set requirements(requirements: string[]) {
    this._requirements = requirements;
  }

  public set startDate(startDate: string) {
    this._startDate = startDate;
  }

  public set endDate(endDate: string) {
    this.endDate = endDate;
  }

  public set status(status: TripStatus) {
    this._status = status;
  }

  public set stages(stages: Stage[]) {
    this._stages = stages;
  }
}
