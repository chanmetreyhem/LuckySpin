import {
  _decorator,
  Component,
  Font,
  game,
  JsonAsset,
  Label,
  log,
  Node,
  resources,
} from "cc";
import { MenuScreen } from "../screen/MenuScreen";
const { ccclass, property } = _decorator;

@ccclass("LocalizationController")
export class LocalizationController extends Component {
  //singleton
  public static _instance: LocalizationController;
  public static get instance(): LocalizationController {
    return LocalizationController._instance;
  }
  @property({ type: Node }) private cavas: Node = null;

  @property({ type: Font }) private khFont: Font = null;
  @property({ type: Font }) private enFont: Font = null;

  @property({ type: Label }) spinButtonLabel: Label = null;
  @property({ type: Label }) backButtonLabel: Label = null;
  @property({ type: Label }) clickButbeltonDescriptionLabel: Label = null;

  @property({ type: MenuScreen }) menuScreen: MenuScreen = null;
  public localization = null;
  public lang: string = "en";
  protected onLoad(): void {
    LocalizationController._instance = this;
    this.loadLangJsonAsset();
  }

  start() {
    this.setupLabelFont();
  }

  update(deltaTime: number) {}

  getTranslation(): string {
    let param = new URLSearchParams(window.location.search);
    return param.get("lang") == "en" && "kh" ? "en" : param.get("lang");
  }

  async loadLangJsonAsset() {
    await resources.load("lang", JsonAsset, (error, json) => {
      if (error) {
        console.log("fail to load localizaiton asset : " + error);
        return;
      }
      this.localization = json.json;

      this.lang = this.getTranslation() || "en";
      this.setupIdleLabelString();
    });
  }

  __(key: string): string {
    return this.localization?.[key]?.[this.lang];
  }
  public get(key: string): string {
    const lang = this.getTranslation() || "en";
    return this.localization?.[key]?.[lang] || "undefine";
  }

  setupLabelFont() {
    this.cavas.getComponentsInChildren(Label).forEach((l) => {
      const font = this.getMatchLangFont();
      if (!font) {
        console.error("fail to set fonts");
        return;
      }
      l.useSystemFont = false;
      l.font = font;
    });
  }

  getMatchLangFont(): Font {
    return this.getTranslation() == "kh" ? this.khFont : this.enFont;
  }

  setupIdleLabelString() {
    this.spinButtonLabel.string = this.__("spin");
    this.backButtonLabel.string = this.__("back");
    this.clickButbeltonDescriptionLabel.string = this.__(
      "clickTheButtonForSpin"
    );

    this.menuScreen.setUpLocalization(this);
  }
}
