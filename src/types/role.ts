export interface SysRole {
  id: number
  role_name: string
  role_code: string
  remark: string | null
  status: number
  is_deleted: number
  create_time: string
  update_time: string
}

export interface SysMenu {
  id: number
  parent_id: number
  menu_name: string
  menu_type: number
  path: string | null
  component: string | null
  perms: string | null
  icon: string | null
  sort: number
  status: number
  is_deleted: number
  create_time: string
  update_time: string
}

export interface SysRoleMenu {
  id: number
  role_id: number
  menu_id: number
  is_deleted: number
  create_time: string
}

export interface SysUser {
  id: number
  username: string
  password: string
  real_name: string
  gender: number | null
  phone: string | null
  email: string | null
  dept_id: number | null
  job_id: number | null
  avatar: string | null
  user_type: number
  status: number
  last_login_time: string | null
  last_login_ip: string | null
  is_deleted: number
  create_time: string
  update_time: string
}

export interface SysUserRole {
  id: number
  user_id: number
  role_id: number
  is_deleted: number
  create_time: string
}
