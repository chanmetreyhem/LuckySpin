import { _decorator, Button, Component, easing, find, instantiate, Label, Node, ParticleSystem2D, Prefab, randomRange, randomRangeInt, Sprite, SpriteFrame, tween, Vec3 } from "cc";
import { UIController } from "../controller/UIController";
import { SoundController } from "../controller/SoundController";
import { Prize } from "../models/Model";
import { LocalizationController } from "../controller/LocalizationController";
import { Util } from "../utils/Util";
import { UserPre } from "../utils/UserPre";
const { ccclass, property } = _decorator;

@ccclass("GameScreen")
export class GameScreen extends Component {
  @property({ type: Button }) backButton: Button = null;

  @property({ type: Node }) wheel: Node = null;
  @property({ type: Sprite }) resultPrizeSprite: Sprite = null;
  @property({ type: Prefab }) particlePre: Prefab = null;
  @property({ type: Node }) spinButton: Node = null;
  @property({ type: Label }) clickButtonInfo: Label = null;
  @property({ type: Label }) coinLabel: Label = null;

  backButtonClick() {
    //find("UIController").getComponent(UIController).showMenuScreen();
    if (navigator.userAgent == "flutter-web") {
      window["main"].flutter();
    } else {
      find("UIController").getComponent(UIController).showMenuScreen();
    }
  }

  getSpriteNameFromWheelPies(): string[] {
    let prizes = this.wheel.getComponentsInChildren(Sprite);
    const names = [];
    prizes.forEach((s, i) => {
      if (i != 0) {
        names.push(s.spriteFrame.name);

      }
    });
    return names;
  }


  spinWheel(duration: number, round: number, angle: number, onCompleted: () => Promise<void>) {


    this.clickButtonInfo.string = "";

    //spin button off
    tween(this.spinButton)
      .to(0.1, { scale: Vec3.ZERO }, { easing: easing.smooth })
      .start();

    this.wheel.angle = 0;

    tween(this.wheel)
      .to(
        duration * round,
        {
          angle: angle,
        },
        { easing: easing.quartOut } // quartInOut
      )
      .call(() => {
        if (onCompleted)
          onCompleted();
      })
      .start();
  }

  async resultSpritePopUp(prize: Prize): Promise<void> {
    SoundController.instance.win();
    tween(this.resultPrizeSprite.node)
      .to(
        0.5,
        { scale: new Vec3(3, 3, 3) },
        {
          easing: easing.sineIn,
        }
      ).call(() => {
        Util.loadingSpriteResource(`prizes/${prize.spriteFrame}/spriteFrame`, (data) => {
          this.resultPrizeSprite.spriteFrame = data;
        })
      })
      .start();


    this.clickButtonInfo.string =
      prize.subTitle?.[LocalizationController.instance.lang];


    this.cloneParticleEffect(prize.spriteFrame);
    await new Promise<void>((_) => {
      setTimeout(() => {
        // hide result prize node
        tween(this.resultPrizeSprite.node)
          .to(
            0.5,
            { scale: Vec3.ZERO },
            {
              easing: easing.sineIn,
            }
          )
          .start();
        // show spin button
        tween(this.spinButton)
          .to(0.1, { scale: Vec3.ONE }, { easing: easing.smooth })
          .start();

        // reset info label
        this.clickButtonInfo.string = LocalizationController.instance.__("clickTheButtonForSpin");

        _();
      }, 1000);
    })

  }

  cloneParticleEffect(name: string) {
    let particlePre = instantiate(this.particlePre);
    particlePre.setParent(find("Canvas"));


    Util.loadingSpriteResource("prizes/" + name + "/spriteFrame", (data) => {
      particlePre.getComponent(ParticleSystem2D).spriteFrame = data;
      this.resultPrizeSprite.spriteFrame = data;
    });

    this.scheduleOnce(() => {
      console.log("destroy");
      particlePre.destroy();
    }, 2);
  }


  setCoinLabel(text: string) {
    this.coinLabel.string = text;
  }


  hide() { }

  show() { }
}


