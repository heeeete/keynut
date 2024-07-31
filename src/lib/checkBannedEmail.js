async function checkBannedEmail(email, db) {
  const bannedEmail = await db.collection('bannedEmails').findOne({ email });
  return !!bannedEmail;
}

export default checkBannedEmail;
