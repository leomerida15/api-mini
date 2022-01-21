import { Entity, PrimaryGeneratedColumn, Column, getRepository, OneToMany } from 'typeorm';
import Elections from './Elections';

@Entity()
export default class Election_Status {
	@PrimaryGeneratedColumn()
	public id!: number;

	@Column()
	public name!: string;

	@OneToMany(() => Elections, (Elections) => Elections.status)
	public Elections?: Elections[];

	constructor() {
		setTimeout(() => {
			getRepository(Election_Status)
				.count()
				.then((n) => {
					if (!n) {
						getRepository(Election_Status).save([
							{ name: 'Proponer' },
							{ name: 'Votar' },
							{ name: 'Revisar' },
							{ name: 'Finalizada' },
						]);
					}
				});
		}, 9000);
	}
}
