import {
  Body, Controller, Delete, Get, HttpCode,
  HttpStatus, Param, ParseIntPipe, Patch, Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Role, UseSecurity } from '../../../@framework/decorators';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from '../dtos';
import { CategoryService } from '../services';

@ApiTags('Category')
@Controller('categories')
export class CategoryController {

  constructor(private readonly categoryService: CategoryService) { }

  @Get()
  public async findAllCategories(): Promise<CategoryDto[]> {
    return CategoryDto.fromEntities(await this.categoryService.findAllCategories());
  }

  @Get(':id')
  public async findOneCategory(@Param('id', ParseIntPipe) id: number): Promise<CategoryDto> {
    return CategoryDto.fromEntity(await this.categoryService.findOneCategory(id));
  }

  @UseSecurity(Role.Admin)
  @Post()
  public async createOneCategory(@Body() createCategoryDto: CreateCategoryDto): Promise<CategoryDto> {
    return CategoryDto.fromEntity(await this.categoryService.createOneCategory(createCategoryDto));
  }

  @UseSecurity(Role.Admin)
  @Patch(':id')
  public async updateOneCategory(@Param('id', ParseIntPipe) id: number, @Body() updateCategoryDto: UpdateCategoryDto)
    : Promise<CategoryDto> {
    return CategoryDto.fromEntity(await this.categoryService.updateOneCategory(id, updateCategoryDto));
  }

  @UseSecurity(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public deleteOneCategory(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.categoryService.deleteOneCategory(id);
  }

}
