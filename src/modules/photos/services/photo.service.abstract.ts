import type { S3 } from 'aws-sdk';
import type { CreateProductPhotosDto, CreatePhotoDto } from '../dtos';
import type { Photo } from '../entities';

export abstract class PhotoService {

  public abstract findPhoto(keyPrefix: string): Promise<Photo>;
  public abstract findPhotos(keyPrefix: string): Promise<Photo[]>;
  public abstract createProductPhotos(keyPrefix: string, photos: CreateProductPhotosDto): Promise<Photo[]>
  public abstract createPhoto(createPhotoDto: CreatePhotoDto): Promise<Photo>
  public abstract deletePhoto(id: number): Promise<void>;
  public abstract deletePhotos(ids: number[]): Promise<void>;
  public abstract uploadS3(photoBuffer: Buffer, key: string, type: string): Promise<S3.ManagedUpload.SendData>

}
