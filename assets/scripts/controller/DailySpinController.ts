import { _decorator, Component, log, Node } from 'cc';
import { User } from '../models/Model';
import { MenuScreen } from '../screen/MenuScreen';
import { UserPre } from '../utils/UserPre';
const { ccclass, property } = _decorator;

@ccclass('DailySpinController')
export class DailySpinController extends Component {

    private isSpinAvailable: boolean = false;
    private timeReveal: number = 2 * 60 * 1000; //24h
    private lastSpin: number = null;
    private timeLeft: number = 0;

    @property({ type: MenuScreen }) menuScreen: MenuScreen = null;
    protected start(): void {

    }
    private user: User;
    protected update(dt: number): void {

        if (!this.lastSpin) {
            return;
        }


        if (this.isSpinAvailable) {
            return;
        }


        this.timeLeft -= dt * 1000;

        // Check if the timer has expired
        if (this.timeLeft <= 0) {
            this.isSpinAvailable = true;
            this.menuScreen.inOrActiveSpinRevealScheduleUI(true);
            this.timeLeft = 0;
            this.menuScreen.setTimeLabelText('0h 0m 0s');

            //reveal spin counter 
            if (this.user) {
                this.user.setSpinCount(0);
                UserPre.saveUserData(this.user);
            }


            return;
        }


        const totalSeconds = Math.floor(this.timeLeft / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;


        this.menuScreen.setTimeLabelText(`${hours}h ${minutes}m ${seconds}s`);
    }


    setUp(user: User) {
        this.user = user;
        this.lastSpin = user.lastSpin;
        if (!this.lastSpin || this.timeReveal <= Date.now() - this.lastSpin) {
            this.isSpinAvailable = true;
            user.setSpinCount(0);
            UserPre.saveUserData(user);
        } else {
            this.isSpinAvailable = false;
        }

        this.menuScreen.inOrActiveSpinRevealScheduleUI(this.isSpinAvailable);
        this.timeLeft = this.timeReveal - (Date.now() - this.lastSpin);
    }


}


