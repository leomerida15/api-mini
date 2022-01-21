import { IsDate } from 'class-validator';
import {
	Column,
	CreateDateColumn,
	Entity,
	JoinColumn,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import Options from './Options';
import { DateTime } from 'luxon';
import { ManyToOne } from 'typeorm';
import Election_Status from './Election_Status';
// date today + 1 semana con luxon

@Entity({ name: 'Elections' })
export default class Elections {
	@PrimaryGeneratedColumn()
	public id?: number;

	@Column()
	public name!: string;

	@ManyToOne(() => Election_Status, (Election_Status) => Election_Status.Elections)
	public status!: number | Election_Status;

	@Column({ type: 'timestamp', default: DateTime.local().plus({ weeks: 1 }).toJSDate() })
	public deleteAt!: Date;

	@OneToMany(() => Options, (Options) => Options.election, {
		cascade: ['insert', 'update', 'remove'],
	})
	@JoinColumn()
	public Options?: Options[];

	@Column({ default: true })
	public active?: boolean;

	@CreateDateColumn()
	@IsDate()
	public createdAt!: Date;

	// @Column()
	// @IsDate()
	// public reviewAt!: Date;

	// @Column()
	// @IsDate()
	// public voteingAt!: Date;

	// @Column()
	// @IsDate()
	// public finishAt!: Date;

	@UpdateDateColumn()
	@IsDate()
	public updatedAt!: Date;
}
