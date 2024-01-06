export class CreatePhotoDto {

  public keyPrefix!: string;

  public maxPhotos?: number = 3;

  public buffer!: Buffer;

  public size!: number;

  public mimetype!: string;

}
