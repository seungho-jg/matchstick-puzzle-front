import { z } from 'zod'

const forbidenUserNameList = [ "seungho", "tmdgh", "승호"]

const checkUserName = (username)  => {
  const result = forbidenUserNameList.some((keyword)=>
    username.includes(keyword)
  )
  return !result
}

export const registerSchema = z.object({
  username: z
    .string()
    .nonempty("닉네임을 입력해주세요.")
    .min(1)
    .max(10)
    .refine(checkUserName, "포함할 수 없는 단어가 있습니다."),
  email: z
    .string()
    .nonempty("이메일을 입력해주세요.")
    .email("유효하지 않는 이메일입니다."),
  password: z
    .string()
    .nonempty("비밀번호를 입력해주세요.")
    .min(8)
    .regex(
      /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/,
      "영문+숫자+특수문자(! @ # $ % & * ?) 조합 8~15자리를 입력해주세요."
    ),
  confirm_password: z.string().nonempty("비밀번호를 다시 입력해주세요."),
})
.refine((data) => data.password === data.confirm_password, {
  path: ["passwordCheck"],
  message: "비밀번호가 일치하지 않습니다.",
});

export const loginSchema = z.object({
  email: z.string().email('올바른 이메일 주소를 입력하세요.'),
  password: z.string().min(6, '비밀번호는 최소 6글자 이상이어야 합니다.'),
});