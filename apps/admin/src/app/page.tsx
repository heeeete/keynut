'use client';

import { useRouter } from 'next/navigation';

export default function Page() {
  const router = useRouter();

  const permissionCheck = async (formData: FormData) => {
    try {
      const res: Response = await fetch('/api/login', {
        method: 'POST',
        body: formData,
      });
      if (res.ok) {
        router.push('/dashboard');
      } else {
        alert('아이디 또는 비밀번호가 올바르지 않습니다.');
      }
    } catch (error) {
      console.error(error);
      alert('로그인 시도 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.');
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = formData.get('id'); // "id" 필드 값 가져오기
    const password = formData.get('pw'); // "password" 필드 값 가져오기

    console.log('ID:', id);
    console.log('Password:', password);
    permissionCheck(formData);
  };

  return (
    <main className="flex flex-col justify-center items-center h-full">
      <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-2">
        <input
          type="text"
          name="id"
          className="bg-slate-500 w-40 border-gray-700 border-4 rounded-md text-white px-3"
          placeholder="ID"
        />
        <input
          type="password"
          name="pw"
          className="bg-slate-500 w-40 border-gray-700 border-4 rounded-md text-white px-3"
          placeholder="PW"
        />
        <button type="submit">Login</button>
      </form>
    </main>
  );
}
