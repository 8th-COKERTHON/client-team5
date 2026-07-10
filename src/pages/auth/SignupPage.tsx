import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError, signup } from '@/api/auth';
import arrowLeftIcon from '@/assets/icons/arrow-left.svg';

const USER_ID_PATTERN = /^[A-Za-z0-9_]{4,20}$/;
const MIN_PASSWORD_LENGTH = 6;
const MAX_PASSWORD_LENGTH = 30;
const MAX_NICKNAME_LENGTH = 10;

const fieldClassName =
  'h-[3.5625rem] rounded-lg border border-[#b7b7b7] bg-white px-[1.125rem] text-[1rem] leading-[1.4375rem] text-[#121212] outline-none placeholder:text-[#b7b7b7]';

const labelClassName =
  'text-[1.125rem] font-medium leading-[1.6875rem] text-[#121212]';

const errorClassName =
  'ml-2 mt-2 text-[0.75rem] leading-[1.168rem] text-[#dd3232]';

const SignupPage = () => {
  const navigate = useNavigate();
  const [nickname, setNickname] = useState('');
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);

  const trimmedNickname = nickname.trim();
  const trimmedUserId = userId.trim();
  const hasNicknameError =
    trimmedNickname.length > 0 && trimmedNickname.length > MAX_NICKNAME_LENGTH;
  const hasUserIdError =
    trimmedUserId.length > 0 && !USER_ID_PATTERN.test(trimmedUserId);
  const hasPasswordError =
    password.length > 0 &&
    (password.length < MIN_PASSWORD_LENGTH ||
      password.length > MAX_PASSWORD_LENGTH);
  const canSubmit =
    trimmedNickname.length > 0 &&
    trimmedUserId.length > 0 &&
    password.length > 0 &&
    !hasNicknameError &&
    !hasUserIdError &&
    !hasPasswordError &&
    !isLoading;

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleCheckDuplicate = () => {
    if (!trimmedUserId || hasUserIdError) {
      setServerErrorMessage('형식에 맞춰 아이디를 입력해주세요.');
      return;
    }

    setServerErrorMessage('');
  };

  const handleSignup = async () => {
    if (!canSubmit) {
      return;
    }

    setServerErrorMessage('');
    setLoading(true);

    try {
      await signup({
        id: trimmedUserId,
        password,
        nickname: trimmedNickname,
      });

      navigate('/login');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.code === 'MEMBER_409_001') {
          setServerErrorMessage('이미 사용 중인 아이디입니다.');
          return;
        }

        setServerErrorMessage(error.message);
        return;
      }

      setServerErrorMessage('회원가입 중 문제가 발생했어요.');
    } finally {
      setLoading(false);
    }
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

      <section className="absolute left-6 right-6 top-32">
        <label htmlFor="signup-nickname" className={labelClassName}>
          닉네임
        </label>
        <input
          id="signup-nickname"
          type="text"
          value={nickname}
          onChange={(event) => {
            setNickname(event.target.value);
            setServerErrorMessage('');
          }}
          placeholder="닉네임을 입력해주세요."
          className={`${fieldClassName} mt-2.5 w-full`}
          autoComplete="nickname"
        />
        {hasNicknameError && (
          <p className={errorClassName}>10자 이내로 작성해주세요.</p>
        )}
      </section>

      <section className="absolute left-6 right-6 top-[16.5625rem]">
        <label htmlFor="signup-id" className={labelClassName}>
          아이디
        </label>
        <div className="mt-2.5 flex gap-[0.8125rem]">
          <input
            id="signup-id"
            type="text"
            value={userId}
            onChange={(event) => {
              setUserId(event.target.value);
              setServerErrorMessage('');
            }}
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
        {hasUserIdError && (
          <p className={errorClassName}>형식에 맞춰 아이디를 입력해주세요.</p>
        )}
      </section>

      <section className="absolute left-6 right-6 top-[25.125rem]">
        <label htmlFor="signup-password" className={labelClassName}>
          비밀번호
        </label>
        <input
          id="signup-password"
          type="password"
          value={password}
          onChange={(event) => {
            setPassword(event.target.value);
            setServerErrorMessage('');
          }}
          placeholder="비밀번호 6~30자"
          className={`${fieldClassName} mt-2.5 w-full`}
          autoComplete="new-password"
        />
        {hasPasswordError && (
          <p className={errorClassName}>
            비밀번호는 6~30자로 입력해주세요.
          </p>
        )}
      </section>

      {serverErrorMessage && (
        <p className="absolute bottom-[8.875rem] left-6 right-6 text-[0.8125rem] leading-[1.2rem] text-[#dd3232]">
          {serverErrorMessage}
        </p>
      )}

      <button
        type="button"
        className="absolute bottom-[4.9375rem] left-6 right-6 h-[3.5625rem] rounded-lg bg-[#6483d3] text-[1.125rem] font-medium leading-[1.4375rem] text-white disabled:cursor-not-allowed disabled:bg-[#b7b7b7]"
        onClick={handleSignup}
        disabled={!canSubmit}
      >
        {isLoading ? '가입 중' : '가입하기'}
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
