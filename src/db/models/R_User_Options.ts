import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Users from './Users';
import Options from './Options';
import Elections from './Elections';

@Entity()
export default class R_User_Options {
	@PrimaryGeneratedColumn()
	public id?: number;

	@ManyToOne(() => Users, (Users) => Users.Options)
	@JoinColumn({ name: 'id_user' })
	public User!: number | Users;

	@ManyToOne(() => Options, (Options) => Options.Users)
	@JoinColumn({ name: 'id_option' })
	public Option!: number | Options;
}
