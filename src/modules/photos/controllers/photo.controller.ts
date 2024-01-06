import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ParseArrayPipe } from '@nestjs/common/pipes';
import { ApiTags } from '@nestjs/swagger';
import { Role, UseSecurity, UseFile, UseFiles, UserDecorator } from '../../../@framework/decorators';
import { CreateProductPhotosDto, PhotoDto } from '../dtos';
import { PhotoOwner } from '../entities';
import { PhotoService } from '../services';

@ApiTags('Photo')
@Controller('photo')
export class PhotoController {

  constructor(private readonly photoService: PhotoService) { }

  @UseSecurity(Role.User, Role.Admin)
  @Get('user')
  public async findUserPhoto(@UserDecorator('id' as keyof Express.User) id: number): Promise<PhotoDto> {
    return PhotoDto.fromEntity(await this.photoService.findPhoto(`${PhotoOwner.User}/${id}/`));
  }

  @Get('product/:id')
  public async findProductPhoto(@Param('id', ParseIntPipe) id: number): Promise<PhotoDto[]> {
    return PhotoDto.fromEntities(await this.photoService.findPhotos(`${PhotoOwner.Product}/${id}/`));
  }

  @Get('category/:id')
  public async findCategoryPhoto(@Param('id', ParseIntPipe) id: number): Promise<PhotoDto> {
    return PhotoDto.fromEntity(await this.photoService.findPhoto(`${PhotoOwner.Category}/${id}/`));
  }

  @UseSecurity(Role.User, Role.Admin)
  @UseFile('photo')
  @Post('user')
  public async createUserPhoto(@UserDecorator('id' as keyof Express.User) id: number,
    @UploadedFile() photo: Express.Multer.File): Promise<PhotoDto> {
    return PhotoDto.fromEntity(await this.photoService.createPhoto(
      { keyPrefix: `${PhotoOwner.User}/${id}/`, buffer: photo.buffer, size: photo.size, mimetype: photo.mimetype }));
  }

  @UseSecurity(Role.Admin)
  @UseFiles([
    { name: 'main', maxCount: 1, required: true },
    { name: 'additional', maxCount: 3, required: false }], ['additional'])
  @Post('product/:id')
  public async createProductPhoto(@Param('id', ParseIntPipe) id: number,
    @UploadedFiles() photos: CreateProductPhotosDto): Promise<PhotoDto[]> {
    return PhotoDto.fromEntities(await this.photoService.createProductPhotos(`${PhotoOwner.Product}/${id}/`, photos));
  }

  @UseSecurity(Role.Admin)
  @UseFile('photo')
  @Post('category/:id')
  public async createCategoryPhoto(@Param('id', ParseIntPipe) id: number,
    @UploadedFile() photo: Express.Multer.File): Promise<PhotoDto> {
    return PhotoDto.fromEntity(
      await this.photoService.createPhoto({
        keyPrefix: `${PhotoOwner.Category}/${id}/`,
        buffer: photo.buffer, size: photo.size, mimetype: photo.mimetype,
      }));
  }

  @UseSecurity(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public deletePhoto(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.photoService.deletePhoto(id);
  }

  @UseSecurity(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  public deletePhotos(@Query('ids', new ParseArrayPipe({ items: Number, separator: ',' })) ids: number[])
    : Promise<void> {
    return this.photoService.deletePhotos(ids);
  }

}
