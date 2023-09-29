import { Module } from '@nestjs/common'

import { FileUploadController } from './file-upload.controller'
import { FileUploadService } from './file-upload.service'
import { ImageUploadService } from './image-upload.service'

/**
 * Module for handling file uploads
 * @module FileUploadModule
 */
@Module({
  controllers: [FileUploadController],
  providers: [FileUploadService, ImageUploadService]
})
export class FileUploadModule {}
