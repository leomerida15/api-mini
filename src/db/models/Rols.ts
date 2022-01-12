import { Column, Entity, getRepository, JoinColumn, OneToMany, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import Users from './Users';

@Entity()
export default class Rols {
	//
	constructor() {
		setTimeout(() => {
			getRepository(Rols)
				.count()
				.then((n) => {
					if (!n) {
						getRepository(Rols).save([
							{ name: 'Admin' },
							{ name: 'Proponente' },
							{ name: 'Votante' },
							{ name: 'Revisor' },
							{ name: 'Bloqueado' },
						]);
					}
				});
		}, 9000);
	}

	@PrimaryGeneratedColumn()
	public id?: number;

	@Column()
	public name!: string;

	@ManyToMany(() => Users)
	public Users?: Users[];
}
