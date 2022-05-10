import { Action } from 'src/action/entities/action.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ActionList {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int', { array: true })
  actions: number[];
  /*
  @OneToMany(() => Action, (action) => action.list)
  actions: Action[];
  */
}
