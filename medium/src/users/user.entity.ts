import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Posts } from '../posts/post.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({default: 0})
  rating: number;

  @OneToMany(() => Posts, (posts) => posts.author)
  posts: Posts[];
}
