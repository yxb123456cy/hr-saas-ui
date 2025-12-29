# HR SAAS系统MySQL DDL脚本（含索引与注释）

说明：1. 脚本基于MySQL 8.0+编写，采用InnoDB引擎，字符集utf8mb4；2. 包含主键、外键、业务索引，确保查询效率；3. 字段注释详细说明用途，支持业务理解；4. 采用逻辑删除字段（is_deleted），避免物理删除数据。

## 一、基础配置表

### 1.1 部门表（sys_dept）

```sql

CREATE TABLE `sys_dept` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '部门ID',
  `parent_id` bigint NOT NULL DEFAULT 0 COMMENT '父部门ID（0为顶级部门）',
  `dept_name` varchar(64) NOT NULL COMMENT '部门名称',
  `dept_code` varchar(32) NOT NULL COMMENT '部门编码（唯一）',
  `sort` int NOT NULL DEFAULT 0 COMMENT '排序（数字越小越靠前）',
  `leader_id` bigint DEFAULT NULL COMMENT '部门负责人ID（关联sys_user.id）',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态（0-禁用，1-正常）',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_dept_code` (`dept_code`) COMMENT '部门编码唯一索引',
  KEY `idx_parent_id` (`parent_id`) COMMENT '父部门ID索引，用于查询子部门',
  KEY `idx_leader_id` (`leader_id`) COMMENT '部门负责人索引，用于关联查询'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统部门表';
```

### 1.2 职位表（sys_job）

```sql

CREATE TABLE `sys_job` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '职位ID',
  `job_name` varchar(64) NOT NULL COMMENT '职位名称',
  `job_code` varchar(32) NOT NULL COMMENT '职位编码（唯一）',
  `dept_id` bigint NOT NULL COMMENT '所属部门ID（关联sys_dept.id）',
  `job_level` varchar(32) DEFAULT NULL COMMENT '职位级别（如：P1-P10、管理岗/技术岗）',
  `sort` int NOT NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态（0-禁用，1-正常）',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_job_code` (`job_code`) COMMENT '职位编码唯一索引',
  KEY `idx_dept_id` (`dept_id`) COMMENT '部门ID索引，用于查询部门下职位'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统职位表';
```

### 1.3 字典类型表（sys_dict_type）

```sql

CREATE TABLE `sys_dict_type` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '字典类型ID',
  `dict_name` varchar(64) NOT NULL COMMENT '字典名称（如：学历、性别、请假类型）',
  `dict_type` varchar(64) NOT NULL COMMENT '字典类型编码（唯一，如：education、gender、leave_type）',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态（0-禁用，1-正常）',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_dict_type` (`dict_type`) COMMENT '字典类型编码唯一索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统字典类型表';
```

### 1.4 字典数据表（sys_dict_data）

```sql

CREATE TABLE `sys_dict_data` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '字典数据ID',
  `dict_type_id` bigint NOT NULL COMMENT '字典类型ID（关联sys_dict_type.id）',
  `dict_label` varchar(64) NOT NULL COMMENT '字典标签（显示文本）',
  `dict_value` varchar(64) NOT NULL COMMENT '字典值（存储值）',
  `sort` int NOT NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态（0-禁用，1-正常）',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_dict_type_value` (`dict_type_id`,`dict_value`) COMMENT '同一字典类型下值唯一',
  KEY `idx_dict_type_id` (`dict_type_id`) COMMENT '字典类型ID索引，用于查询字典数据'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统字典数据表';
```

## 二、权限与用户表

### 2.1 角色表（sys_role）

```sql

CREATE TABLE `sys_role` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '角色ID',
  `role_name` varchar(64) NOT NULL COMMENT '角色名称（如：HR总管、普通HR、普通员工、求职者）',
  `role_code` varchar(64) NOT NULL COMMENT '角色编码（唯一，如：hr_admin、hr_normal、employee、job_seeker）',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态（0-禁用，1-正常）',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_code` (`role_code`) COMMENT '角色编码唯一索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统角色表';
```

### 2.2 菜单表（sys_menu）

```sql

CREATE TABLE `sys_menu` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '菜单ID',
  `parent_id` bigint NOT NULL DEFAULT 0 COMMENT '父菜单ID（0为顶级菜单）',
  `menu_name` varchar(64) NOT NULL COMMENT '菜单名称',
  `menu_type` tinyint NOT NULL COMMENT '菜单类型（1-目录，2-菜单，3-按钮）',
  `path` varchar(255) DEFAULT NULL COMMENT '路由路径（前端）',
  `component` varchar(255) DEFAULT NULL COMMENT '前端组件路径',
  `perms` varchar(128) DEFAULT NULL COMMENT '权限标识（如：sys:user:list，用于接口权限控制）',
  `icon` varchar(64) DEFAULT NULL COMMENT '菜单图标',
  `sort` int NOT NULL DEFAULT 0 COMMENT '排序',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态（0-禁用，1-正常）',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_menu_perms` (`perms`) COMMENT '权限标识唯一索引（按钮级别）',
  KEY `idx_parent_id` (`parent_id`) COMMENT '父菜单ID索引，用于查询子菜单'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统菜单表（权限载体）';
```

### 2.3 角色菜单关联表（sys_role_menu）

```sql

CREATE TABLE `sys_role_menu` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '关联ID',
  `role_id` bigint NOT NULL COMMENT '角色ID（关联sys_role.id）',
  `menu_id` bigint NOT NULL COMMENT '菜单ID（关联sys_menu.id）',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_role_menu` (`role_id`,`menu_id`) COMMENT '同一角色-菜单组合唯一',
  KEY `idx_role_id` (`role_id`) COMMENT '角色ID索引',
  KEY `idx_menu_id` (`menu_id`) COMMENT '菜单ID索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='角色菜单关联表（权限分配）';
```

### 2.4 用户表（sys_user）

```sql

CREATE TABLE `sys_user` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` varchar(64) NOT NULL COMMENT '用户名（唯一）',
  `password` varchar(128) NOT NULL COMMENT '密码（加密存储，如BCrypt）',
  `real_name` varchar(64) NOT NULL COMMENT '真实姓名',
  `gender` tinyint DEFAULT NULL COMMENT '性别（0-女，1-男，2-未知）',
  `phone` varchar(20) DEFAULT NULL COMMENT '手机号',
  `email` varchar(64) DEFAULT NULL COMMENT '邮箱',
  `dept_id` bigint DEFAULT NULL COMMENT '所属部门ID（关联sys_dept.id，求职者可为空）',
  `job_id` bigint DEFAULT NULL COMMENT '职位ID（关联sys_job.id，求职者可为空）',
  `avatar` varchar(255) DEFAULT NULL COMMENT '头像URL（关联minio文件）',
  `user_type` tinyint NOT NULL COMMENT '用户类型（1-内部员工，2-求职者）',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态（0-禁用，1-正常）',
  `last_login_time` datetime DEFAULT NULL COMMENT '最后登录时间',
  `last_login_ip` varchar(64) DEFAULT NULL COMMENT '最后登录IP',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`) COMMENT '用户名唯一索引',
  UNIQUE KEY `uk_phone` (`phone`) COMMENT '手机号唯一索引',
  UNIQUE KEY `uk_email` (`email`) COMMENT '邮箱唯一索引',
  KEY `idx_dept_id` (`dept_id`) COMMENT '部门ID索引',
  KEY `idx_job_id` (`job_id`) COMMENT '职位ID索引',
  KEY `idx_user_type` (`user_type`) COMMENT '用户类型索引，用于区分员工和求职者'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统用户表（含员工和求职者）';
```

### 2.5 用户角色关联表（sys_user_role）

```sql

CREATE TABLE `sys_user_role` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '关联ID',
  `user_id` bigint NOT NULL COMMENT '用户ID（关联sys_user.id）',
  `role_id` bigint NOT NULL COMMENT '角色ID（关联sys_role.id）',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_role` (`user_id`,`role_id`) COMMENT '同一用户-角色组合唯一',
  KEY `idx_user_id` (`user_id`) COMMENT '用户ID索引',
  KEY `idx_role_id` (`role_id`) COMMENT '角色ID索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户角色关联表';
```

## 三、招聘管理表

### 3.1 招聘需求表（recruit_demand）

```sql

CREATE TABLE `recruit_demand` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '招聘需求ID',
  `demand_title` varchar(128) NOT NULL COMMENT '需求标题（如：2024年技术部Java开发工程师招聘需求）',
  `dept_id` bigint NOT NULL COMMENT '需求部门ID（关联sys_dept.id）',
  `job_id` bigint NOT NULL COMMENT '招聘职位ID（关联sys_job.id）',
  `recruit_num` int NOT NULL COMMENT '招聘人数',
  `salary_min` decimal(10,2) NOT NULL COMMENT '最低薪资（元/月）',
  `salary_max` decimal(10,2) NOT NULL COMMENT '最高薪资（元/月）',
  `education_require` varchar(32) DEFAULT NULL COMMENT '学历要求（关联sys_dict_data.dict_value）',
  `experience_require` varchar(32) DEFAULT NULL COMMENT '经验要求（关联sys_dict_data.dict_value）',
  `job_desc` text COMMENT '岗位职责',
  `job_require` text COMMENT '任职要求',
  `applicant_id` bigint NOT NULL COMMENT '申请人ID（关联sys_user.id，普通HR）',
  `approver_id` bigint DEFAULT NULL COMMENT '审批人ID（关联sys_user.id，HR总管）',
  `approve_status` tinyint NOT NULL DEFAULT 0 COMMENT '审批状态（0-待审批，1-审批通过，2-审批驳回）',
  `approve_remark` varchar(255) DEFAULT NULL COMMENT '审批备注',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_dept_id` (`dept_id`) COMMENT '部门ID索引',
  KEY `idx_job_id` (`job_id`) COMMENT '职位ID索引',
  KEY `idx_applicant_id` (`applicant_id`) COMMENT '申请人ID索引',
  KEY `idx_approve_status` (`approve_status`) COMMENT '审批状态索引，用于筛选需求'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='招聘需求表';
```

### 3.2 招聘职位发布表（recruit_position）

```sql

CREATE TABLE `recruit_position` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '职位发布ID',
  `demand_id` bigint NOT NULL COMMENT '关联招聘需求ID（关联recruit_demand.id）',
  `position_name` varchar(64) NOT NULL COMMENT '职位名称',
  `dept_name` varchar(64) NOT NULL COMMENT '所属部门名称（冗余，便于展示）',
  `recruit_num` int NOT NULL COMMENT '招聘人数',
  `salary_min` decimal(10,2) NOT NULL COMMENT '最低薪资（元/月）',
  `salary_max` decimal(10,2) NOT NULL COMMENT '最高薪资（元/月）',
  `education_require` varchar(32) DEFAULT NULL COMMENT '学历要求',
  `experience_require` varchar(32) DEFAULT NULL COMMENT '经验要求',
  `job_desc` text COMMENT '岗位职责',
  `job_require` text COMMENT '任职要求',
  `publisher_id` bigint NOT NULL COMMENT '发布人ID（关联sys_user.id）',
  `is_public` tinyint NOT NULL DEFAULT 1 COMMENT '是否公开（0-不公开，1-公开）',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '发布状态（0-草稿，1-已发布，2-已下架）',
  `publish_time` datetime DEFAULT NULL COMMENT '发布时间',
  `offline_time` datetime DEFAULT NULL COMMENT '下架时间',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_demand_id` (`demand_id`) COMMENT '招聘需求ID索引',
  KEY `idx_publisher_id` (`publisher_id`) COMMENT '发布人ID索引',
  KEY `idx_status` (`status`) COMMENT '发布状态索引，用于筛选职位',
  KEY `idx_is_public` (`is_public`) COMMENT '是否公开索引，用于求职者浏览'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='招聘职位发布表';
```

### 3.3 求职者简历表（job_seeker_resume）

```sql

CREATE TABLE `job_seeker_resume` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '简历ID',
  `user_id` bigint NOT NULL COMMENT '求职者ID（关联sys_user.id）',
  `real_name` varchar(64) NOT NULL COMMENT '真实姓名',
  `gender` tinyint DEFAULT NULL COMMENT '性别（0-女，1-男，2-未知）',
  `phone` varchar(20) NOT NULL COMMENT '手机号',
  `email` varchar(64) DEFAULT NULL COMMENT '邮箱',
  `birth_date` date DEFAULT NULL COMMENT '出生日期',
  `education` varchar(32) DEFAULT NULL COMMENT '学历（关联sys_dict_data.dict_value）',
  `major` varchar(64) DEFAULT NULL COMMENT '专业',
  `graduate_school` varchar(128) DEFAULT NULL COMMENT '毕业院校',
  `graduate_date` date DEFAULT NULL COMMENT '毕业时间',
  `work_years` varchar(32) DEFAULT NULL COMMENT '工作年限（关联sys_dict_data.dict_value）',
  `expect_salary_min` decimal(10,2) DEFAULT NULL COMMENT '期望最低薪资',
  `expect_salary_max` decimal(10,2) DEFAULT NULL COMMENT '期望最高薪资',
  `expect_position` varchar(64) DEFAULT NULL COMMENT '期望职位',
  `expect_city` varchar(64) DEFAULT NULL COMMENT '期望工作城市',
  `self_introduction` text COMMENT '自我评价',
  `resume_file_url` varchar(255) DEFAULT NULL COMMENT '简历文件URL（关联minio）',
  `resume_file_name` varchar(128) DEFAULT NULL COMMENT '简历文件名',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '简历状态（0-未完善，1-已完善）',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`) COMMENT '一个求职者对应一份主简历',
  KEY `idx_education` (`education`) COMMENT '学历索引，用于筛选',
  KEY `idx_work_years` (`work_years`) COMMENT '工作年限索引，用于筛选'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='求职者简历表';
```

### 3.4 简历工作经历表（resume_work_experience）

```sql

CREATE TABLE `resume_work_experience` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '工作经历ID',
  `resume_id` bigint NOT NULL COMMENT '关联简历ID（关联job_seeker_resume.id）',
  `company_name` varchar(128) NOT NULL COMMENT '公司名称',
  `job_position` varchar(64) NOT NULL COMMENT '工作职位',
  `start_date` date NOT NULL COMMENT '开始时间',
  `end_date` date DEFAULT NULL COMMENT '结束时间（null表示当前在职）',
  `work_content` text COMMENT '工作内容',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_resume_id` (`resume_id`) COMMENT '简历ID索引，用于查询简历关联的工作经历'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='简历工作经历表';
```

### 3.5 简历教育经历表（resume_education_experience）

```sql

CREATE TABLE `resume_education_experience` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '教育经历ID',
  `resume_id` bigint NOT NULL COMMENT '关联简历ID（关联job_seeker_resume.id）',
  `school_name` varchar(128) NOT NULL COMMENT '学校名称',
  `major` varchar(64) NOT NULL COMMENT '专业',
  `education` varchar(32) NOT NULL COMMENT '学历（关联sys_dict_data.dict_value）',
  `start_date` date NOT NULL COMMENT '开始时间',
  `end_date` date NOT NULL COMMENT '结束时间',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_resume_id` (`resume_id`) COMMENT '简历ID索引，用于查询简历关联的教育经历'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='简历教育经历表';
```

### 3.6 职位投递表（position_delivery）

```sql

CREATE TABLE `position_delivery` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '投递ID',
  `position_id` bigint NOT NULL COMMENT '招聘职位ID（关联recruit_position.id）',
  `resume_id` bigint NOT NULL COMMENT '简历ID（关联job_seeker_resume.id）',
  `user_id` bigint NOT NULL COMMENT '求职者ID（关联sys_user.id）',
  `delivery_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '投递时间',
  `delivery_status` tinyint NOT NULL DEFAULT 0 COMMENT '投递状态（0-已投递，1-初筛通过，2-初筛淘汰，3-面试中，4-面试通过，5-面试淘汰，6-已录用，7-拒绝录用）',
  `hr_id` bigint DEFAULT NULL COMMENT '负责HR ID（关联sys_user.id）',
  `remark` varchar(255) DEFAULT NULL COMMENT '备注（HR填写）',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_position_resume` (`position_id`,`resume_id`) COMMENT '同一职位-简历只能投递一次',
  KEY `idx_position_id` (`position_id`) COMMENT '职位ID索引，用于HR查看投递列表',
  KEY `idx_user_id` (`user_id`) COMMENT '求职者ID索引，用于查看自己的投递记录',
  KEY `idx_delivery_status` (`delivery_status`) COMMENT '投递状态索引，用于筛选'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='职位投递表';
```

### 3.7 面试计划表（interview_plan）

```sql

CREATE TABLE `interview_plan` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '面试计划ID',
  `delivery_id` bigint NOT NULL COMMENT '关联投递ID（关联position_delivery.id）',
  `position_id` bigint NOT NULL COMMENT '招聘职位ID（关联recruit_position.id）',
  `resume_id` bigint NOT NULL COMMENT '简历ID（关联job_seeker_resume.id）',
  `interview_type` tinyint NOT NULL COMMENT '面试类型（1-一面，2-二面，3-终面）',
  `interview_time` datetime NOT NULL COMMENT '面试时间',
  `interview_address` varchar(255) DEFAULT NULL COMMENT '面试地址（线下）/面试链接（线上）',
  `interviewer_id` bigint NOT NULL COMMENT '面试官ID（关联sys_user.id）',
  `interview_notice_status` tinyint NOT NULL DEFAULT 0 COMMENT '通知状态（0-未通知，1-已通知，2-已读）',
  `notice_content` text DEFAULT NULL COMMENT '通知内容',
  `interview_result` tinyint DEFAULT NULL COMMENT '面试结果（1-通过，2-淘汰）',
  `interview_remark` text DEFAULT NULL COMMENT '面试评价',
  `interview_time_end` datetime DEFAULT NULL COMMENT '面试结束时间',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_delivery_id` (`delivery_id`) COMMENT '投递ID索引',
  KEY `idx_interviewer_id` (`interviewer_id`) COMMENT '面试官ID索引',
  KEY `idx_interview_time` (`interview_time`) COMMENT '面试时间索引，用于日程提醒',
  KEY `idx_interview_result` (`interview_result`) COMMENT '面试结果索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='面试计划表';
```

### 3.8 录用申请表（offer_apply）

```sql

CREATE TABLE `offer_apply` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '录用申请ID',
  `delivery_id` bigint NOT NULL COMMENT '关联投递ID（关联position_delivery.id）',
  `resume_id` bigint NOT NULL COMMENT '简历ID（关联job_seeker_resume.id）',
  `position_id` bigint NOT NULL COMMENT '职位ID（关联sys_job.id）',
  `dept_id` bigint NOT NULL COMMENT '部门ID（关联sys_dept.id）',
  `applicant_id` bigint NOT NULL COMMENT '申请人ID（关联sys_user.id，普通HR）',
  `approver_id` bigint DEFAULT NULL COMMENT '审批人ID（关联sys_user.id，HR总管）',
  `offer_salary` decimal(10,2) NOT NULL COMMENT '录用薪资',
  `probation_period` int NOT NULL COMMENT '试用期（月）',
  `entry_date` date NOT NULL COMMENT '预计入职日期',
  `offer_content` text COMMENT 'offer内容（模板化）',
  `approve_status` tinyint NOT NULL DEFAULT 0 COMMENT '审批状态（0-待审批，1-审批通过，2-审批驳回）',
  `approve_remark` varchar(255) DEFAULT NULL COMMENT '审批备注',
  `offer_status` tinyint DEFAULT 0 COMMENT 'offer状态（0-未发放，1-已发放，2-已接受，3-已拒绝）',
  `offer_send_time` datetime DEFAULT NULL COMMENT 'offer发放时间',
  `offer_confirm_time` datetime DEFAULT NULL COMMENT 'offer确认时间',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_delivery_id` (`delivery_id`) COMMENT '投递ID索引',
  KEY `idx_applicant_id` (`applicant_id`) COMMENT '申请人ID索引',
  KEY `idx_approve_status` (`approve_status`) COMMENT '审批状态索引',
  KEY `idx_offer_status` (`offer_status`) COMMENT 'offer状态索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='录用申请表';
```

## 四、内部人事管理表

### 4.1 员工信息表（emp_info）

```sql

CREATE TABLE `emp_info` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '员工信息ID',
  `user_id` bigint NOT NULL COMMENT '员工ID（关联sys_user.id）',
  `employee_no` varchar(32) NOT NULL COMMENT '员工编号（唯一）',
  `id_card` varchar(18) DEFAULT NULL COMMENT '身份证号',
  `birth_date` date DEFAULT NULL COMMENT '出生日期',
  `native_place` varchar(64) DEFAULT NULL COMMENT '籍贯',
  `marital_status` varchar(32) DEFAULT NULL COMMENT '婚姻状况（关联sys_dict_data.dict_value）',
  `emergency_contact` varchar(64) DEFAULT NULL COMMENT '紧急联系人',
  `emergency_phone` varchar(20) DEFAULT NULL COMMENT '紧急联系人电话',
  `entry_date` date NOT NULL COMMENT '入职日期',
  `probation_end_date` date DEFAULT NULL COMMENT '试用期结束日期',
  `formal_date` date DEFAULT NULL COMMENT '转正日期',
  `work_status` varchar(32) NOT NULL COMMENT '工作状态（1-试用，2-正式，3-调岗，4-离职）',
  `departure_date` date DEFAULT NULL COMMENT '离职日期',
  `departure_reason` varchar(255) DEFAULT NULL COMMENT '离职原因',
  `bank_name` varchar(64) DEFAULT NULL COMMENT '开户银行',
  `bank_card` varchar(32) DEFAULT NULL COMMENT '银行卡号',
  `tax_register_address` varchar(255) DEFAULT NULL COMMENT '个税登记地址',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_id` (`user_id`) COMMENT '一个员工对应一条信息',
  UNIQUE KEY `uk_employee_no` (`employee_no`) COMMENT '员工编号唯一索引',
  UNIQUE KEY `uk_id_card` (`id_card`) COMMENT '身份证号唯一索引',
  KEY `idx_entry_date` (`entry_date`) COMMENT '入职日期索引，用于工龄统计',
  KEY `idx_work_status` (`work_status`) COMMENT '工作状态索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='员工详细信息表';
```

### 4.2 员工教育经历表（emp_education）

```sql

CREATE TABLE `emp_education` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '教育经历ID',
  `user_id` bigint NOT NULL COMMENT '员工ID（关联sys_user.id）',
  `school_name` varchar(128) NOT NULL COMMENT '学校名称',
  `major` varchar(64) NOT NULL COMMENT '专业',
  `education` varchar(32) NOT NULL COMMENT '学历（关联sys_dict_data.dict_value）',
  `start_date` date NOT NULL COMMENT '开始时间',
  `end_date` date NOT NULL COMMENT '结束时间',
  `degree_certificate` varchar(255) DEFAULT NULL COMMENT '学位证书URL（minio）',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`) COMMENT '员工ID索引，用于查询员工教育经历'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='员工教育经历表';
```

### 4.3 员工工作经历表（emp_work）

```sql

CREATE TABLE `emp_work` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '工作经历ID',
  `user_id` bigint NOT NULL COMMENT '员工ID（关联sys_user.id）',
  `company_name` varchar(128) NOT NULL COMMENT '公司名称',
  `job_position` varchar(64) NOT NULL COMMENT '工作职位',
  `start_date` date NOT NULL COMMENT '开始时间',
  `end_date` date NOT NULL COMMENT '结束时间',
  `work_content` text COMMENT '工作内容',
  `certificate` varchar(255) DEFAULT NULL COMMENT '工作证明URL（minio）',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`) COMMENT '员工ID索引，用于查询员工工作经历'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='员工工作经历表';
```

### 4.4 劳动合同表（emp_contract）

```sql

CREATE TABLE `emp_contract` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '合同ID',
  `user_id` bigint NOT NULL COMMENT '员工ID（关联sys_user.id）',
  `contract_no` varchar(64) NOT NULL COMMENT '合同编号（唯一）',
  `contract_type` varchar(32) NOT NULL COMMENT '合同类型（1-劳动合同，2-劳务合同，3-实习合同）',
  `sign_date` date NOT NULL COMMENT '签订日期',
  `start_date` date NOT NULL COMMENT '合同开始日期',
  `end_date` date NOT NULL COMMENT '合同结束日期',
  `contract_content` varchar(255) DEFAULT NULL COMMENT '合同文件URL（minio）',
  `sign_status` tinyint NOT NULL DEFAULT 1 COMMENT '签订状态（1-已签订，2-未签订）',
  `renewal_flag` tinyint NOT NULL DEFAULT 0 COMMENT '是否续签（0-否，1-是）',
  `previous_contract_id` bigint DEFAULT NULL COMMENT '上一份合同ID（续签时关联）',
  `expire_remind_status` tinyint NOT NULL DEFAULT 0 COMMENT '到期提醒状态（0-未提醒，1-已提醒）',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_contract_no` (`contract_no`) COMMENT '合同编号唯一索引',
  KEY `idx_user_id` (`user_id`) COMMENT '员工ID索引，用于查询员工合同',
  KEY `idx_end_date` (`end_date`) COMMENT '合同结束日期索引，用于到期提醒',
  KEY `idx_previous_contract_id` (`previous_contract_id`) COMMENT '上一份合同ID索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='劳动合同表';
```

### 4.5 考勤规则表（attendance_rule）

```sql

CREATE TABLE `attendance_rule` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '规则ID',
  `rule_name` varchar(64) NOT NULL COMMENT '规则名称（如：标准工时规则）',
  `dept_id` bigint DEFAULT NULL COMMENT '适用部门ID（null表示全公司）',
  `work_day_type` varchar(32) NOT NULL COMMENT '工作日类型（1-双休，2-单休，3-大小周）',
  `morning_start` time NOT NULL COMMENT '上午上班时间',
  `morning_end` time NOT NULL COMMENT '上午下班时间',
  `afternoon_start` time NOT NULL COMMENT '下午上班时间',
  `afternoon_end` time NOT NULL COMMENT '下午下班时间',
  `late_threshold` int NOT NULL DEFAULT 10 COMMENT '迟到阈值（分钟，超过此时间算迟到）',
  `early_leave_threshold` int NOT NULL DEFAULT 10 COMMENT '早退阈值（分钟，提前此时间算早退）',
  `absenteeism_threshold` int NOT NULL DEFAULT 30 COMMENT '旷工阈值（分钟，迟到/早退超过此时间算旷工）',
  `overtime_apply_required` tinyint NOT NULL DEFAULT 1 COMMENT '加班需申请（0-不需要，1-需要）',
  `leave_apply_required` tinyint NOT NULL DEFAULT 1 COMMENT '请假需申请（0-不需要，1-需要）',
  `status` tinyint NOT NULL DEFAULT 1 COMMENT '状态（0-禁用，1-启用）',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_dept_id` (`dept_id`) COMMENT '适用部门ID索引',
  KEY `idx_status` (`status`) COMMENT '状态索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='考勤规则表';
```

### 4.6 考勤记录表（attendance_record）

```sql

CREATE TABLE `attendance_record` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '记录ID',
  `user_id` bigint NOT NULL COMMENT '员工ID（关联sys_user.id）',
  `attendance_date` date NOT NULL COMMENT '考勤日期',
  `morning_check_in_time` datetime DEFAULT NULL COMMENT '上午上班打卡时间',
  `morning_check_out_time` datetime DEFAULT NULL COMMENT '上午下班打卡时间',
  `afternoon_check_in_time` datetime DEFAULT NULL COMMENT '下午上班打卡时间',
  `afternoon_check_out_time` datetime DEFAULT NULL COMMENT '下午下班打卡时间',
  `morning_status` varchar(32) DEFAULT NULL COMMENT '上午考勤状态（1-正常，2-迟到，3-早退，4-旷工，5-请假，6-出差）',
  `afternoon_status` varchar(32) DEFAULT NULL COMMENT '下午考勤状态',
  `total_overtime` decimal(5,2) DEFAULT 0 COMMENT '当日加班时长（小时）',
  `check_in_remark` varchar(255) DEFAULT NULL COMMENT '打卡备注',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_date` (`user_id`,`attendance_date`) COMMENT '同一员工同一日期唯一记录',
  KEY `idx_user_id` (`user_id`) COMMENT '员工ID索引',
  KEY `idx_attendance_date` (`attendance_date`) COMMENT '考勤日期索引，用于统计',
  KEY `idx_morning_status` (`morning_status`) COMMENT '上午考勤状态索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='考勤记录表';
```

### 4.7 补卡申请表（card_supplement_apply）

```sql

CREATE TABLE `card_supplement_apply` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '补卡申请ID',
  `user_id` bigint NOT NULL COMMENT '申请人ID（关联sys_user.id）',
  `attendance_date` date NOT NULL COMMENT '需补卡日期',
  `supplement_type` varchar(32) NOT NULL COMMENT '补卡类型（1-上午上班，2-上午下班，3-下午上班，4-下午下班）',
  `actual_time` datetime NOT NULL COMMENT '实际打卡时间（补卡填写）',
  `reason` varchar(255) NOT NULL COMMENT '补卡原因',
  `approver_id` bigint NOT NULL COMMENT '审批人ID（关联sys_user.id，部门负责人/HR）',
  `approve_status` tinyint NOT NULL DEFAULT 0 COMMENT '审批状态（0-待审批，1-审批通过，2-审批驳回）',
  `approve_remark` varchar(255) DEFAULT NULL COMMENT '审批备注',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`) COMMENT '申请人ID索引',
  KEY `idx_attendance_date` (`attendance_date`) COMMENT '补卡日期索引',
  KEY `idx_approve_status` (`approve_status`) COMMENT '审批状态索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='补卡申请表';
```

### 4.8 请假申请表（leave_apply）

```sql

CREATE TABLE `leave_apply` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '请假申请ID',
  `user_id` bigint NOT NULL COMMENT '申请人ID（关联sys_user.id）',
  `leave_type` varchar(32) NOT NULL COMMENT '请假类型（关联sys_dict_data.dict_value，如：事假、病假、年假）',
  `start_time` datetime NOT NULL COMMENT '请假开始时间',
  `end_time` datetime NOT NULL COMMENT '请假结束时间',
  `leave_days` decimal(5,2) NOT NULL COMMENT '请假天数',
  `reason` varchar(255) NOT NULL COMMENT '请假原因',
  `leave_attachment` varchar(255) DEFAULT NULL COMMENT '请假附件URL（minio，如病假证明）',
  `approver_id` bigint NOT NULL COMMENT '审批人ID（关联sys_user.id）',
  `approve_status` tinyint NOT NULL DEFAULT 0 COMMENT '审批状态（0-待审批，1-审批通过，2-审批驳回）',
  `approve_remark` varchar(255) DEFAULT NULL COMMENT '审批备注',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`) COMMENT '申请人ID索引',
  KEY `idx_leave_type` (`leave_type`) COMMENT '请假类型索引',
  KEY `idx_approve_status` (`approve_status`) COMMENT '审批状态索引',
  KEY `idx_start_time` (`start_time`) COMMENT '请假开始时间索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='请假申请表';
```

### 4.9 加班申请表（overtime_apply）

```sql

CREATE TABLE `overtime_apply` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '加班申请ID',
  `user_id` bigint NOT NULL COMMENT '申请人ID（关联sys_user.id）',
  `overtime_date` date NOT NULL COMMENT '加班日期',
  `start_time` datetime NOT NULL COMMENT '加班开始时间',
  `end_time` datetime NOT NULL COMMENT '加班结束时间',
  `overtime_hours` decimal(5,2) NOT NULL COMMENT '加班时长（小时）',
  `overtime_type` varchar(32) NOT NULL COMMENT '加班类型（1-工作日加班，2-周末加班，3-节假日加班）',
  `reason` varchar(255) NOT NULL COMMENT '加班原因',
  `approver_id` bigint NOT NULL COMMENT '审批人ID（关联sys_user.id）',
  `approve_status` tinyint NOT NULL DEFAULT 0 COMMENT '审批状态（0-待审批，1-审批通过，2-审批驳回）',
  `approve_remark` varchar(255) DEFAULT NULL COMMENT '审批备注',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`) COMMENT '申请人ID索引',
  KEY `idx_overtime_date` (`overtime_date`) COMMENT '加班日期索引',
  KEY `idx_approve_status` (`approve_status`) COMMENT '审批状态索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='加班申请表';
```

### 4.10 调岗调薪申请表（transfer_salary_apply）

```sql

CREATE TABLE `transfer_salary_apply` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '申请ID',
  `user_id` bigint NOT NULL COMMENT '员工ID（关联sys_user.id）',
  `apply_type` tinyint NOT NULL COMMENT '申请类型（1-仅调岗，2-仅调薪，3-调岗+调薪）',
  `old_dept_id` bigint NOT NULL COMMENT '原部门ID（关联sys_dept.id）',
  `old_job_id` bigint NOT NULL COMMENT '原职位ID（关联sys_job.id）',
  `old_salary` decimal(10,2) NOT NULL COMMENT '原薪资',
  `new_dept_id` bigint DEFAULT NULL COMMENT '新部门ID（调岗时必填）',
  `new_job_id` bigint DEFAULT NULL COMMENT '新职位ID（调岗时必填）',
  `new_salary` decimal(10,2) DEFAULT NULL COMMENT '新薪资（调薪时必填）',
  `effective_date` date NOT NULL COMMENT '生效日期',
  `reason` varchar(255) NOT NULL COMMENT '申请原因',
  `applicant_id` bigint NOT NULL COMMENT '申请人ID（HR或员工本人）',
  `approver_id` bigint NOT NULL COMMENT '审批人ID（HR总管/部门负责人）',
  `approve_status` tinyint NOT NULL DEFAULT 0 COMMENT '审批状态（0-待审批，1-审批通过，2-审批驳回）',
  `approve_remark` varchar(255) DEFAULT NULL COMMENT '审批备注',
  `is_deleted` tinyint NOT NULL DEFAULT 0 COMMENT '逻辑删除（0-未删除，1-已删除）',
  `create_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`) COMMENT '员工ID索引',
  KEY `idx_apply_type` (`apply_type`) COMMENT '申请类型索引',
  KEY `idx_approve_status` (`approve_status`) COMMENT '审批状态索引'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='调岗调薪申请表';
```

### 4.11 离职申请表（resign_apply）

```sql

CREATE TABLE `resign_apply` (
  `id` bigint NOT NULL AUTO_INCREMENT COMMENT '离职申请ID',
  `user_id` bigint NOT NULL COMMENT '员工ID（关联sys_user.id）',
  `resign_type` varchar(32) NOT NULL COMMENT '离职类型（1-主动离职，2-被动离职）',
  `resign_reason` varchar(255) NOT NULL COMMENT '离职原因',
  `pro
```
> （注：文档部分内容可能由 AI 生成）