import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import * as fs from 'fs'
import * as mkdirp from 'mkdirp'
import * as sharp from 'sharp'
import * as uniqId from 'uniqid'

/**
 * Service for handling image uploads
 * @class ImageUploadService
 */
@Injectable()
export class ImageUploadService {
  storagePath: string
  packageRoot: string

  private readonly imageSizes = {
    thumbnail: {
      width: 80,
      height: 80
    },
    large: {
      width: 800,
      height: 800
    }
  }

  /**
   * Constructor for the ImageUploadService class
   * @param {ConfigService} configService - The configuration service
   */
  constructor(configService: ConfigService) {
    this.storagePath = configService.get('storageFolder')
    this.packageRoot = configService.get('packageRoot')
  }

  /**
   * Stores an image and returns its path.
   *
   * @param {any} file - The image to store.
   * @param {string} propName - The slug of the entity to associate the image with.
   * @returns {string} The path of the stored image.
   */
  store(file: any, propName: string): string {
    // CamelCase to kebab-case.
    const kebabCaseEntityName = propName
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase()

    // Create custom path. Ex: "posts/Jan19/23/4n5pxq24kp3iob12og9"
    const dateString =
      new Date().toLocaleString('en-us', { month: 'short' }) +
      new Date().getFullYear()
    const folder = `${kebabCaseEntityName}/${dateString}`
    mkdirp.sync(`${this.storagePath}/${folder}`)

    const name: string = uniqId()

    // Iterate through image sizes.
    Object.keys(this.imageSizes).forEach((key: string) => {
      const path = `${folder}/${name}-${key}.jpg`
      sharp(file.buffer)
        .jpeg({ quality: 80 })
        .resize(this.imageSizes[key].width, this.imageSizes[key].height, {
          fit: this.imageSizes[key].fit
        })
        .toFile(
          `${this.storagePath}/${path}`,
          (err: Error, info: sharp.OutputInfo) => {
            return path
          }
        )
    })
    return `/${folder}/${name}`
  }

  /**
   * Adds a dummy image to the storage system.
   */
  addDummyImages(): void {
    const folder: string = `${this.storagePath}/dummy`

    mkdirp.sync(folder)

    for (let i = 1; i <= 5; i++) {
      fs.copyFileSync(
        this.packageRoot + `/assets/seed/dummy-image${i}-thumbnail.jpg`,
        folder + `/dummy-image${i}-thumbnail.jpg`
      )
      fs.copyFileSync(
        this.packageRoot + `/assets/seed/dummy-image${i}-large.jpg`,
        folder + `/dummy-image${i}-large.jpg`
      )
    }
  }
}
