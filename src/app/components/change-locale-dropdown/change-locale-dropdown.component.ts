import { ChangeDetectionStrategy, Component, Input } from '@angular/core'

@Component({
    selector: 'app-change-locale-dropdown',
    standalone: true,
    imports: [],
    templateUrl: './change-locale-dropdown.component.html',
    styleUrl: './change-locale-dropdown.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangeLocaleDropdownComponent {
    @Input() locale = 'en'
}
