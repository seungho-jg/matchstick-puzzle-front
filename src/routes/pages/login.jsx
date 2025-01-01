import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { loginSchema } from '../../validationSchemas';
import { fetchLogin } from '../../api/api-auth';
import useAuthStore from '../../store/authStore'; // zustand로 상태 관리

export default function LoginPage() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const setToken = useAuthStore((state) => state.setToken) // zustand의 setToken 사용

  const onSubmit = async (data) => {
    try {
      const response = await fetchLogin(data)
      setToken(response.token)
      console.log('로그인 성공!!')
      navigate('/');
    } catch (error) {
      console.error('Login error:', error); // 에러 상세 확인
      alert(error.response?.data?.message || '로그인에 실패했습니다.');
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="p-8 w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          로그인
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              이메일
            </label>
            <input
              {...register('email')}
              type="email"
              id="email"
              name="email"
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