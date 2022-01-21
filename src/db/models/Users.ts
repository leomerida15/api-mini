import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Length, IsEmail, IsDate, isLowercase } from 'class-validator';
// import R_User_Rols from './R_User_Rols';
import R_User_Options from './R_User_Options';
import { JoinTable, ManyToMany } from 'typeorm';
import Rols from './Rols';

const transformer = () => {

	const to = (value: string) => value.toLowerCase();
	const from = (value: string) => value.toLowerCase();

	return { to, from }
}

@Entity(/*{ name: 'Users' }*/)
export default class Users {

	@PrimaryGeneratedColumn()
	public id?: number;

	@Column()
	public name!: string;

	@Column({ transformer: transformer(), unique: true })
	@IsEmail()
	public email!: string;

	@Column({ select: false })
	@Length(8, 12)
	public password!: string;

	@Column({ type: 'boolean', default: false })
	public status!: boolean;

	@ManyToMany(() => Rols, {
		cascade: ['insert', 'update', 'remove'],
	})
	@JoinTable({ name: 'R_User_Rols', joinColumn: { name: 'id_user' }, inverseJoinColumn: { name: 'id_rol' } })
	public roles?: Rols[];

	@OneToMany(() => R_User_Options, (R_User_Options) => R_User_Options.User)
	@JoinColumn({ name: 'Options' })
	public Options?: R_User_Options[];

	@CreateDateColumn()
	@IsDate()
	public createdAt!: Date;

	@UpdateDateColumn()
	@IsDate()
	public updatedAt!: Date;
}
