
import { error, resources, SpriteFrame, _decorator, Component } from "cc";
const { ccclass } = _decorator;

@ccclass("Util")
export class Util extends Component {
    static loadingSpriteResource(path: string, callback?: (spriteFrame: SpriteFrame) => void) {
        resources.load(path, SpriteFrame, (e, spriteFrame) => {
            if (e) {
                // Safely access the message property only if 'e' is not null or undefined
                console.log("error : " + e.message);
                return;
            }
            if (callback) {
                callback(spriteFrame);
            }
        });
    }
}
