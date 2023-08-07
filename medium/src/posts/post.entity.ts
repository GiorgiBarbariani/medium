// post.entity.ts
import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import {User} from "../users/user.entity";

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column("text")
  content: string;

  @ManyToOne(() => User, (user) => user.posts)
  author: User;

  @Column({type: "float", default: 0})
  rating: number;
}
