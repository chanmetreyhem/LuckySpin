export class User {
  id: string;
  name: string;
  coin: number;
  spinCounter: number;
  lastSpin: number;
  historyPrizes: Prize[];

  constructor(
    id: string,
    name: string,
    coin: number,
    spinCounter: number,
    lastSpin: number,
    historyPrizes: Prize[]
  ) {
    this.coin = coin;
    this.name = name;
    this.id = id;
    this.spinCounter = spinCounter;
    this.lastSpin = lastSpin;
    this.historyPrizes = historyPrizes;
  }

  setSpinCount(count: number) {
    this.spinCounter = count;
  }

  setCoin(coin: number) {
    return (this.coin = coin);
  }

  setLastSpin() {
    this.lastSpin = Date.now();
  }

  static fromJson(d: any): User {
    const data = JSON.parse(d);
    // error("data : " + data.id);
    return new User(
      data["id"] || "",
      data["name"] || "",
      data["coin"] || 0,
      data["spinCounter"] || 0,
      data["lastSpin"] || 0,
      data["historyPrizes"] || []
    );
  }

  toJson(): string {
    return JSON.stringify(this);
  }
}
import { _decorator, error, SpriteFrame } from "cc";

const { ccclass, property } = _decorator;
@ccclass("Lang")
export class Lang {
  @property(String) en: string = "";
  @property(String) kh: string = "";

  constructor(en: string, kh: string) {
    this.en = en,
      this.kh = kh
  }

  static fromJson(data: any): Lang {
    return new Lang(data["en"] || "", data["kh"] || "")
  }

  toJson(): string {
    return JSON.stringify(this);
  }
}

@ccclass("Prize")
export class Prize {
  @property(String) spriteFrame: string = "";
  @property(String) id: String = "";
  @property(Number) amount: number = 0;
  @property(Lang) title: Lang = null;
  @property(Lang) subTitle: Lang = null;

  constructor(spriteFrame: string, id: string, amount: number, title: Lang, subTitle: Lang) {
    this.spriteFrame = spriteFrame;
    this.id = id;
    this.amount = amount;
    this.title = title;
    this.subTitle = subTitle;
  }

  static fromJson(data: any): Prize {
    return new Prize(
      undefined,
      data?.id ?? "",
      data?.amount ?? 0,
      data?.title ? Lang.fromJson(data.title) : null,
      data?.subTitle ? Lang.fromJson(data.subTitle
      ) : null,
    )
  }

  toJson(): string {
    return JSON.stringify(this);
  }
}
