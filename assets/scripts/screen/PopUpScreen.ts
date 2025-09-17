import {
  _decorator,
  Component,
  easing,
  error,
  Label,
  Node,
  resources,
  Sprite,
  SpriteFrame,
  tween,
  Vec3,
} from "cc";
import { Prize, User } from "../models/Model";
import { LocalizationController } from "../controller/LocalizationController";
import { GameController } from "../controller/GameController";
import { SoundController } from "../controller/SoundController";

const { ccclass, property } = _decorator;

@ccclass("PopUpScreen")
export class PopUpScreen extends Component {
  @property({ type: Sprite }) winSprite: Sprite;
  @property({ type: Label }) titleLabel: Label;
  @property({ type: Label }) subtitleLabel: Label;
  @property({ type: Label }) exitButtonLabel: Label;
  @property({ type: Label }) againButtonLabel: Label;
  start() { }

  update(deltaTime: number) { }

  setUp() {
    this.exitButtonLabel.string = LocalizationController.instance.__("exit");
    this.againButtonLabel.string = LocalizationController.instance.__("again");
  }
  show(prize: Prize) {
    SoundController.instance.win();
    this.setUp();
    this.showAnimation();

    resources.load("prizes/" + prize.spriteFrame + "/spriteFrame", SpriteFrame, (error, data) => {
      if (error) {
        console.log("error : " + error.message);
        return;
      }
      this.winSprite.spriteFrame = data;

    });
    
    this.titleLabel.string =
      prize.title?.[LocalizationController.instance.lang];
    this.subtitleLabel.string =
      prize.subTitle?.[LocalizationController.instance.lang];
  }

  private showAnimation() {
    this.node.active = true;
    tween(this.node.children[0])
      .to(
        0.5,
        { scale: Vec3.ONE },
        {
          easing: easing.bounceIn,
        }
      )
      .start();
  }

  hide(callback?: () => void) {
    tween(this.node.children[0])
      .to(
        0.5,
        { scale: Vec3.ZERO },
        {
          easing: easing.bounceOut,
        }
      )
      .call(() => {
        this.node.active = false;
        if (callback) callback();
      })
      .start();
  }

  exitClick() {
    this.hide(() => GameController.instance.exit());
  }

  playAgainClick() {
    GameController.instance.playAgain();
  }
}
