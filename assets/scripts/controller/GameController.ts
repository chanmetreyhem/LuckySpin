import {
  _decorator,
  Button,
  Component,
  director,
  easing,
  error,
  find,
  game,
  instantiate,
  Label,
  log,
  Node,
  ParticleSystem2D,
  Prefab,
  ProgressBar,
  randomRange,
  randomRangeInt,
  resources,
  Sprite,
  SpriteFrame,
  sys,
  tween,
  Vec3,
} from "cc";
import { UIController } from "./UIController";
import { Prize, User, Lang } from "../models/Model";
import { LocalizationController } from "./LocalizationController";
import { UserPre } from "../utils/UserPre";
import { SoundController } from "./SoundController";

const { ccclass, property } = _decorator;

enum Mode {
  dev,
  release,
}

enum GamMode {
  PLAY_WITH_COIN,
  PLAY_WITH_GIFT,
  PLAY_WITH_HEART,
  PLAY_WITH_DAILY,
  NONE,
}

@ccclass("GameController")
export class GameController extends Component {
  //singleton
  private static _instance: GameController;

  public static get instance(): GameController {
    return GameController._instance;
  }

  @property({ type: [Prize] }) prizes: Prize[] = [];

  @property({ type: UIController }) uiController: UIController = null;

  @property({ type: Node }) wheel: Node = null;
  @property({ type: Sprite }) resultPrizeSprite: Sprite = null;
  @property({ type: Node }) spinWheelNode;
  @property({ type: [SpriteFrame] }) prizeSpriteFrams: SpriteFrame[] = [];
  @property({ type: Prefab }) particlePre: Prefab = null;
  @property({ type: Node }) spinButton: Node = null;
  @property({ type: Node }) resultSpriteNode: Node = null;

  @property({ type: Label }) clickButtonInfo: Label = null;
  @property({ type: Label }) coinLabel: Label = null;

  public userData: User;

  private mode: Mode = Mode.dev;
  private gameMode: GamMode = GamMode.PLAY_WITH_COIN;
  public localCoin: number = 0;
  private minCoin: number = 0;
  private maxCoin: number = 10000;
  private localSpinCount: number = 0;
  private isCanSpin: boolean = true;

  private checkSpin(): boolean {
    if (this.gameMode == GamMode.PLAY_WITH_COIN) {
      return this.localSpinCount < 2;
    } else {
      return true;
    }
  }

  @property({ type: Label }) messageLabel: Label;

  @property({ type: ProgressBar }) progressBar: ProgressBar = null;

  updateProgressBar() {
    this.progressBar.progress = this.localCoin / this.maxCoin;
  }

  protected onLoad(): void {
    const jsonString = `
    {"id":"1234","name":"gumiho","coin":90,"spinCounter":1,"lastSpin":23311333,"historyPrizes":[{"spriteFrame":null,"id":"234","amount":12,"title":{"en":"end","kh":"jdfjdf"},"subTitle":{"en":"dfjdf","kh":"dfhf"}},{"spriteFrame":null,"id":"234","amount":12,"title":{"en":"end","kh":"jdfjdf"},"subTitle":{"en":"dfjdf","kh":"dfhf"}}]}
    `;
    // const testPrizes = [
    //   new Prize(null, "234", 12, new Lang("end", "jdfjdf"), new Lang("dfjdf", "dfhf")),
    //   new Prize(null, "234", 12, new Lang("end", "jdfjdf"), new Lang("dfjdf", "dfhf"))
    // ]
    // const testUser = new User("1234", "gumiho", 90, 1, 23311333, testPrizes);
    const testUser = User.fromJson(jsonString);
    console.log("testUser : " + testUser.historyPrizes[0].subTitle);

    this.loadUserData();

    GameController._instance = this;
  }

  updateMessage() {
    this.messageLabel.string = JSON.stringify(window["main"].data);
  }

  protected start() {
    let prizes = this.wheel.getComponentsInChildren(Sprite);
    prizes.forEach((s, i) => {
      if (i != 0) {
        if (i < 13) this.prizes[i - 1].spriteFrame = s.spriteFrame.name;
      }
    });
  }

  public fromFlutter(data: string) {
    console.log(data);
    //log("recieved from flutter");
    this.messageLabel.string = data;
  }

  private loadUserData() {
    let user = UserPre.getUserData();
    if (user != null) {
      this.userData = user;
    } else {
      this.userData = new User("123", "chanmetrey", 400, 0, null, []);
      UserPre.saveUserData(this.userData);
    }

    this.uiController.menuScreen.setUp(this.userData);
    this.localCoin = this.userData.coin;
    this.localSpinCount = this.uiController.menuScreen.spinCounter;

    this.updateProgressBar();
    this.coinLabel.string = this.userData.coin.toString();

    error(this.userData.toJson());
  }

  callBack(data: any) {
    console.log(
      "user data : " + data.name + "-" + data.age + "-" + data.status
    );
  }

  update(deltaTime: number) { }

  spin() {
    // get spin counter

    log("spin-counter : " + this.localSpinCount);

    //reset spin wheel angel
    this.spinWheelNode.angle = 0;

    this.localSpinCount += 1;

    this.clickButtonInfo.string = "";

    // disable back button
    this.uiController.gameScreen.backButton.interactable = false;

    //spin button off
    tween(this.spinButton)
      .to(0.1, { scale: Vec3.ZERO }, { easing: easing.smooth })
      .start();

    let round = randomRangeInt(4, 6);
    const randomIndex = randomRangeInt(0, this.prizes.length);
    let duration = randomRange(1, 4);
    let angle = 360 * round + (360 / 16) * randomIndex + 360 / 32;

    // log(
    //   "round:" +
    //     round +
    //     "/ duration:" +
    //     duration +
    //     "/result:" +
    //     randomIndex +
    //     "/repeat:" +
    //     Math.floor(angle / (360 / 16)) +
    //     "/angle:" +
    //     angle
    // );

    // this.schedule(
    //   () => {
    //     SoundController.instance.spin();

    //   },
    //   (duration * 22.5) / 360,
    //   Math.floor(angle / (360 / 16)) - 5,
    //   0
    // );

    tween(this.spinWheelNode)
      .to(
        duration * round,
        {
          angle: angle,
        },
        { easing: easing.quartOut } // quartInOut
      )
      .call(() => {
        this.resultShow(randomIndex);
      })
      .start();
  }

  private resultShow(index: number) {
    SoundController.instance.win();
    tween(this.resultSpriteNode)
      .to(
        0.5,
        { scale: new Vec3(3, 3, 3) },
        {
          easing: easing.sineIn,
        }
      )
      .start();

    const winPrize = this.prizes[index];
    this.clickButtonInfo.string =
      this.prizes[index].subTitle?.[LocalizationController.instance.lang];

    this.localCoin = this.localCoin + winPrize.amount;
    this.coinLabel.string = this.localCoin.toString();
    this.updateProgressBar();

    this.userData.setCoin(this.localCoin);
    this.userData.setLastSpin();
    //this.userData.historyPrizes.push(winPrize);

    // reveal setup on menu screen
    this.uiController.menuScreen.setUp(this.userData);

    // save user data
    UserPre.saveUserData(this.userData);

    let resultSpriteFrame = winPrize.spriteFrame;

    this.cloneParticleEffect(resultSpriteFrame);

    setTimeout(() => {
      tween(this.resultSpriteNode)
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

      // enable back button
      // this.uiController.gameScreen.backButton.interactable = true;

      this.uiController.popUpScreen.show(winPrize);
    }, 4000);
  }

  exit() {
    this.uiController.menuScreen.show();
  }

  playAgain() {
    if (this.localCoin > 10 && this.localSpinCount < 2) {
      LocalizationController.instance.setupIdleLabelString();
      this.localCoin -= 15;
      this.userData.setCoin(this.localCoin);
      this.userData.setLastSpin();
      this.userData.setSpinCount(this.localSpinCount);

      this.coinLabel.string = this.localCoin.toString();

      UserPre.saveUserData(this.userData);

      this.uiController.gameScreen.backButton.interactable = true;
      this.uiController.popUpScreen.hide();
    }
  }

  cloneParticleEffect(name: string) {
    let particlePre = instantiate(this.particlePre);
    particlePre.setParent(find("Canvas"));

    resources.load("prizes/" + name, SpriteFrame, (error, data) => {
      if (error) {
        console.log("error : " + error);
        return;
      }

      particlePre.getComponent(ParticleSystem2D).spriteFrame = data;
      this.resultPrizeSprite.spriteFrame = data;
    });

    this.scheduleOnce(() => {
      console.log("destroy");
    }, 2);
  }
}
