import { LoadingController, ModalController } from '@ionic/angular';
import { Injectable } from '@angular/core';
import { SuccessPage } from '../pages/success/success';
enum State {
    HIDED,
    LOADING,
    SUCCESS
}

@Injectable({
    providedIn: 'root',
})
export class LoadingService {

    private readonly TIMER_MS = 3000;

    loading: any;
    private loadingModal: any;
    private currentModalState: State;
    private loadingTimer: Promise<void>;

    constructor(
        private loadingCtrl: LoadingController,
        private modalCtrl: ModalController,
    ) {
        this.currentModalState = State.HIDED;
    }

    async openLoading() {
        this.loading = await this.loadingCtrl.create({
          message: 'Please wait...'
        });
        await this.loading.present();

        const { role, data } = await this.loading.onDidDismiss();

        console.log('Loading dismissed!');
    }

    public hide() {
        if (this.loadingModal) {
            this.loadingModal.dismiss();
        }
    }

    public async showModal() {
        const titleSuccess = 'Estamos <strong>actualizando tu AlastriaID</strong>';
        const textSuccess = 'Solo será un momento';
        const imgPrincipal = 'assets/images/alastria/loading.png';
        const imgSuccess = '';
        const page = 'loading';
        const modal = await this.presentModal({ titleSuccess, textSuccess, imgPrincipal, imgSuccess, page });

        this.currentModalState = State.LOADING;
        this.loadingTimer = new Promise((resolve) => {
              setTimeout(() => {
                  resolve();
              }, this.TIMER_MS);
          });

        return await modal.present();
    }

    public updateModalState(isDeeplink?: boolean) {
        this.loadingTimer.then(() => {
            if (this.currentModalState !== State.SUCCESS) {
                this.showSuccess(isDeeplink);
            } else {
                this.loadingModal.dismiss();
            }
            this.loadingTimer = null;
        });
    }

    private async showSuccess(isDeeplink: boolean) {
        const titleSuccess = '¡Hecho!';
        const textSuccess = 'Recuerda que puedes ver todos tus movimientos de AlastriaID en la opción de <strong>"Actividad"</strong>';
        const imgPrincipal = 'assets/images/alastria/success.png';
        const imgSuccess = 'assets/images/tabIcon/act.png';
        const page = 'success';

        const successModal = await this.presentModal({ titleSuccess, textSuccess, imgPrincipal, imgSuccess, page, isDeeplink });

        this.currentModalState = State.SUCCESS;

        return await successModal.present();
    }

    async presentModal(componentProps: any): Promise<any> {
        const modal = await this.modalCtrl.create({
          component: SuccessPage,
          componentProps
        });
        return modal;
    }
}
