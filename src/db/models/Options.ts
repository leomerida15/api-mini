import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	JoinTable,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { IsDate, IsInt, Min } from 'class-validator';
import Elections from './Elections';
import R_User_Options from './R_User_Options';
import Imgs from './Imgs';
import { ManyToMany } from 'typeorm';

@Entity()
export default class Options {
	@PrimaryGeneratedColumn()
	public id?: number;

	@Column({ unique: true })
	public title!: string;

	@Column()
	public descript!: string;

	@Column({ type: 'int', default: 0, nullable: true })
	@IsInt()
	@Min(0)
	votes!: number;

	@Column({ name: 'id_creator' })
	public creator!: number;

	@Column({ name: 'status', default: false })
	public status!: boolean;

	@ManyToOne(() => Elections, (Elections) => Elections.Options, {
		cascade: ['insert', 'update'],
	})
	@JoinColumn({ name: 'id_election' })
	public election!: number | Elections[];

	@ManyToMany(() => Imgs, {
		cascade: ['insert', 'update', 'remove'],
	})
	@JoinTable({ name: 'R_Img_Options', joinColumn: { name: 'id_option' }, inverseJoinColumn: { name: 'id_img' } })
	public Imgs?: Imgs[];

	@OneToMany(() => R_User_Options, (R_User_Options) => R_User_Options.Option, {
		cascade: ['remove'],
	})
	@JoinColumn({ name: 'Users' })
	public Users?: R_User_Options[];

	@CreateDateColumn()
	@IsDate()
	public createdAt!: Date;

	@UpdateDateColumn()
	@IsDate()
	public updatedAt!: Date;
}
