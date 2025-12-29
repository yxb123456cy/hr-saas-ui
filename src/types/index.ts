// Login and Registration related types

// Login Form Data
export interface LoginFormData {
  // 账号;
  username?: string
  // 密码;
  password?: string
  // 是否记住密码;
  remember?: boolean
}

// Registration Form Data
export interface RegisterFormData {
  // 账号;
  username?: string
  // 密码;
  password?: string
  // 确认密码;
  confirmPassword?: string
  // 团队名称;
  teamName?: string
  // 联系方式;
  contact?: string // phone or email
  // 验证码;
  verificationCode?: string
}

// Password Reset Form Data
export interface ResetPasswordFormData {
  // 联系方式;
  contact?: string // phone or email
  // 验证码;
  verificationCode?: string
  // 新密码;
  newPassword?: string
  // 确认新密码;
  confirmNewPassword?: string
}
// LoginView视图类型;
// Enum for current view mode in Login page
export type LoginViewMode = 'login' | 'register' | 'forgot-password'
