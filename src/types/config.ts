export interface SysDept {
  id: number
  parent_id: number
  dept_name: string
  dept_code: string
  sort: number
  leader_id: number | null
  status: number
  is_deleted: number
  create_time: string
  update_time: string
}

export interface SysJob {
  id: number
  job_name: string
  job_code: string
  dept_id: number
  job_level: string | null
  sort: number
  status: number
  is_deleted: number
  create_time: string
  update_time: string
}

export interface SysDictType {
  id: number
  dict_name: string
  dict_type: string
  status: number
  remark: string | null
  is_deleted: number
  create_time: string
  update_time: string
}

export interface SysDictData {
  id: number
  dict_type_id: number
  dict_label: string
  dict_value: string
  sort: number
  status: number
  is_deleted: number
  create_time: string
  update_time: string
}
