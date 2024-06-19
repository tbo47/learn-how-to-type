import { CommonModule } from '@angular/common'
import { Component, Inject, LOCALE_ID } from '@angular/core'
import { RouterOutlet } from '@angular/router'
import { ChangeLocaleDropdownComponent } from './components/change-locale-dropdown/change-locale-dropdown.component'
import { DialogComponent } from './components/dialog/dialog.component'
import { GameComponent } from './components/game/game.component'
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component'
import { AppLocale, IExcercises, IProgress, LOCAL_STORAGE_KEY, downloadExcercises } from './utils'

export const byId = (id: string) => document.getElementById(id)!

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [
        ChangeLocaleDropdownComponent,
        ProgressBarComponent,
        CommonModule,
        RouterOutlet,
        DialogComponent,
        GameComponent,
    ],
})
export class AppComponent {
    excercises: IExcercises | undefined
    progress: IProgress = { level: 0, step: 0, input: '', model: '', time: 0 }
    simpleLocale: AppLocale = 'en'
    showGame = true

    constructor(@Inject(LOCALE_ID) private locale: string) {
        if (this.locale.startsWith('fr')) this.simpleLocale = 'fr'
    }

    async ngOnInit() {
        const cache = localStorage.getItem(LOCAL_STORAGE_KEY + this.simpleLocale)
        if (cache) this.progress = JSON.parse(cache)
        this.progress.input = ''

        this.excercises = await downloadExcercises(this.simpleLocale)

        window.addEventListener('contextmenu', (e) => e.preventDefault())
        document.addEventListener('click', () => byId('hidden-input')!.focus())
    }

    onUserDecision() {
        this.showGame = true
        this.progress.input = ''
        this.progress = { ...this.progress } // to trigger change detection on OnPush components
        localStorage.setItem(LOCAL_STORAGE_KEY + this.simpleLocale, JSON.stringify(this.progress))
    }

    onLevelCompleted() {
        this.showGame = false
        this.progress = { ...this.progress } // to trigger change detection on OnPush components
        localStorage.setItem(LOCAL_STORAGE_KEY + this.simpleLocale, JSON.stringify(this.progress))
    }

    doLevelChange(newLevel: number) {
        this.showGame = true
        this.progress.level = newLevel
        this.progress = { ...this.progress } // to trigger change detection on OnPush components
    }
}
