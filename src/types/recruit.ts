export interface RecruitDemand {
  id: number
  demand_title: string
  dept_id: number
  job_id: number
  recruit_num: number
  salary_min: number
  salary_max: number
  education_require: string | null
  experience_require: string | null
  job_desc: string | null
  job_require: string | null
  applicant_id: number
  approver_id: number | null
  approve_status: number
  approve_remark: string | null
  is_deleted: number
  create_time: string
  update_time: string
}

export interface RecruitPosition {
  id: number
  demand_id: number
  position_name: string
  dept_name: string
  recruit_num: number
  salary_min: number
  salary_max: number
  education_require: string | null
  experience_require: string | null
  job_desc: string | null
  job_require: string | null
  publisher_id: number
  is_public: number
  status: number
  publish_time: string | null
  offline_time: string | null
  is_deleted: number
  create_time: string
  update_time: string
}

export interface JobSeekerResume {
  id: number
  user_id: number
  real_name: string
  gender: number | null
  phone: string
  email: string | null
  birth_date: string | null
  education: string | null
  major: string | null
  graduate_school: string | null
  graduate_date: string | null
  work_years: string | null
  expect_salary_min: number | null
  expect_salary_max: number | null
  expect_position: string | null
  expect_city: string | null
  self_introduction: string | null
  resume_file_url: string | null
  resume_file_name: string | null
  status: number
  is_deleted: number
  create_time: string
  update_time: string
}

export interface ResumeWorkExperience {
  id: number
  resume_id: number
  company_name: string
  job_position: string
  start_date: string
  end_date: string | null
  work_content: string | null
  is_deleted: number
  create_time: string
  update_time: string
}

export interface ResumeEducationExperience {
  id: number
  resume_id: number
  school_name: string
  major: string
  education: string
  start_date: string
  end_date: string
  is_deleted: number
  create_time: string
  update_time: string
}

export interface PositionDelivery {
  id: number
  position_id: number
  resume_id: number
  user_id: number
  delivery_time: string
  delivery_status: number
  hr_id: number | null
  remark: string | null
  is_deleted: number
  create_time: string
  update_time: string
}

export interface InterviewPlan {
  id: number
  delivery_id: number
  position_id: number
  resume_id: number
  interview_type: number
  interview_time: string
  interview_address: string | null
  interviewer_id: number
  interview_notice_status: number
  notice_content: string | null
  interview_result: number | null
  interview_remark: string | null
  interview_time_end: string | null
  is_deleted: number
  create_time: string
  update_time: string
}

export interface OfferApply {
  id: number
  delivery_id: number
  resume_id: number
  position_id: number
  dept_id: number
  applicant_id: number
  approver_id: number | null
  offer_salary: number
  probation_period: number
  entry_date: string
  offer_content: string | null
  approve_status: number
  approve_remark: string | null
  offer_status: number | null
  offer_send_time: string | null
  offer_confirm_time: string | null
  is_deleted: number
  create_time: string
  update_time: string
}
