import { _decorator, Component, RigidBody2D, BoxCollider2D, IPhysics2DContact, Collider2D, Contact2DType, tween, easing } from 'cc';
import { SoundController } from './controller/SoundController';
const { ccclass, property } = _decorator;

@ccclass('WheelPoint')
export class WheelPoint extends Component {

  start() {
    // Get the collider component
    const collider = this.getComponent(BoxCollider2D);
    if (collider) {
      // Register callback for physics events
      collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
      // collider.on(Contact2DType.END_CONTACT, this.onEndContact, this);
      //collider.on(Contact2DType.POST_SOLVE, this.onBeginTrigger, this);
      //collider.on(Contact2DType.PRE_SOLVE, this.onEndTrigger, this);
    }
  }


  onBeginContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    // console.log('onBeginContact: Collided with', otherCollider.node.name);
    SoundController.instance.spin();
    // tween(this.node).to(0.1, {
    //   angle: -20,
    // }, { easing: easing.circIn }).start();
  }


  onBeginTrigger(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    console.log('onBeginTrigger: Entered trigger zone of', otherCollider.node.name);


    if (otherCollider.node.name === 'PowerUp') {
      otherCollider.node.destroy();
    }
  }

  onEndContact(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    console.log('onEndContact: Stopped colliding with', otherCollider.node.name);
  }

  onEndTrigger(selfCollider: Collider2D, otherCollider: Collider2D, contact: IPhysics2DContact | null) {
    console.log('onEndTrigger: Exited trigger zone of', otherCollider.node.name);
  }
}
