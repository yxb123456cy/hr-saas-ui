## HR SAAS UI

企业内部人事管理与自主招聘的一体化前端项目，覆盖「HR 总管 / 普通 HR / 普通员工 / 求职者」多角色场景，支持基于角色/权限的菜单与功能呈现，面向前后端分离的 HR SAAS 系统。

### 功能范围（规划）

- 招聘管理：招聘需求、职位发布、简历管理、面试管理、录用与 Offer 流程
- 内部人事：员工档案、入职/转正、合同、考勤、请假/加班/出差、调岗调薪、离职
- 数据统计：招聘与人事关键指标看板与报表导出
- 文档管理：简历/合同/资料的上传、预览、下载（通常由后端对接 Minio 等对象存储）

规划与界面清单见 [HR SAAS系统需求规划与界面清单.md](./docs/HR%20SAAS%E7%B3%BB%E7%BB%9F%E9%9C%80%E6%B1%82%E8%A7%84%E5%88%92%E4%B8%8E%E7%95%8C%E9%9D%A2%E6%B8%85%E5%8D%95.md)。

### 技术栈

- Vue 3 + TypeScript
- Vite
- Pinia / Vue Router / Vue I18n
- TDesign Vue Next（组件库）+ ECharts（可视化）
- Vitest（单元测试）+ Playwright（E2E）

### 开发环境

- Node.js：`^20.19.0 || >=22.12.0`
- 包管理器：pnpm（仓库内包含 `pnpm-lock.yaml`）

### 快速开始

```bash
pnpm install
pnpm web:dev
```

浏览器打开：`http://localhost:5173/`

### 常用脚本

```bash
pnpm web:dev          # 启动开发环境
pnpm web:dev:test     # 启动 testing 环境
pnpm web:dev:prod     # 以 prod 模式本地启动（仍为 dev server）

pnpm web:build:dev    # dev 模式构建（含类型检查）
pnpm web:build:test   # testing 模式构建（含类型检查）
pnpm web:build:prod   # prod 模式构建（含类型检查）
pnpm web:preview      # 预览 prod 构建产物

pnpm type-check       # vue-tsc 类型检查
pnpm lint             # ESLint（带自动修复）
pnpm format           # Prettier 格式化（src/）
pnpm web:test:unit    # Vitest
pnpm web:test:e2e     # Playwright
```

### 环境变量

不同模式对应 `.env.dev` / `.env.testing` / `.env.prod`，常用变量：

- `VITE_API_BASE_URL`：后端 API 基地址（默认 `http://localhost:8080`）
- `VITE_APP_ENV`：环境标识（dev/testing/prod）
- `VITE_APP_TITLE`：页面标题

### 目录说明（节选）

- `src/`：前端源码
- `docs/`：需求规划、数据库 DDL、初始化脚本等
- `docker/`、`k8s/`：容器与编排相关文件
- `e2e/`：端到端测试

### 相关文档

- [docs/HR SAAS系统需求规划与界面清单.md](./docs/HR%20SAAS%E7%B3%BB%E7%BB%9F%E9%9C%80%E6%B1%82%E8%A7%84%E5%88%92%E4%B8%8E%E7%95%8C%E9%9D%A2%E6%B8%85%E5%8D%95.md)
- [docs/HR SAAS系统MySQL DDL脚本（含索引与注释）.md](./docs/HR%20SAAS%E7%B3%BB%E7%BB%9FMySQL%20DDL%E8%84%9A%E6%9C%AC%EF%BC%88%E5%90%AB%E7%B4%A2%E5%BC%95%E4%B8%8E%E6%B3%A8%E9%87%8A%EF%BC%89.md)
- [docs/init.sql](./docs/init.sql)
