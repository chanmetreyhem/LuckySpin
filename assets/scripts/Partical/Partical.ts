import { _decorator, Color, Component, Node, ParticleSystem2D } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Partical")
export class Partical extends Component {
  start() {
    var partical = this.getComponent(ParticleSystem2D);
    partical.startColor = Color.WHITE;
    partical.endColor = Color.WHITE;
   
  }

  update(deltaTime: number) {}
}
