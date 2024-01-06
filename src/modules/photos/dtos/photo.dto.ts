import type { Photo } from '../entities';

export class PhotoDto {

  public id!: number;
  public path!: string;

  public static fromEntity(photo: Photo): PhotoDto {
    const photoDto = new PhotoDto();
    photoDto.id = photo.id;
    photoDto.path = photo.path;

    return photoDto;
  }

  public static fromEntities(photos: Photo[]): PhotoDto[] {
    const photoDtos: PhotoDto[] = [];

    photos.forEach(photo => photoDtos.push(this.fromEntity(photo)));
    return photoDtos;
  }

}
