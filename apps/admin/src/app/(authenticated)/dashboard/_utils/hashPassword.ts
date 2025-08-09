import bcrypt from 'bcrypt';

const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10; // 보안 수준 설정
  return await bcrypt.hash(password, saltRounds);
};

const getHashPW = async (pw: string) => {
  const hashedPasswords = await hashPassword(pw);
  const base64PW = Buffer.from(hashedPasswords).toString('base64');

  console.log(JSON.stringify(base64PW, null)); // 해시된 비밀번호 출력
  console.log(base64PW);
};

export default getHashPW;
