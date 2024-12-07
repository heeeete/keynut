import { Db } from 'mongodb';

async function checkBannedEmail(email: string, db: Db) {
  const bannedEmail = await db.collection('bannedEmails').findOne({ email });
  return bannedEmail;
}

export default checkBannedEmail;
