export class CreateProductPhotosDto {

  public main!: Express.Multer.File[];
  public additional?: Express.Multer.File[];

}
