export interface EmpInfo {
  id: number
  user_id: number
  employee_no: string
  id_card: string | null
  birth_date: string | null
  native_place: string | null
  marital_status: string | null
  emergency_contact: string | null
  emergency_phone: string | null
  entry_date: string
  probation_end_date: string | null
  formal_date: string | null
  work_status: string
  departure_date: string | null
  departure_reason: string | null
  bank_name: string | null
  bank_card: string | null
  tax_register_address: string | null
  is_deleted: number
  create_time: string
  update_time: string
}

export interface EmpEducation {
  id: number
  user_id: number
  school_name: string
  major: string
  education: string
  start_date: string
  end_date: string
  degree_certificate: string | null
  is_deleted: number
  create_time: string
  update_time: string
}

export interface EmpWork {
  id: number
  user_id: number
  company_name: string
  job_position: string
  start_date: string
  end_date: string
  work_content: string | null
  certificate: string | null
  is_deleted: number
  create_time: string
  update_time: string
}

export interface EmpContract {
  id: number
  user_id: number
  contract_no: string
  contract_type: string
  sign_date: string
  start_date: string
  end_date: string
  contract_content: string | null
  sign_status: number
  renewal_flag: number
  previous_contract_id: number | null
  expire_remind_status: number
  is_deleted: number
  create_time: string
  update_time: string
}

export interface AttendanceRule {
  id: number
  rule_name: string
  dept_id: number | null
  work_day_type: string
  morning_start: string
  morning_end: string
  afternoon_start: string
  afternoon_end: string
  late_threshold: number
  early_leave_threshold: number
  absenteeism_threshold: number
  overtime_apply_required: number
  leave_apply_required: number
  status: number
  is_deleted: number
  create_time: string
  update_time: string
}

export interface AttendanceRecord {
  id: number
  user_id: number
  attendance_date: string
  morning_check_in_time: string | null
  morning_check_out_time: string | null
  afternoon_check_in_time: string | null
  afternoon_check_out_time: string | null
  morning_status: string | null
  afternoon_status: string | null
  total_overtime: number | null
  check_in_remark: string | null
  is_deleted: number
  create_time: string
  update_time: string
}

export interface CardSupplementApply {
  id: number
  user_id: number
  attendance_date: string
  supplement_type: string
  actual_time: string
  reason: string
  approver_id: number
  approve_status: number
  approve_remark: string | null
  is_deleted: number
  create_time: string
  update_time: string
}

export interface LeaveApply {
  id: number
  user_id: number
  leave_type: string
  start_time: string
  end_time: string
  leave_days: number
  reason: string
  leave_attachment: string | null
  approver_id: number
  approve_status: number
  approve_remark: string | null
  is_deleted: number
  create_time: string
  update_time: string
}

export interface OvertimeApply {
  id: number
  user_id: number
  overtime_date: string
  start_time: string
  end_time: string
  overtime_hours: number
  overtime_type: string
  reason: string
  approver_id: number
  approve_status: number
  approve_remark: string | null
  is_deleted: number
  create_time: string
  update_time: string
}

export interface TransferSalaryApply {
  id: number
  user_id: number
  apply_type: number
  old_dept_id: number
  old_job_id: number
  old_salary: number
  new_dept_id: number | null
  new_job_id: number | null
  new_salary: number | null
  effective_date: string
  reason: string
  applicant_id: number
  approver_id: number
  approve_status: number
  approve_remark: string | null
  is_deleted: number
  create_time: string
  update_time: string
}

export interface ResignApply {
  id: number
  user_id: number
  resign_type: string
  resign_reason: string
}
