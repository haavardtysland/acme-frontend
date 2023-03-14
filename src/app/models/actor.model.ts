import { Finder } from './finder.model';

enum Role {
  Administrator = 'ADMINISTRATOR',
  Manager = 'MANAGER',
  Explorer = 'EXPLORER',
}

export class Actor {
  private _id: string;
  private _name: string;
  private _surname: string;
  private _email: string;
  private _phone?: string;
  private _address?: string;
  private _role: Role;
  private _password: string;
  private _finder: Finder;

  constructor(
    id: string,
    name: string,
    surname: string,
    email: string,
    role: Role,
    password: string,
    finder: Finder,
    phone?: string,
    address?: string
  ) {
    this._id = id;
    this._name = name;
    this._surname = surname;
    this._email = email;
    this._phone = phone;
    this._address = address;
    this._role = role;
    this._password = password;
    this._finder = finder;
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }
  public get surname(): string {
    return this._surname;
  }

  public get fullName(): string {
    return this._name + ' ' + this._surname;
  }

  public get email(): string {
    return this._email;
  }
  public get phone(): string | undefined {
    return this._phone;
  }

  public get address(): string | undefined {
    return this._address;
  }

  public get role(): Role {
    return this._role;
  }

  public get password(): string {
    return this._password;
  }
  public get finder(): Finder {
    return this._finder;
  }
}
