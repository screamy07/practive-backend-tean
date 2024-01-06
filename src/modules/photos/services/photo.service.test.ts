import { NotFoundException } from '@nestjs/common';
import type { Provider } from '@nestjs/common/interfaces';
import { ConfigService } from '@nestjs/config';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { S3 } from 'aws-sdk';
import { Readable } from 'stream';
import type { CreateProductPhotosDto } from '../dtos';
import { Photo } from '../entities';
import type { IPhotoRepository } from '../interfaces';
import { PhotoRepository } from '../repositories';
import { PhotoServiceImpl } from './photo.service';
import { PhotoService } from './photo.service.abstract';

const CORRECT_ID = 1;
const CORRECT_KEYPREFIX = 'product/1/'; const WRONG_KEY_PREFIX = 'product/5/';
const AWS_BUCKET = 'nestjs-photo-bucket';

const photos: Photo[] = Photo.fromMany([
  { id: 1, path: './photos/product/1/1', key: 'product/1/1', type: 'image/png' },
  { id: 2, path: './photos/product/1/additional/2', key: 'product/1/2', type: 'image/png' },
  { id: 3, path: './photos/product/1/additional/3', key: 'product/1/3', type: 'image/png' },
]);

const multerFile: Express.Multer.File = {
  fieldname: 'photo', originalname: 'photo', mimetype: 'image/png', size: 1,
  stream: new Readable(), destination: '',
  filename: 'photo', path: 'photos/photo', buffer: new Buffer(1), encoding: '',
};

const sendData: S3.ManagedUpload.SendData = {
  Location: './photos/product/1/1',
  ETag: 'ETag',
  Bucket: AWS_BUCKET,
  Key: 'product/1/1',
};

function getPhotoById(id: number): Photo {
  return photos.find(photo => photo.id === id) as Photo;
}

const mockPhotoRepositoryFactory: () => MockType<IPhotoRepository> =
  jest.fn(() => ({
    findManyLike: jest.fn().mockResolvedValue(photos),
    findOneLike: jest.fn().mockResolvedValue(getPhotoById(CORRECT_ID)),
    createOne: jest.fn().mockResolvedValue(getPhotoById(CORRECT_ID)),
    updateOne: jest.fn().mockResolvedValue(getPhotoById(CORRECT_ID)),
    remove: jest.fn(),
  }));

describe('PhotoService', () => {
  let service: PhotoService;
  let repository: IPhotoRepository;
  let configService: ConfigService;

  const s3Instance = {
    upload: (params: S3.PutObjectRequest): S3.ManagedUpload => new S3.ManagedUpload({ params }),
    promise: (): Promise<S3.ManagedUpload.SendData> => Promise.resolve(sendData),
  };

  jest.mock('aws-sdk', () => ({ S3: jest.fn(() => s3Instance) }));

  const photoServiceImpl: Provider = {
    provide: PhotoService,
    useClass: PhotoServiceImpl,
  };

  const photoRepositoryImpl: Provider = {
    provide: PhotoRepository,
    useFactory: mockPhotoRepositoryFactory,
  };

  const configServiceImpl: Provider = {
    provide: ConfigService,
    useValue: {
      get: jest.fn((): string => AWS_BUCKET),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [photoServiceImpl, photoRepositoryImpl, configServiceImpl],
    }).compile();

    service = module.get<PhotoService>(PhotoService);
    repository = module.get<IPhotoRepository>(PhotoRepository);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findPhoto', () => {
    it('returns one photo by keyprefix', async () => {
      const findOneLikeSpy = jest.spyOn(repository, 'findOneLike');
      const result = await service.findPhoto(CORRECT_KEYPREFIX);

      expect(findOneLikeSpy).toBeCalledWith(CORRECT_KEYPREFIX);
      expect(result).toStrictEqual(getPhotoById(CORRECT_ID));
    });

    it('photo with ID not found', () => {
      jest.spyOn(repository, 'findOneLike').mockResolvedValueOnce(null);

      expect(async () => await service.findPhoto(WRONG_KEY_PREFIX))
        .rejects.toThrow(new NotFoundException(`Photo of ${WRONG_KEY_PREFIX} not found`));
    });
  });

  describe('findPhotos', () => {
    it('returns many photos by keyprefix', async () => {
      const result = await service.findPhotos(CORRECT_KEYPREFIX);

      expect(result).toStrictEqual(photos);
    });
  });

  describe('createProductPhotos', () => {
    it('creates product photos', async () => {
      const createPhotoSpy = jest.spyOn(service, 'createPhoto');
      const createPhotoOptions = { CORRECT_KEYPREFIX, buffer: new Buffer(1), size: 1, mimetype: 'image/png' };
      const creareProductPhotosDto: CreateProductPhotosDto = {
        main: [multerFile],
        additional: [multerFile],
      };

      const result = await service.createProductPhotos(CORRECT_KEYPREFIX, creareProductPhotosDto);

      expect(createPhotoSpy).toBeCalledWith(createPhotoOptions);
      expect(createPhotoSpy).toBeCalledTimes(2);
      expect(result).toStrictEqual(getPhotoById(CORRECT_ID));
    });
  });

  describe('uploadS3', () => {
    it('uploads photo to AWS', async () => {
      const getSpy = jest.spyOn(configService, 'get');

      const result = await service.uploadS3(multerFile.buffer, CORRECT_KEYPREFIX + CORRECT_ID, multerFile.mimetype);

      expect(getSpy).toBeCalledTimes(1);
      expect(result).toStrictEqual(sendData);
    });
  });
});
