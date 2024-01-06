import {
  Body, Controller, Delete, Get, HttpCode,
  HttpStatus, Param, ParseIntPipe, Patch, Post, Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Role, UseSecurity } from '../../../@framework/decorators';
import { CreateProductDto, ProductDto, ProductQuery, UpdateProductDto } from '../dtos';
import { ProductService } from '../services';

@ApiTags('Product')
@Controller('products')
export class ProductController {

  constructor(private readonly productService: ProductService) { }

  @Get()
  public async findAllProducts(
    @Query() query: ProductQuery,
  ): Promise<ProductDto[]> {
    return ProductDto.fromEntities(
      await this.productService.findAllProducts(query));
  }

  @Get(':id')
  public async findOneProduct(@Param('id', ParseIntPipe) id: number): Promise<ProductDto> {
    return ProductDto.fromEntity(await this.productService.findOneProduct(id));
  }

  @UseSecurity(Role.Admin)
  @Post()
  public async createOneProduct(@Body() createProductDto: CreateProductDto): Promise<ProductDto> {
    return ProductDto.fromEntity(await this.productService.createOneProduct(createProductDto));
  }

  @UseSecurity(Role.Admin)
  @Patch(':id')
  public async updateOneProduct(
    @Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto): Promise<ProductDto> {
    return ProductDto.fromEntity(await this.productService.updateOneProduct(id, updateProductDto));
  }

  @UseSecurity(Role.Admin)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  public deleteOneProduct(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.productService.deleteOneProduct(id);
  }

}
