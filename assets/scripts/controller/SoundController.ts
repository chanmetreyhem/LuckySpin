import {
  _decorator,
  AudioClip,
  AudioSource,
  Component,
  error,
  Node,
  Sprite,
  SpriteFrame,
} from "cc";
import { UserPre } from "../utils/UserPre";
const { ccclass, property } = _decorator;

@ccclass("SoundController")
export class SoundController extends Component {
  // singleton
  private static _instance: SoundController;
  public static get instance(): SoundController {
    return this._instance;
  }

  //#region AudioSource
  @property({ type: AudioSource }) musicAudioSource: AudioSource;
  @property({ type: AudioSource }) sfxAudioSource: AudioSource;
  //#endregion
  //#region  AudioClip
  @property({ type: AudioClip }) spinClip: AudioClip;
  @property({ type: AudioClip }) clickClip: AudioClip;
  @property({ type: AudioClip }) winClip: AudioClip;
  //#endregion

  //#region  AudioSpriteFrame
  @property({ type: SpriteFrame }) muteSprite: SpriteFrame;
  @property({ type: SpriteFrame }) unMuteSprite: SpriteFrame;
  //#endregion
  @property({ type: Sprite }) soundButtonSprite: Sprite = null;

  private isMute: boolean = false;

  protected onLoad(): void {
    SoundController._instance = this;
  }

  protected start(): void {
    this.musicAudioSource.play();
    this.isMute = UserPre.get("ISMUTE", "0") == "1";
    this.setUp();
  }

  soundButtonClick() {
    this.isMute = !this.isMute;
    UserPre.set("ISMUTE", this.isMute ? "1" : "0");
    this.setUp();
  }

  setUp() {
    // setup

    this.soundButtonSprite.spriteFrame = this.isMute
      ? this.muteSprite
      : this.unMuteSprite;
    this.sfxAudioSource.volume = this.isMute ? 0 : 0.5;
    this.musicAudioSource.volume = this.isMute ? 0 : 0.4;
  }

  click() {
    this.sfxAudioSource.playOneShot(this.clickClip);
  }

  spin() {
    this.sfxAudioSource.playOneShot(this.spinClip);
  }

  win() {
    this.sfxAudioSource.playOneShot(this.winClip);
  }
}
