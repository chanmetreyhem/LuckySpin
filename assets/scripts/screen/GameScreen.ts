import { _decorator, Button, Component, find, Node } from "cc";
import { UIController } from "../controller/UIController";
const { ccclass, property } = _decorator;

@ccclass("GameScreen")
export class GameScreen extends Component {
  @property({ type: Button }) backButton: Button = null;
  backButtonClick() {
    //find("UIController").getComponent(UIController).showMenuScreen();
    if (navigator.userAgent == "flutter-web") {
      window["main"].flutter();
    } else {
      find("UIController").getComponent(UIController).showMenuScreen();
    }
  }

  hide() {}

  show() {}
}


