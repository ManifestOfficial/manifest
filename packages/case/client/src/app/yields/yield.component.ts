import { CommonModule } from '@angular/common'
import { Component, Input } from '@angular/core'
import { PropType } from '~shared/enums/prop-type.enum'
import { YieldType } from '~shared/enums/yield-type.enum'

import { PropertyOptions } from '~shared/interfaces/property-options/property-options.interface'
import { BooleanYieldComponent } from './boolean-yield/boolean-yield.component'
import { CurrencyYieldComponent } from './currency-yield/currency-yield.component'
import { DateYieldComponent } from './date-yield/date-yield.component'
import { EmailYieldComponent } from './email-yield/email-yield.component'
import { FileYieldComponent } from './file-yield/file-yield.component'
import { ImageYieldComponent } from './image-yield/image-yield.component'
import { LabelYieldComponent } from './label-yield/label-yield.component'
import { LinkYieldComponent } from './link-yield/link-yield.component'
import { NumberYieldComponent } from './number-yield/number-yield.component'
import { ProgressBarYieldComponent } from './progress-bar-yield/progress-bar-yield.component'
import { RelationYieldComponent } from './relation-yield/relation-yield.component'
import { TextYieldComponent } from './text-yield/text-yield.component'

@Component({
  selector: 'app-yield',
  standalone: true,
  imports: [
    CommonModule,
    BooleanYieldComponent,
    CurrencyYieldComponent,
    DateYieldComponent,
    EmailYieldComponent,
    NumberYieldComponent,
    LinkYieldComponent,
    RelationYieldComponent,
    TextYieldComponent,
    FileYieldComponent,
    ImageYieldComponent,
    LabelYieldComponent,
    ProgressBarYieldComponent
  ],
  template: `
    <app-text-yield
      *ngIf="type === PropType.Text || type === PropType.Textarea"
      [value]="value"
      [compact]="compact"
    ></app-text-yield>
    <app-number-yield
      *ngIf="type === PropType.Number"
      [value]="value"
    ></app-number-yield>
    <app-link-yield
      *ngIf="type === PropType.Link"
      [value]="value"
      [compact]="compact"
    ></app-link-yield>
    <app-relation-yield
      *ngIf="type === PropType.Relation"
      [item]="value"
      [options]="options"
    ></app-relation-yield>
    <app-boolean-yield
      *ngIf="type === PropType.Boolean"
      [value]="value"
    ></app-boolean-yield>
    <app-currency-yield
      *ngIf="type === PropType.Currency"
      [value]="value"
      [options]="options"
    ></app-currency-yield>
    <app-date-yield
      *ngIf="type === PropType.Date"
      [value]="value"
    ></app-date-yield>
    <app-email-yield
      *ngIf="type === PropType.Email"
      [value]="value"
    ></app-email-yield>
    <app-file-yield
      *ngIf="type === PropType.File"
      [value]="value"
      [compact]="compact"
    ></app-file-yield>
    <app-image-yield
      *ngIf="type === PropType.Image"
      [value]="value"
      [compact]="compact"
    ></app-image-yield>
    <app-label-yield
      *ngIf="
        type === PropType.Enum &&
        (!options.display || options.display === 'label')
      "
      [value]="value"
      [options]="options"
    ></app-label-yield>
    <app-progress-bar-yield
      *ngIf="type === PropType.Enum && options.display === 'progress-bar'"
      [value]="value"
      [options]="options"
    ></app-progress-bar-yield>
  `
})
export class YieldComponent {
  @Input() value: any
  @Input() type: PropType
  @Input() options?: PropertyOptions | any
  @Input() compact: boolean = false

  PropType = PropType
  YieldType = YieldType
}
