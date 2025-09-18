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
  Enum,
} from "cc";

import { UIController } from "./UIController";
import { Prize, User } from "../models/Model";
import { LocalizationController } from "./LocalizationController";
import { UserPre } from "../utils/UserPre";
import { SoundController } from "./SoundController";
import { DailySpinController } from "./DailySpinController";

const { ccclass, property } = _decorator;

export enum Mode {
  dev,
  release,
}

export enum GamMode {
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

  @property({ type: UIController }) uiController: UIController = null;

  @property({ type: [Prize] }) prizes: Prize[] = [];



  @property({ type: ProgressBar }) progressBar: ProgressBar = null;
  @property({ type: Node }) dailyControllerNode: Node = null;
  private dailySpinController: DailySpinController = null;
  public userData: User;

  @property({ type: Enum(Mode) }) mode: Mode = Mode.release;
  @property({ type: Enum(GamMode) }) gameMode: GamMode = GamMode.PLAY_WITH_COIN;
  
  public localCoin: number = 0;
  private minCoin: number = 0;
  private maxCoin: number = 10000;
  private localSpinCount: number = 0;
  private isCanSpin: boolean = true;

  updateProgressBar() {
    this.progressBar.progress = this.localCoin / this.maxCoin;
  }

  protected onLoad(): void {
    GameController._instance = this;
    this.dailySpinController =
      this.dailyControllerNode.getComponent(DailySpinController);
    const jsonString = `
    {"id":"1234","name":"gumiho","coin":90,"spinCounter":1,"lastSpin":23311333,"historyPrizes":[{"spriteFrame":null,"id":"234","amount":12,"title":{"en":"end","kh":"jdfjdf"},"subTitle":{"en":"dfjdf","kh":"dfhf"}},{"spriteFrame":null,"id":"234","amount":12,"title":{"en":"end","kh":"jdfjdf"},"subTitle":{"en":"dfjdf","kh":"dfhf"}}]}
    `;
    // const testPrizes = [
    //   new Prize(null, "234", 12, new Lang("end", "jdfjdf"), new Lang("dfjdf", "dfhf")),
    //   new Prize(null, "234", 12, new Lang("end", "jdfjdf"), new Lang("dfjdf", "dfhf"))
    // ]
    // const testUser = new User("1234", "gumiho", 90, 1, 23311333, testPrizes);
    const testUser = User.fromJson(jsonString);
    console.log("testUser : " + testUser.historyPrizes[0].subTitle.en);

    this.loadUserData();
  }

  protected start() {

    // prizes.forEach((s, i) => {
    //   if (i != 0) {
    //     this.prizes[i - 1].spriteFrame = s.spriteFrame.name;
    //   }
    // });


  }

  private loadUserData() {
    this.uiController.showAndHideLoadingScreen(true);
    let user = UserPre.getUserData();
    if (user != null) {
      this.userData = user;
    } else {
      this.userData = new User("123", "GUMIHO", 400, 0, null, []);
      UserPre.saveUserData(this.userData);
    }

    log("user data : " + this.userData.toJson());

    this.dailySpinController.setUp(this.userData);

    this.uiController.menuScreen.setUp(this.userData);
    this.localCoin = this.userData.coin;

    this.updateProgressBar();
    this.uiController.gameScreen.setCoinLabel(this.userData.coin.toString());
    setTimeout(() => this.uiController.showAndHideLoadingScreen(false), 1000);

    //error(this.userData.toJson());
  }

  callBack(data: any) {
    console.log(
      "user data : " + data.name + "-" + data.age + "-" + data.status
    );
  }

  update(deltaTime: number) { }

  spin() {
    // get spin counter
    this.localSpinCount = this.userData.spinCounter;
    log("spin-counter : " + this.localSpinCount);


    this.localSpinCount += 1;

    // disable back button
    this.uiController.gameScreen.backButton.interactable = false;

    const randomIndex = randomRangeInt(0, this.prizes.length);
    const winPrize = this.prizes[randomIndex];
    let round = randomRangeInt(4, 6);

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

    this.uiController.gameScreen.spinWheel(
      duration,
      round,
      angle,
      () => this.resultShow(winPrize)
    );
  }

  private async resultShow(prize: Prize): Promise<void> {
    // update user data
    this.localCoin = this.localCoin + prize.amount;

    this.updateUserData(prize);

    // show result sprite popup

    await this.uiController.gameScreen.resultSpritePopUp(prize);

    this.uiController.popUpScreen.show(prize);
  }

  updateUserData(prize?: Prize) {
    // update label coin at game screen;
    this.uiController.gameScreen.setCoinLabel(this.localCoin.toString());
    this.updateProgressBar();
    this.userData.setCoin(this.localCoin);
    this.userData.setSpinCount(this.localSpinCount);
    this.userData.setLastSpin();
    // if (prize) this.userData.historyPrizes.push(prize);

    // save user data
    UserPre.saveUserData(this.userData);
  }

  exit() {
    this.uiController.menuScreen.show();
    this.updateMenuScreen();
  }

  playAgain() {
    log("local counter : " + this.localSpinCount);
    if (this.localCoin > 10 && this.localSpinCount < 2) {
      LocalizationController.instance.setupIdleLabelString();

      this.localCoin -= 15;
      this.updateUserData();

      this.uiController.gameScreen.backButton.interactable = true;
      this.uiController.popUpScreen.hide();
    }
  }

  updateMenuScreen() {
    this.uiController.menuScreen.setUp(this.userData);
    this.dailySpinController.setUp(this.userData);
  }
}
