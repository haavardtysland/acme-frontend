export class Finder {
  private _keyWord: string | null;
  private _fromPrice: number | null;
  private _toPrice: number | null;
  private _fromDate: string | null;
  private _toDate: string | null;

  constructor() {
    this._keyWord = null;
    this._fromPrice = null;
    this._toPrice = null;
    this._fromDate = null;
    this._toDate = null;
  }

  public get keyWord(): string | null {
    return this._keyWord;
  }
  public get fromPrice(): number | null {
    return this._fromPrice;
  }
  public get toPrice(): number | null {
    return this._toPrice;
  }
  public get fromDate(): string | null {
    return this._fromDate;
  }
  public get toDate(): string | null {
    return this._toDate;
  }

  public set keyWord(keyWord: string | null) {
    this._keyWord = keyWord;
  }
  public set fromPrice(fromPrice: number | null) {
    this._fromPrice = fromPrice;
  }
  public set toPrice(toPrice: number | null) {
    this._toPrice = toPrice;
  }
  public set fromDate(fromDate: string | null) {
    this._fromDate = fromDate;
  }
  public set toDate(toDate: string | null) {
    this._toDate = toDate;
  }
  public static toJson(finder: Finder) {
    const obj = {
      keyWord: finder.keyWord,
      fromDate: finder.fromDate,
      toDate: finder.toDate,
      fromPrice: finder.fromPrice,
      toPrice: finder.toPrice,
    };
    return JSON.stringify(obj);
  }
}
