import { Column, ManyToOne, Relation } from 'typeorm'
import { PropType } from '../../../shared/enums/prop-type.enum'
import { PropertyDefinition } from '../../../shared/interfaces/property-definition.interface'

import {
  PropTypeCharacteristics,
  propTypeCharacteristicsRecord
} from '../records/prop-type-characteristics.record'
import { RelationOptions } from '../../../shared/interfaces/property-options/relation-options.interface'

export const Prop = (definition?: PropertyDefinition): PropertyDecorator => {
  return (target: Object, propertyKey: string) => {
    const defaultType: PropType = PropType.Text
    const typeCharacteristics: PropTypeCharacteristics =
      propTypeCharacteristicsRecord[definition?.type || defaultType]

    const options: RelationOptions = definition?.options as RelationOptions

    if (definition?.type === PropType.Relation) {
      // Extend ManyToOne TypeORM decorator.
      ManyToOne(
        (_type) => options?.entity,
        (entity) => entity[propertyKey],
        {
          onDelete: 'CASCADE'
        }
      )(target, propertyKey)
    } else {
      // Extend the Column decorator from TypeORM.
      Column({
        ...definition?.typeORMOptions,
        type: typeCharacteristics.columnType,
        nullable: true // Everything is nullable for now (for simplicity).
      })(target, propertyKey)
    }

    // Set the property definition on the target.
    Reflect.defineMetadata(
      `${propertyKey}:seed`,
      definition?.seed || typeCharacteristics.defaultSeedFunction,
      target
    )
    Reflect.defineMetadata(
      `${propertyKey}:type`,
      definition?.type || defaultType,
      target
    )
    Reflect.defineMetadata(
      `${propertyKey}:label`,
      definition?.label || propertyKey,
      target
    )
    Reflect.defineMetadata(
      `${propertyKey}:options`,
      definition?.options || {},
      target
    )
  }
}