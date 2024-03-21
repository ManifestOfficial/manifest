import { Injectable } from '@nestjs/common'
import {
  EntitySchema,
  EntitySchemaColumnOptions,
  EntitySchemaRelationOptions
} from 'typeorm'
import { ManifestService } from '../../../manifest/services/manifest/manifest.service'
import { EntityManifest } from '../../../manifest/typescript/other/entity-manifest.interface'
import { PropertyManifest } from '../../../manifest/typescript/other/property-manifest.type'
import { RelationshipManifest } from '../../../manifest/typescript/other/relationship-manifest.type'
import { baseEntity } from '../../core-entities/base-entity'
import { propTypeColumnTypes } from '../../records/prop-type-column-types'

@Injectable()
export class EntityLoaderService {
  constructor(private manifestService: ManifestService) {}

  /**
   * Load entities from YML file and convert into TypeORM entities.
   *
   * @returns EntitySchema[] the entities
   *
   **/
  loadEntities(): EntitySchema[] {
    const entityManifests: EntityManifest[] =
      this.manifestService.getEntityManifests()

    const entitySchemas: EntitySchema[] = entityManifests.map(
      (entityManifest: EntityManifest) => {
        const entitySchema: EntitySchema = new EntitySchema({
          name: entityManifest.className,

          // Convert properties to columns.
          columns: entityManifest.properties.reduce(
            (
              acc: { [key: string]: EntitySchemaColumnOptions },
              propManifest: PropertyManifest
            ) => {
              acc[propManifest.name] = {
                name: propManifest.name,
                type: propTypeColumnTypes[propManifest.type]
              }

              return acc
            },
            // Merge with baseEntity for base columns like id, createdAt, updatedAt.
            { ...baseEntity }
          ) as { [key: string]: EntitySchemaColumnOptions },

          // Convert belongsTo relationships to many-to-one relations.
          relations: entityManifest.belongsTo.reduce(
            (
              acc: { [key: string]: EntitySchemaRelationOptions },
              belongsToRelationShip: RelationshipManifest
            ) => {
              acc[belongsToRelationShip.name] = {
                target: belongsToRelationShip.entity,
                type: 'many-to-one',
                eager: !!belongsToRelationShip.eager
              }

              return acc
            },
            {}
          )
        })

        return entitySchema
      }
    )

    return entitySchemas
  }
}