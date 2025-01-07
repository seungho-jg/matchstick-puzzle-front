import { Link, useNavigate } from "react-router-dom"
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../../validationSchemas'
import { fetchRegister } from '../../api/api-auth'
import { useForm } from "react-hook-form"


export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState : { errors }} = useForm({
    resolver: zodResolver(registerSchema)
  })

  const onSubmit = async (data) => {
    // confirm_password를 제거한 데이터를 전송
    const { confirm_password, ...formData } = data;
    try {
      const response = await fetchRegister(formData);
      alert(response.message); // 성공 메시지 표시
      navigate('/login');
    } catch (error) {
      // 에러 메시지 직접 표시
      alert(error.message || '회원가입에 실패했습니다.');
    }
  }
  return (
    <div className="flex items-center justify-center bg-gray-50">
      <div className="p-8 w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          회원가입
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
              autoComplete="username email"
              placeholder="이메일을 입력하세요"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm ml-1 text-gray-600">{errors.email?.message}</p>
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              닉네임
            </label>
            <input
              {...register('username')}
              type="text"
              id="username"
              name="username"
              placeholder="닉네임을 입력하세요"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm ml-1 text-gray-600">{errors.username?.message}</p>
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
              autoComplete="new-password"
              placeholder="비밀번호를 입력하세요"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm ml-1 text-gray-600">{errors.password?.message}</p>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              비밀번호 확인
            </label>
            <input
              {...register('confirm_password')}
              type="password"
              id="confirm_password"
              name="confirm_password"
              autoComplete="new-password"
              placeholder="비밀번호를 입력하세요"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-sm ml-1 text-gray-600">{errors.passwordCheck?.message}</p>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-red-400 text-white font-bold rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            회원가입
          </button>
        </form>
        <div className="text-sm text-gray-600 text-center">
          계정이 있으신가요? <Link to="/login" className="text-blue-500 hover:underline">로그인</Link>
        </div>
      </div>
    </div>
  )
}