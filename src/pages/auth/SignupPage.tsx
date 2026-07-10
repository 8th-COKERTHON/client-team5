import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import arrowLeftIcon from '@/assets/icons/arrow-left.svg';

const fieldClassName =
  'h-[3.5625rem] rounded-lg border border-[#b7b7b7] bg-white px-[1.125rem] text-[1rem] leading-[1.4375rem] text-[#121212] outline-none placeholder:text-[#b7b7b7]';

const labelClassName =
  'text-[1.125rem] font-medium leading-[1.6875rem] text-[#121212]';

const SignupPage = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleCheckDuplicate = () => {
    // 아이디 중복확인 API가 추가되면 연결 예정
  };

  const handleSignup = () => {
    // 회원가입 API 연동 예정
  };

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <main className="relative h-full w-full overflow-hidden bg-white font-['Pretendard'] text-[#121212]">
      <header className="absolute left-6 right-6 top-[4.375rem] flex h-7 items-center">
        <button
          type="button"
          className="flex size-7 items-center justify-center"
          aria-label="뒤로가기"
          onClick={handleBackClick}
        >
          <img src={arrowLeftIcon} alt="" className="size-5" />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-[1.25rem] font-medium leading-[1.4375rem]">
          회원가입
        </h1>
      </header>

      <section className="absolute left-6 right-6 top-32 flex flex-col gap-2.5">
        <label htmlFor="signup-nickname" className={labelClassName}>
          닉네임
        </label>
        <input
          id="signup-nickname"
          type="text"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          placeholder="닉네임을 입력해주세요."
          className={fieldClassName}
          autoComplete="nickname"
        />
      </section>

      <section className="absolute left-6 right-6 top-[16.5625rem] flex flex-col gap-2.5">
        <label htmlFor="signup-id" className={labelClassName}>
          아이디
        </label>
        <div className="flex gap-[0.8125rem]">
          <input
            id="signup-id"
            type="text"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder="영문과 숫자 4~20자 이내"
            className={`${fieldClassName} min-w-0 flex-1`}
            autoComplete="username"
          />
          <button
            type="button"
            className="h-[3.5625rem] w-[5.625rem] rounded-lg bg-[#121212] text-[0.9375rem] leading-[1.4375rem] text-white"
            onClick={handleCheckDuplicate}
          >
            중복확인
          </button>
        </div>
      </section>

      <section className="absolute left-6 right-6 top-[25.125rem] flex flex-col gap-2.5">
        <label htmlFor="signup-password" className={labelClassName}>
          비밀번호
        </label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="영문 · 숫자 · 특수기호 8자 이상"
          className={fieldClassName}
          autoComplete="new-password"
        />
      </section>

      <button
        type="button"
        className="absolute bottom-[4.9375rem] left-6 right-6 h-[3.5625rem] rounded-lg bg-[#b7b7b7] text-[1.125rem] font-medium leading-[1.4375rem] text-white"
        onClick={handleSignup}
      >
        가입하기
      </button>

      <div className="absolute bottom-[2.5rem] left-1/2 flex -translate-x-1/2 items-center gap-[0.8125rem]">
        <span className="whitespace-nowrap text-[0.8125rem] font-medium leading-[1.21875rem] text-[#b7b7b7]">
          이미 계정이 있나요?
        </span>
        <button
          type="button"
          className="whitespace-nowrap text-[1rem] font-medium leading-6 text-[#6483d3]"
          onClick={handleLoginClick}
        >
          로그인
        </button>
      </div>
    </main>
  );
};

export default SignupPage;
