import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiError, login } from '@/api/auth';
import closeIcon from '@/assets/icons/x.svg';
import flightImage from '@/assets/images/flight.svg';

const TEXT = {
  closeHome: '\uD648\uC73C\uB85C \uC774\uB3D9',
  titleLine1: '\uB2F9\uC2E0\uC758 \uC218\uBA74 \uB9AC\uB4EC\uC740',
  titleHighlight: '\uC5B4\uB290 \uB3C4\uC2DC',
  titleSuffix: '\uC5D0',
  titleLine3: '\uBA38\uBB3C\uB7EC \uC788\uB098\uC694?',
  userId: '\uC544\uC774\uB514',
  userIdPlaceholder: '\uC544\uC774\uB514 \uC785\uB825',
  password: '\uBE44\uBC00\uBC88\uD638',
  passwordPlaceholder: '\uBE44\uBC00\uBC88\uD638 \uC785\uB825',
  requiredError:
    '\uC544\uC774\uB514\uC640 \uBE44\uBC00\uBC88\uD638\uB97C \uC785\uB825\uD574\uC8FC\uC138\uC694.',
  fallbackError:
    '\uB85C\uADF8\uC778 \uC911 \uBB38\uC81C\uAC00 \uBC1C\uC0DD\uD588\uC5B4\uC694.',
  login: '\uB85C\uADF8\uC778',
  loggingIn: '\uB85C\uADF8\uC778 \uC911',
  noAccount:
    '\uC544\uC9C1 \uACC4\uC815\uC774 \uC5C6\uB098\uC694?',
  signup: '\uD68C\uC6D0\uAC00\uC785',
} as const;

const inputClassName =
  'flex h-[3.5625rem] w-full items-center self-stretch rounded-lg border border-[rgba(230,230,230,0.7)] bg-transparent py-[1.0625rem] pl-[1.4375rem] pr-[13.125rem] text-[0.9375rem] font-light leading-[1.4375rem] text-white outline-none placeholder:text-[rgba(230,230,230,0.7)] [background-clip:padding-box] [&:-webkit-autofill]:[transition:background-color_9999s_ease-in-out_0s] [&:-webkit-autofill]:[-webkit-text-fill-color:white]';

const LoginPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);

  const handleCloseClick = () => {
    navigate('/');
  };

  const handleLogin = async () => {
    if (isLoading) {
      return;
    }

    if (!userId.trim() || !password.trim()) {
      setErrorMessage(TEXT.requiredError);
      return;
    }

    setErrorMessage('');
    setLoading(true);

    try {
      const response = await login({
        id: userId.trim(),
        password,
      });

      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('grantType', response.grantType);
      navigate('/');
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage(TEXT.fallbackError);
    } finally {
      setLoading(false);
    }
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <main className="relative h-full w-full overflow-hidden bg-[linear-gradient(180deg,#0d2571_8.59%,#121212_141.65%)] font-['Pretendard'] text-white">
      <button
        type="button"
        className="absolute right-[2.125rem] top-[2.5625rem] z-20 flex size-[1.125rem] items-center justify-center"
        aria-label={TEXT.closeHome}
        onClick={handleCloseClick}
      >
        <img src={closeIcon} alt="" className="size-[1.978rem]" />
      </button>

      <h1 className="absolute left-9 top-[6.625rem] z-10 w-[21.4375rem] text-[1.875rem] font-semibold leading-[2.625rem]">
        {TEXT.titleLine1}
        <br />
        <span className="text-[#6483d3]">{TEXT.titleHighlight}</span>
        {TEXT.titleSuffix}
        <br />
        {TEXT.titleLine3}
      </h1>

      <img
        src={flightImage}
        alt=""
        className="absolute left-[-2.75rem] top-[5.1875rem] h-[21.9277rem] w-[33.6971rem] max-w-none"
      />

      <section className="absolute left-1/2 top-[29rem] z-10 flex w-[19.875rem] -translate-x-1/2 flex-col gap-[1.5625rem]">
        <div className="flex flex-col gap-[0.875rem]">
          <label htmlFor="login-id" className="sr-only">
            {TEXT.userId}
          </label>
          <input
            id="login-id"
            type="text"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder={TEXT.userIdPlaceholder}
            className={inputClassName}
            autoComplete="username"
          />

          <label htmlFor="login-password" className="sr-only">
            {TEXT.password}
          </label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={TEXT.passwordPlaceholder}
            className={inputClassName}
            autoComplete="current-password"
          />
        </div>

        {errorMessage && (
          <p className="text-[0.8125rem] font-light leading-[1.2rem] text-[#ffb4b4]">
            {errorMessage}
          </p>
        )}

        <button
          type="button"
          className="h-[3.5625rem] w-full rounded-lg bg-[#6483d3] text-[1.125rem] font-medium leading-[1.4375rem] text-white disabled:cursor-not-allowed disabled:opacity-70"
          onClick={handleLogin}
          disabled={isLoading}
        >
          {isLoading ? TEXT.loggingIn : TEXT.login}
        </button>
      </section>

      <div className="absolute left-1/2 top-[43.3125rem] z-10 flex -translate-x-1/2 items-center gap-[0.8125rem]">
        <span className="whitespace-nowrap text-[0.8125rem] font-light leading-[1.21875rem] text-[#b7b7b7]">
          {TEXT.noAccount}
        </span>
        <button
          type="button"
          className="whitespace-nowrap text-center text-[1rem] font-medium leading-6 text-[#6483d3]"
          onClick={handleSignupClick}
        >
          {TEXT.signup}
        </button>
      </div>
    </main>
  );
};

export default LoginPage;
