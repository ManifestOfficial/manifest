import { NgClass } from '@angular/common'
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core'
import { PropertyDescription } from '~shared/interfaces/property-description.interface'

@Component({
  selector: 'app-password-input',
  standalone: true,
  imports: [NgClass],
  template: `<label [for]="prop.propName">{{ prop.label }}</label>
    <input
      class="input form-control"
      [ngClass]="{ 'is-danger': isError }"
      type="password"
      autocomplete="current-password"
      (change)="onChange($event)"
      #input
    />`,
  styleUrls: ['./password-input.component.scss']
})
export class PasswordInputComponent implements OnInit {
  @Input() prop: PropertyDescription
  @Input() value: string
  @Input() isError: boolean

  @Output() valueChanged: EventEmitter<number> = new EventEmitter()

  @ViewChild('input', { static: true }) input: ElementRef

  ngOnInit(): void {
    if (this.value !== undefined) {
      this.input.nativeElement.value = this.value
    }
  }

  onChange(event: any) {
    this.valueChanged.emit(event.target.value)
  }
}
