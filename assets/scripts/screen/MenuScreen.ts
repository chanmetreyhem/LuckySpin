import {
  _decorator,
  Component,
  director,
  easing,
  find,
  Label,
  log,
  Node,
  tween,
  Vec3,
  Button,
  Game,
} from "cc";
import { LocalizationController } from "../controller/LocalizationController";
import { GameController } from "../controller/GameController";
import { UserPre } from "../utils/UserPre";
import { User } from "../models/Model";
import { SoundController } from "../controller/SoundController";
const { ccclass, property } = _decorator;

@ccclass("MenuScreen")
export class MenuScreen extends Component {
  @property({ type: Button }) playNowButton: Button = null;

  // label type
  @property({ type: Node }) badgeNode: Node = null;
  @property({ type: Label }) tryYourLuckLabel: Label = null;
  @property({ type: Label }) playNowButtonLabel: Label = null;
  @property({ type: Label }) coinLabel: Label = null;
  @property({ type: Node }) wheelNode: Node = null;
  @property({ type: Label }) timeCountLabel: Label = null;

  // dailyspin
  private isSpin: boolean = false;
  private revealSpinCounter = 2 * 60 * 1000;
  public spinCounter: number = 0;
  private lastSpin: number = null;

  protected start(): void {
    //loop animation at wheel on play now button
    tween(this.wheelNode)
      .by(1, { angle: 360 }, { easing: easing.sineInOut })
      .repeatForever()
      .start();
  }

  setUp(user: User) {
    this.coinLabel.string = user.coin.toString();
    this.lastSpin = user.lastSpin;
    this.spinCounter = user.spinCounter;
    this.canYouSpin();
    this.updateCountdown();
    this.schedule(this.updateCountdown, 1);
  }

  playNowClick() {
    this.hide();
  }

  hide() {
    tween(this.node)
      .to(
        0.2,
        {
          scale: new Vec3(0, 1, 1),
        },
        { easing: easing.sineOut }
      )
      .start();
  }

  show() {
    tween(this.node)
      .to(
        0.2,
        {
          scale: new Vec3(1, 1, 1),
        },
        { easing: easing.sineOut }
      )
      .start();
  }

  setUpLocalization(l: LocalizationController) {
    this.tryYourLuckLabel.string = l.__("try-your-luck");
    this.playNowButtonLabel.string = l.__("play-now");
  }

  clearCache() {
    localStorage.clear();
    director.loadScene("game");
  }

  leaveGame() {
    window["main"].flutter();
   setTimeout(() => {
     GameController.instance.updateMessage();
   },1000)
  }

  canYouSpin() {
    if (
      !this.lastSpin ||
      Date.now() - this.lastSpin >= this.revealSpinCounter
    ) {
      this.isSpin = true;
      this.timeCountLabel.string = "";
      this.spinCounter = 0;
    } else {
      this.isSpin = false;
    }

    this.playNowButton.interactable = this.isSpin;
    this.badgeNode.active = this.isSpin;
    this.updateCountdown();
  }

  updateCountdown() {
    if (!this.lastSpin) return;
    const timeLeft = this.revealSpinCounter - (Date.now() - this.lastSpin);
    if (timeLeft <= 0) {
      this.playNowButton.interactable = true;
      this.timeCountLabel.string = "";
      this.spinCounter = 0;
      this.badgeNode.active = true;
    } else {
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      this.timeCountLabel.string = `${hours}h ${minutes}m ${seconds}s`;
    }
  }
}
