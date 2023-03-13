export class Finder {
  private _keyWord?: string;
  private _fromPrice?: number;
  private _toPrice?: number;
  private _fromDate?: Date;
  private _toDate?: Date;

  constructor(
    keyWord?: string,
    fromPrice?: number,
    toPrice?: number,
    fromDate?: Date,
    toDate?: Date
  ) {
    this._keyWord = keyWord;
    this._fromPrice = fromPrice;
    this._toPrice = toPrice;
    this._fromDate = fromDate;
    this._toDate = toDate;
  }

  public get keyWord(): string | undefined {
    return this._keyWord;
  }
  public get fromPrice(): number | undefined {
    return this._fromPrice;
  }
  public get toPrice(): number | undefined {
    return this._toPrice;
  }
  public get fromDate(): Date | undefined {
    return this._fromDate;
  }
  public get toDate(): Date | undefined {
    return this._toDate;
  }
}
