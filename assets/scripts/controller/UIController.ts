import { _decorator, Component, Node } from "cc";
import { GameScreen } from "../screen/GameScreen";
import { MenuScreen } from "../screen/MenuScreen";
import { PopUpScreen } from "../screen/PopUpScreen";
const { ccclass, property } = _decorator;

@ccclass("UIController")
export class UIController extends Component {
  @property({ type: GameScreen }) gameScreen: GameScreen = null;
  @property({ type: MenuScreen }) menuScreen: MenuScreen = null;
  @property({ type: PopUpScreen }) popUpScreen: PopUpScreen = null;
  start() {}

  update(deltaTime: number) {}

  hideMenuScreen() {
    this.menuScreen.hide();
  }

  showMenuScreen() {
    this.menuScreen.show();
  }
}
