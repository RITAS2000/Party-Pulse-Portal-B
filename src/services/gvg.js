import mongoose from 'mongoose';
import { GvgCollections } from '../db/models/gvg.js';

// export default async function createGvg(payload) {
//   const newGvg = await GvgCollections.create({
//     clanId: new mongoose.Types.ObjectId(payload.clanId),
//     territory: payload.territory,
//     enemy: payload.enemy,
//     date: payload.date,
//     time: payload.time,
//     attackOrDefense: payload.type,
//     safeZone: [],
//   });

//   return newGvg;
// }
export default async function createGvg(payload) {
  try {
    const newGvg = await GvgCollections.create({
      clanId: new mongoose.Types.ObjectId(payload.clanId),
      territory: payload.territory,
      enemy: payload.enemy,
      date: payload.date,
      time: payload.time,
      attackOrDefense: payload.attackOrDefense,
      safeZone: [],
    });
    return newGvg;
  } catch (err) {
    console.error('Create GvG error:', err);
    throw err; // щоб контролер отримав
  }
}
