import { _decorator, Component, error, Node, resources, SpriteFrame } from "cc";
import { User } from "../models/Model";
const { ccclass } = _decorator;

@ccclass("UserPre")
export class UserPre extends Component {
  private key: string;

  static get(key: string, defaultValue: string): string {
    return localStorage.getItem(key) || defaultValue;
  }

  static set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  static saveUserData(user: User) {
    localStorage.setItem(typeof User, user.toJson());
  }

  static getUserData(): any {
    let fromLocal = localStorage.getItem(typeof User);
    return fromLocal != null ? User.fromJson(fromLocal) : null;
  }


}
