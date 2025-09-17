import { _decorator, Animation, Component, Node, tween } from "cc";
import { GameScreen } from "../screen/GameScreen";
import { MenuScreen } from "../screen/MenuScreen";
import { PopUpScreen } from "../screen/PopUpScreen";
const { ccclass, property } = _decorator;

@ccclass("UIController")
export class UIController extends Component {

  @property({ type: Node }) loadingScreen: Node = null;
  @property({ type: GameScreen }) gameScreen: GameScreen = null;
  @property({ type: MenuScreen }) menuScreen: MenuScreen = null;
  @property({ type: PopUpScreen }) popUpScreen: PopUpScreen = null;

  start() { }

  update(deltaTime: number) { }

  hideMenuScreen() {
    this.menuScreen.hide();
  }

  showMenuScreen() {
    this.menuScreen.show();
  }


  showAndHideLoadingScreen(isShow: boolean) {

    if (isShow) this.loadingScreen.active = isShow;
    const animation = this.loadingScreen.getComponent(Animation);
    animation.play(isShow ? "show" : "hide");

    setTimeout(() => {
      animation.play(isShow ? "loop" : "idle");
    }, 300)

    if (!isShow) this.loadingScreen.active = isShow;



  }
}
