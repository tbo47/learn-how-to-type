import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core'
import { byId } from '../../app.component'
import { IExcercises, IProgress } from '../../utils'

@Component({
    selector: 'app-game',
    standalone: true,
    imports: [],
    templateUrl: './game.component.html',
    styleUrl: './game.component.scss',
})
export class GameComponent {
    @Input() excercises!: IExcercises
    @Input() progress!: IProgress
    @Output() levelCompleted = new EventEmitter()
    @ViewChild('userInput') userInput!: ElementRef
    @ViewChild('userModel') userModel!: ElementRef
    @ViewChild('hands') hands!: ElementRef
    #functionToDestroy!: (e: KeyboardEvent) => void
    #timer: any

    /**
     * the `progress` object can updated by the parent component (when the user changes the level with the progress bar)
     */
    ngOnChanges() {
        if (this.userModel) {
            this.#reactToUserTyping()
        }
    }

    ngAfterViewInit() {
        this.#reactToUserTyping()
        let startDate = new Date()
        const getTime = () => {
            if (this.progress.input.length === 0) startDate = new Date()
            return Math.round((new Date().getTime() - startDate.getTime()) / 1000)
        }
        this.#functionToDestroy = async ({ key }: KeyboardEvent) => {
            const time = getTime()
            if (key === 'Backspace') {
                this.progress.input = this.progress.input.slice(0, -1)
            } else if (key.length !== 1) {
                // if Alt, Control, Shift, F19, etc. are pressed, do nothing
                return
            } else {
                this.progress.input += key
                this.progress.time = time
                if (this.progress.input.length >= this.progress.model.length) {
                    this.levelCompleted.emit()
                }
            }
            this.#reactToUserTyping()
        }
        document.addEventListener('keydown', this.#functionToDestroy)
        this.#timer = setInterval(() => (this.progress.time = getTime()), 1_000)
    }

    /**
     * Change the page according to the progress object
     */
    #reactToUserTyping() {
        const level = this.excercises.content[this.progress.level]
        const model = level.content[this.progress.step]
        this.progress.model = model
        byId('user-model').innerHTML = model // make the change immediately in the DOM
        const { clientWidth, offsetLeft } = this.userModel!.nativeElement
        const userInput = this.userInput!.nativeElement
        userInput.parentElement!.style.width = clientWidth + 'px'
        userInput.parentElement!.style.marginLeft = offsetLeft + 'px'
        const finger = this.#findFinger(this.progress.model[this.progress.input.length])
        this.hands!.nativeElement.src = `assets/hands${finger}.png`
    }

    getCharClass(char: string, index: number) {
        const classes = [char === this.progress.model[index] ? 'correct' : 'incorrect']
        if (index === this.progress.input.length - 1) classes.push('blink')
        return classes.join(' ')
    }

    /**
     * find which finger should be used to type the letter
     */
    #findFinger(letter: string) {
        const f = this.excercises.finger_mapping.find(([finger, letters]) => (letters as string[]).includes(letter))
        // return f ? f[0] : [0, []]
        return f ? f[0] : 0
    }

    ngOnDestroy() {
        document.removeEventListener('keydown', this.#functionToDestroy)
        clearInterval(this.#timer)
    }
}
