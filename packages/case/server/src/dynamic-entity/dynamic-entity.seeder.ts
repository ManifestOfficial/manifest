import { Injectable } from '@nestjs/common'
import { error } from 'console'
import { DataSource, EntityMetadata, Repository } from 'typeorm'

@Injectable()
export class DynamicEntitySeeder {
  constructor(private dataSource: DataSource) {}

  async seed() {
    const entities: EntityMetadata[] = this.dataSource.entityMetadatas

    const queryRunner = this.dataSource.createQueryRunner()

    const deleteTablePromises: Promise<void>[] = entities.map(
      async (entity: EntityMetadata) => {
        await queryRunner.query(`DELETE FROM ${entity.tableName}`)

        // Reset auto-increment.
        await queryRunner.query(
          `DELETE FROM sqlite_sequence WHERE name = '${entity.tableName}'`
        )
        return
      }
    )

    await Promise.all(deleteTablePromises)
    console.log('\x1b[35m', '[x] Removed all existing data...')

    const seedPromises: Promise<void>[] = []

    entities.forEach((entity: EntityMetadata) => {
      const entityRepository: Repository<any> = this.getRepository(
        entity.tableName
      )

      console.log('\x1b[35m', `[x] Seeding ${entity.tableName}...`)

      Array.from({ length: 10 }).forEach((_, index) => {
        const newItem = entityRepository.create()

        entity.columns.forEach((column) => {
          if (column.propertyName === 'id') {
            return
          }

          const propSeederFn = Reflect.getMetadata(
            `${column.propertyName}:seed`,
            newItem
          )
          if (propSeederFn) {
            newItem[column.propertyName] = propSeederFn(index)
          } else {
            // TODO: If no seed function, we should return something based on the propType.
            newItem[column.propertyName] = `test-value-${column.propertyName}`
          }
        })

        seedPromises.push(entityRepository.save(newItem))
      })
    })

    await Promise.all(seedPromises)
  }

  private getRepository(entityTableName: string): Repository<any> {
    const entity: EntityMetadata = this.dataSource.entityMetadatas.find(
      (entity: EntityMetadata) => entity.tableName === entityTableName
    )

    if (!entity) {
      throw new error('Entity not found')
    }

    return this.dataSource.getRepository(entity.target)
  }
}
