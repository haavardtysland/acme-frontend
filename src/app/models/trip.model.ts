import { Application } from './application.model';
import { Entity } from './entity.model';
import { Stage } from './stage.model';
import { TripStatus } from './trip-status.model';

export class Trip extends Entity {
  private _ticker: string;
  private _title: string;
  private _description: string;
  private _totalPrice: number;
  private _requirements: string[];
  private _startDate: string;
  private _endDate: string;
  private _pictures!: string[];
  private _status: TripStatus;
  private _stages: Stage[];
  private _managerId: string;
  private _applications: Application[];

  constructor() {
    super();
    this._ticker = '';
    this._description = '';
    this._title = '';
    this._totalPrice = 0;
    this._requirements = [];
    this._startDate = '';
    this._endDate = '';
    this._pictures = [];
    this._stages = [];
    this._status = new TripStatus();
    this._managerId = '';
    this._applications = [];
  }

  public get ticker(): string {
    return this._ticker;
  }
  public get title(): string {
    return this._title;
  }

  public get description(): string {
    return this._description;
  }

  public get totalPrice(): number {
    return this._totalPrice;
  }

  public get requirements(): string[] {
    return this._requirements;
  }

  public get startDate(): string {
    return this._startDate;
  }
  public get pictures(): string[] {
    return this._pictures;
  }

  public get endDate(): string {
    return this._endDate;
  }

  public get status(): TripStatus {
    return this._status;
  }

  public get stages(): Stage[] {
    return this._stages;
  }

  public get managerId(): string {
    return this._managerId;
  }

  public get applications(): Application[] {
    return this._applications;
  }

  public set applications(applications: Application[]) {
    this._applications = applications;
  }

  public set ticker(ticker: string) {
    this._ticker = ticker;
  }

  public set managerID(managerId: string) {
    this._managerId = managerId;
  }

  public set description(description: string) {
    this._description = description;
  }

  public set totalPrice(price: number) {
    this._totalPrice = price;
  }

  public set requirements(requirements: string[]) {
    this._requirements = requirements;
  }

  public set startDate(startDate: string) {
    this._startDate = startDate;
  }

  public set endDate(endDate: string) {
    this._endDate = endDate;
  }

  public set status(status: TripStatus) {
    this._status = status;
  }

  public set stages(stages: Stage[]) {
    this._stages = stages;
  }

  public set title(title: string) {
    this._title = title;
  }
}
