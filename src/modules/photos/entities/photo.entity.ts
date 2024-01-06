import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Photo {

  @PrimaryGeneratedColumn('increment')
  public id!: number;

  @Column({ type: 'varchar', default: '' })
  public path!: string;

  @Column({ type: 'varchar' })
  public type!: string;

  @Column({ type: 'int' })
  public size!: number;

  @Column({ type: 'varchar', default: '' })
  public key!: string;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  public createdAt!: Date;

  public static from(data: Partial<Photo>): Photo {
    const photo = new Photo();

    photo.id = data.id ?? 1;
    photo.key = data.key ?? '';
    photo.path = data.path ?? './' + photo.key;
    photo.size = data.size ?? 1;
    photo.type = data.type ?? '';

    return photo;
  }

  public static fromMany(data: Partial<Photo>[]): Photo[] {
    return data.map(data => this.from(data));
  }

}
