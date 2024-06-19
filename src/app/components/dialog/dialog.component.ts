import { Component, EventEmitter, Inject, Input, LOCALE_ID, Output } from '@angular/core'
import { IExcercises, IProgress, getScore, getScoreComment, getVelocity, onKeyEnter, postStat } from '../../utils'

@Component({
    selector: 'app-dialog',
    standalone: true,
    imports: [],
    templateUrl: './dialog.component.html',
    styleUrl: './dialog.component.scss',
})
export class DialogComponent {
    @Input() excercises!: IExcercises
    @Input() progress!: IProgress
    @Output() userDecision = new EventEmitter()

    canGoToNextStep = true
    random = Math.floor(Math.random() * 4) // 0 to 3
    #functionToDestroy: any

    constructor(@Inject(LOCALE_ID) public locale: string) {}

    get scoreAndTime() {
        const { score, time } = getScore(this.progress)
        return $localize`${score}% correct in ${time} seconds`
    }

    get velocity() {
        const { input, time } = this.progress
        return $localize`${getVelocity({ input, time })} words per minute`
    }

    ngOnInit() {
        const { score, time } = getScore(this.progress)
        postStat({ score, time, ts: new Date().getTime(), locale: this.locale })

        this.#functionToDestroy = onKeyEnter(() => {
            if (this.canGoToNextStep) this.next()
            else this.startOver()
        })
    }

    get dialogComment() {
        const { score, time } = getScore(this.progress)
        const { comment, canGoToNextStep } = getScoreComment(score, time)
        this.canGoToNextStep = canGoToNextStep
        return comment
    }

    next() {
        const level = this.excercises.content[this.progress.level]
        if (this.progress.step === level.content.length - 1) {
            this.progress.level++
            this.progress.step = 0
        } else {
            this.progress.step++
        }
        this.userDecision.emit()
    }

    startOver() {
        this.userDecision.emit()
    }

    ngOnDestroy() {
        document.removeEventListener('keydown', this.#functionToDestroy)
    }
}
