import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import Options from './Options';

@Entity()
export default class Imgs {
	@PrimaryGeneratedColumn()
	public id?: number;

	@Column()
	public path!: string;

	@Column()
	public format!: string;

	@ManyToMany(() => Options)
	public Options?: Options[];
}
