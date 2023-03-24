import { Role } from '../enums/RoleEnum';
import { Entity } from './entity.model';

export class Actor extends Entity {
  private _name: string;
  private _surname: string;
  private _email: string;
  private _password: string;
  private _phone!: string;
  private _address!: string;
  private _role: Role;
  private _ban: boolean;

  constructor() {
    super();
    this._name = '';
    this._surname = '';
    this._email = '';
    this._password = '';
    this._ban = false;
    this._role = Role.EXPLORER;
  }

  public get name(): string {
    return this._name;
  }
  public get surname(): string {
    return this._surname;
  }
  public get email(): string {
    return this._email;
  }
  public get password(): string {
    return this._password;
  }
  public get phone(): string {
    return this._phone;
  }
  public get address(): string {
    return this._address;
  }
  public get role(): Role {
    return this._role;
  }
  public get ban(): boolean {
    return this._ban;
  }

  public set name(name: string) {
    this._name = name;
  }
  public set surname(surname: string) {
    this._surname = surname;
  }
  public set email(email: string) {
    this._email = email;
  }
  public set password(password: string) {
    this._password = password;
  }
  public set phone(phone: string) {
    this._phone = phone;
  }
  public set address(address: string) {
    this._address = address;
  }
  public set role(role: Role) {
    this._role = role;
  }
  public set ban(ban: boolean) {
    this._ban = ban;
  }

  public getJson() {
    const obj = {
      name: this._name,
      surname: this._surname,
      email: this._email,
      password: this._password,
      phone: this._phone,
      address: this._address,
      role: this._role,
      isBanned: this._ban,
    };
    return JSON.stringify(obj);
  }
}
