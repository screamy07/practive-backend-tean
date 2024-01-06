import { Inject, Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';
import { PhotoService } from './photo.service.abstract';
import type { CreatePhotoDto, CreateProductPhotosDto } from '../dtos';
import type { Photo } from '../entities';
import { IPhotoRepository } from '../interfaces';
import { PhotoRepository } from '../repositories';

@Injectable()
export class PhotoServiceImpl extends PhotoService {

  private s3 = new S3();

  constructor(
    @Inject(PhotoRepository) private photoRepository: IPhotoRepository,
    private readonly configService: ConfigService,
  ) { super(); }

  public async findPhoto(keyPrefix: string): Promise<Photo> {
    const photo = await this.photoRepository.findOneLike(`${keyPrefix}%`);
    if (!photo) throw new NotFoundException(`Photo of ${keyPrefix} not found`);

    return photo;
  }

  public findPhotos(keyPrefix: string): Promise<Photo[]> {
    return this.photoRepository.findManyLike(`${keyPrefix}%`);
  }

  public async createProductPhotos(keyPrefix: string, photos: CreateProductPhotosDto): Promise<Photo[]> {
    const photoEntities: Photo[] = [];

    const { buffer, size, mimetype } = photos.main[0] as Express.Multer.File;
    photoEntities.push(await this.createPhoto({ keyPrefix, buffer, size, mimetype }));

    if (!photos.additional) return photoEntities;
    for (const { buffer, size, mimetype } of photos.additional) {
      photoEntities.push(await this.createPhoto(
        { keyPrefix: `${keyPrefix}additional/`, buffer, size, mimetype, maxPhotos: photos.additional.length }));
    }

    return photoEntities;
  }

  public async createPhoto({ keyPrefix, buffer, size, mimetype, maxPhotos }: CreatePhotoDto): Promise<Photo> {
    if (keyPrefix.includes('additional')) {
      const photos = await this.photoRepository.findManyLike(`${keyPrefix}%`);
      photos.length >= (maxPhotos as number) ? await this.deletePhoto((photos[0] as Photo).id) : null;
    } else {
      const doesPhotoExist = await this.photoRepository.findOneLike(`${keyPrefix}%`);
      if (doesPhotoExist) await this.deletePhoto(doesPhotoExist.id);
    }

    const photo = await this.photoRepository.createOne(mimetype, size);

    const { Key, Location } =
      await this.uploadS3(buffer, `${keyPrefix}${photo.id}`, mimetype);

    return this.photoRepository.updateOne(photo, Location, Key);
  }

  public async deletePhoto(id: number): Promise<void> {
    const photo = await this.photoRepository.findOneBy({ id });
    if (!photo) throw new NotFoundException(`Photo with ID ${id} not found`);

    await this.photoRepository.remove(photo);
    await this.s3.deleteObject({ Key: photo.key, Bucket: this.configService.get<string>('AWS_BUCKET') as string })
      .promise();
  }

  public async deletePhotos(ids: number[]): Promise<void> {
    for (const id of ids) {
      await this.deletePhoto(id);
    }
  }

  public uploadS3(photoBuffer: Buffer, key: string, type: string): Promise<S3.ManagedUpload.SendData> {
    const params: S3.PutObjectRequest = {
      Bucket: this.configService.get<string>('AWS_BUCKET') as string,
      Body: photoBuffer,
      Key: key,
      ContentType: type,
      ACL: 'public-read',
    };

    return this.s3.upload(params).promise();
  }

}
