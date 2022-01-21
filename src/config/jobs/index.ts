// import { DateTime } from 'luxon';
// import cron from 'node-cron';
// import { getRepository, Not } from 'typeorm';
// import Elections from '../../db/models/Elections';



// const CronJobs = () => {
//     cron.schedule('0 0 * * *', async () => {
//         try {
//             const views = (await getRepository('Elections').findOne({ status: Not(4) })) as Elections | undefined;
//             if (!views) throw 'no existe una eleccion activa con status 1';

//             // fecha de hoy con luxon

//             const today = DateTime.local().valueOf();
//             const reviewAt = DateTime.fromFormat(`${views.reviewAt}`, 'DD-MM-YYYY').valueOf();
//             const voteingAt = DateTime.fromFormat(`${views.voteingAt}`, 'DD-MM-YYYY').valueOf();
//             const finishAt = DateTime.fromFormat(`${views.finishAt}`, 'DD-MM-YYYY').valueOf();


//             if (today >= reviewAt) await getRepository('Elections').update({ id: views.id }, { status: 3 });
//             if (today >= voteingAt) await getRepository('Elections').update({ id: views.id }, { status: 2 });
//             if (today >= finishAt) await getRepository('Elections').update({ id: views.id }, { status: 4 });

//         } catch (err) {
//             console.log(err);

//         }
//     });
// }

// export default CronJobs;