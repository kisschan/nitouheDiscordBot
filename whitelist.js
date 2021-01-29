import dotenv from 'dotenv';
dotenv.config();
const WHITE_IDS = process.env.WHITE_IDS;

export default function includedInWhitelist(msg) {
  return WHITE_IDS.split(`,`).includes(msg.member.id);
}