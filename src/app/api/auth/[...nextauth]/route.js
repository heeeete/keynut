import NextAuth from 'next-auth';
import KakaoProvider from 'next-auth/providers/kakao';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { connectDB } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

function getRandomKoreanWord() {
  const firstWords = [
    '이쁜',
    '잠오는',
    '졸린',
    '밥먹는',
    '뛰어노는',
    '웃는',
    '화난',
    '슬픈',
    '기쁜',
    '배고픈',
    '만족한',
    '잠꾸러기',
    '깨어난',
    '노래하는',
    '춤추는',
    '책읽는',
    '공부하는',
    '게임하는',
    '달리는',
    '느긋한',
    '활발한',
    '지혜로운',
    '용감한',
    '조용한',
    '성실한',
    '친절한',
    '예의바른',
    '부지런한',
    '재미있는',
    '행복한',
    '가난한',
    '부유한',
    '건강한',
    '아픈',
    '강한',
    '약한',
    '새로운',
    '오래된',
    '젊은',
    '늙은',
    '빠른',
    '느린',
    '긴',
    '짧은',
    '큰',
    '작은',
    '깨끗한',
    '높은',
    '낮은',
    '따뜻한',
    '추운',
    '따뜻한',
    '시원한',
    '무서운',
    '귀여운',
  ];

  const secondWords = [
    '코끼리',
    '쥐',
    '쿼카',
    '코알라',
    '카피바라',
    '사자',
    '호랑이',
    '곰',
    '판다',
    '여우',
    '늑대',
    '토끼',
    '고양이',
    '강아지',
    '말',
    '소',
    '양',
    '염소',
    '닭',
    '오리',
    '거위',
    '기린',
    '코뿔소',
    '하마',
    '돌고래',
    '고래',
    '상어',
    '물고기',
    '개구리',
    '뱀',
    '악어',
    '거북이',
    '두더지',
    '박쥐',
    '다람쥐',
    '너구리',
    '족제비',
    '하늘소',
    '딱정벌레',
    '나비',
    '벌',
    '개미',
    '사마귀',
    '잠자리',
    '메뚜기',
    '귀뚜라미',
    '달팽이',
    '지렁이',
    '반딧불이',
    '오징어',
    '문어',
    '새우',
    '게',
    '소라',
    '고동',
    '조개',
    '해파리',
    '불가사리',
    '산호',
  ];

  const firstWord = firstWords[Math.floor(Math.random() * firstWords.length)];
  const secondWord = secondWords[Math.floor(Math.random() * secondWords.length)];

  return `${firstWord}${secondWord}`;
}

async function addUserNickname(user, db) {
  let isDuplicate = true;
  let nickname;

  // 닉네임 중복 체크 루프
  while (isDuplicate) {
    nickname = getRandomKoreanWord() + ~~(Math.random() * 1000);
    const existingUser = await db.collection('users').findOne({ nickname: nickname });
    if (!existingUser) {
      isDuplicate = false;
    }
  }

  // 사용자 데이터를 업데이트합니다. 여기서 닉네임을 추가합니다.
  await db.collection('users').updateOne(
    { _id: new ObjectId(user.id) },
    {
      $set: {
        nickname: nickname,
      },
    },
  );
  return { ...user, nickname };
}

async function initRaiseCountAndCreatedAt(user, db) {
  await db.collection('users').updateOne(
    { _id: new ObjectId(user.id) },
    {
      $set: {
        raiseCount: 5,
        lastRaiseReset: new Date(),
        createdAt: new Date(),
        state: 1,
      },
    },
  );
}

export const authOptions = {
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      authorization: {
        params: {
          redirect_uri: process.env.NEXT_PUBLIC_BASE_URL + '/api/auth/callback/kakao',
        },
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          scope: 'email', // 'profile' 범위를 제거하고 'email' 범위만 사용
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    // maxAge: 30 * 24 * 60 * 60, // 30일
    maxAge: 1 * 24 * 60 * 60,
    // maxAge: 8,
  },
  callbacks: {
    // async signIn({ user, account, profile }) {
    //   const client = await connectDB;
    //   const db = client.db(process.env.MONGODB_NAME);

    //   const isBanned = await checkBannedEmail(user.email, db);
    //   if (isBanned) {
    //     throw new Error('Your account has been banned.');
    //   }

    //   return true;
    // },
    async jwt({ token, user, account, trigger, session }) {
      const client = await connectDB;
      const db = client.db(process.env.MONGODB_NAME);

      if (user) {
        delete user.products;
        token.user = user;
        if (user.email === process.env.ADMIN_EMAIL) token.admin = true;
      }

      if (trigger === 'update' && session) {
        const { openChatUrl, image, nickname, nicknameChangedAt, recentSearches } = session;
        if (openChatUrl !== undefined || openChatUrl !== null) token.user.openChatUrl = openChatUrl;
        if (image !== undefined) token.user.image = image;
        if (nickname) token.user.nickname = nickname;
        if (nicknameChangedAt) token.user.nicknameChangedAt = nicknameChangedAt;
        if (recentSearches) token.user.recentSearches = recentSearches;
      }

      if (account) {
        // console.log('===========', account);/
        const userDoc = await db.collection('users').findOne({ _id: new ObjectId(user.id) });
        token.user.nickname = userDoc.nickname;
        token.user.provider = account.provider;
        // token.user.lastRaiseReset = userDoc.lastRaiseReset;
        // token.user.raiseCount = userDoc.raiseCount;
        await db.collection('accounts').updateOne(
          { userId: new ObjectId(token.user.id) },
          {
            $set: {
              access_token: account.access_token,
              expires_at: account.expires_at,
              refresh_token: account.refresh_token,
            },
          },
        );
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.user) session.user = token.user;
      if (token?.admin) session.admin = true;
      if (token?.access_token) {
        session.access_token = token.access_token;
        session.provider = token.provider;
      }

      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(connectDB, {
    databaseName: 'keynut',
  }),
  events: {
    async createUser(message) {
      const client = await connectDB;
      const db = client.db(process.env.MONGODB_NAME);
      try {
        await addUserNickname(message.user, db);
        await initRaiseCountAndCreatedAt(message.user, db);
      } catch (error) {
        console.error('Error during user creation:', error);
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error', // 커스텀 오류 페이지 경로 설정
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
