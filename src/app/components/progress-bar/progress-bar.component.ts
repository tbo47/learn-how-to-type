import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core'
import { IExcercises, IProgress } from '../../utils'

@Component({
    selector: 'app-progress-bar',
    standalone: true,
    imports: [],
    templateUrl: './progress-bar.component.html',
    styleUrl: './progress-bar.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {
    @Input() excercises!: IExcercises
    @Input() progress!: IProgress
    @Output() levelChange = new EventEmitter<number>()
}
