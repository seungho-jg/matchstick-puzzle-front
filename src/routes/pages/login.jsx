import { toast } from "react-hot-toast"
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { loginSchema } from '../../validationSchemas';
import { fetchLogin } from '../../api/api-auth';
import useAuthStore from '../../store/authStore';
import { getPuzzleCreateCount } from "../../api/api-user";
import { useEffect } from "react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const setToken = useAuthStore((state) => state.setToken);
  const setUserInfo = useAuthStore((state) => state.setUserInfo);
  const setPuzzleCreateCount = useAuthStore((state) => state.setPuzzleCreateCount);
  
  const handleLogin = async (data) => {
    try {
      const response = await fetchLogin(data);
      setToken(response.token);
      setUserInfo(response.user);
      const res = await getPuzzleCreateCount();
      setPuzzleCreateCount(res.puzzleCreateCount);
      navigate('/');
      toast.success('로그인 성공!');
    } catch (error) {
      toast.error(error.message || '로그인에 실패했습니다.');
    }
  };
  useEffect(() => {
    // URL에서 verified 파라미터 확인
    if (searchParams.get('verified') === 'true') {
      toast.success('이메일 인증이 완료되었습니다. 로그인해주세요.', {
        duration: 4000,
      });
    }
  }, []);

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="p-8 w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          로그인
        </h1>
        <form onSubmit={handleSubmit(handleLogin)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              name="email"
              autoComplete="username email"
              placeholder="이메일을 입력하세요"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm ml-1 text-gray-600">{errors.email?.message}</p>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              비밀번호
            </label>
            <input
              {...register('password')}
              type="password"
              id="password"
              name="password"
              autoComplete="current-password"
              placeholder="비밀번호를 입력하세요"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm"
            />
            <p className="text-sm ml-1 text-gray-600">{errors.password?.message}</p>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-400 text-white font-bold rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
          >
            로그인
          </button>
        </form>
        <div className="text-sm text-gray-600 text-center">
          계정이 없으신가요? <Link to="/register" className="text-blue-500 hover:underline">회원가입</Link>
        </div>
      </div>
    </div>
  );
}