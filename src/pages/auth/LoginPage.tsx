import { useState } from 'react';

const inputClassName =
  'h-[3.5625rem] w-full rounded-lg border border-[rgba(230,230,230,0.7)] bg-transparent px-[1.375rem] text-[0.9375rem] font-light leading-[1.4375rem] text-white outline-none placeholder:text-[rgba(230,230,230,0.7)]';

const LoginPage = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // API schema 확인 후 /api/auth/login 연동 예정
  };

  const handleSignupClick = () => {
    // 회원가입 화면 연결 예정
  };

  return (
    <main className="relative h-full w-full overflow-hidden bg-[linear-gradient(180deg,#0d2571_8.59%,#121212_141.65%)] font-['Pretendard'] text-white">
      <section className="absolute left-1/2 top-[6.1875rem] h-[20.1875rem] w-[19.75rem] -translate-x-1/2 bg-white">
        <span className="absolute left-20 top-[9.5625rem] text-[0.6875rem] leading-[1.168rem] text-black">
          로고 영역
        </span>
      </section>

      <section className="absolute left-1/2 top-[29rem] flex w-[19.875rem] -translate-x-1/2 flex-col gap-[1.5625rem]">
        <div className="flex flex-col gap-[0.875rem]">
          <label htmlFor="login-id" className="sr-only">
            아이디
          </label>
          <input
            id="login-id"
            type="text"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder="아이디 입력"
            className={inputClassName}
            autoComplete="username"
          />

          <label htmlFor="login-password" className="sr-only">
            비밀번호
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="비밀번호 입력"
            className={inputClassName}
            autoComplete="current-password"
          />
        </div>

        <button
          type="button"
          className="h-[3.5625rem] w-full rounded-lg bg-[#6483d3] text-[1.125rem] font-medium leading-[1.4375rem] text-white"
          onClick={handleLogin}
        >
          로그인
        </button>
      </section>

      <div className="absolute left-1/2 top-[43.3125rem] flex -translate-x-1/2 items-center gap-[0.8125rem]">
        <span className="whitespace-nowrap text-[0.8125rem] font-light leading-[1.21875rem] text-[#b7b7b7]">
          아직 계정이 없나요?
        </span>
        <button
          type="button"
          className="whitespace-nowrap text-[1rem] font-medium leading-6 text-[#6483d3]"
          onClick={handleSignupClick}
        >
          회원가입
        </button>
      </div>
    </main>
  );
};

export default LoginPage;
