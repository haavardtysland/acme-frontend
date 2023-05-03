import { Entity } from './entity.model';

export class Stage extends Entity {
  private _title: string;
  private _description: string;
  private _price: number;

  constructor() {
    super();
    this._title = '';
    this._description = '';
    this._price = 0;
  }

  public get title(): string {
    return this._title;
  }
  public get description(): string {
    return this._description;
  }
  public get price(): number {
    return this._price;
  }

  public set title(title: string) {
    this._title = title;
  }

  public set price(price: number) {
    this._price = price;
  }

  public set description(description: string) {
    this._description = description;
  }

  public static toObject(stages: Stage[]) {
    const stageList: Object[] = [];
    stages.forEach((stage) => {
      const obj = {
        title: stage.title,
        description: stage.description,
        price: stage.price,
      };
      stageList.push(obj);
    });

    return stageList;
  }
}
