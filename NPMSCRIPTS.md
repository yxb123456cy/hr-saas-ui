# NPMSCRIPTS.md
DefectLiteKeeper-web 项目 NPM 脚本说明文档，涵盖开发、构建、测试、部署、代码规范、版本管理等全流程命令，便于团队统一操作规范。

## 一、脚本总览
| 命令                      | 分类           | 核心用途                                  |
| ------------------------- | -------------- | ----------------------------------------- |
| `web:dev`                 | 开发环境       | 启动开发环境（dev模式）                   |
| `web:dev:test`            | 开发环境       | 启动开发环境（testing模式）               |
| `web:dev:prod`            | 开发环境       | 启动开发环境（prod模式）                  |
| `web:build`               | 构建打包       | 基础构建命令（需搭配模式参数）            |
| `web:build:dev`           | 构建打包       | 构建dev环境生产包                         |
| `web:build:test`          | 构建打包       | 构建testing环境生产包                     |
| `web:build:prod`          | 构建打包       | 构建prod环境生产包                        |
| `web:preview`             | 预览验证       | 预览prod环境打包后的效果                  |
| `web:test:unit`           | 测试           | 运行单元测试                              |
| `web:test:e2e`            | 测试           | 运行端到端（E2E）测试                     |
| `web:docker:dev`          | Docker部署     | （待完善）构建并启动dev环境Docker容器     |
| `web:docker:test`         | Docker部署     | （待完善）构建并启动testing环境Docker容器 |
| `web:docker:build`        | Docker部署     | （待完善）仅构建Docker镜像（默认prod）    |
| `web:compose:dev`         | Docker Compose | （待完善）通过Compose启动dev环境服务      |
| `web:compose:test`        | Docker Compose | （待完善）通过Compose启动testing环境服务  |
| `web:compose:build`       | Docker Compose | （待完善）通过Compose构建所有镜像         |
| `build-only`              | 底层命令       | 纯Vite构建（供上层脚本调用）              |
| `clean`                   | 环境清理       | 删除node_modules目录                      |
| `commit`                  | 代码提交       | 规范化Git提交信息（基于git-cz）           |
| `type-check`              | 代码校验       | TypeScript类型检查                        |
| `lint`                    | 代码规范       | ESLint校验并自动修复代码                  |
| `format`                  | 代码格式化     | Prettier格式化src目录代码                 |
| `release:changelog:major` | 版本管理       | 生成大版本更新日志（如v1.x.x→v2.0.0）     |
| `release:changelog:minor` | 版本管理       | 生成次版本更新日志（如v1.0.x→v1.1.0）     |
| `release:changelog:patch` | 版本管理       | 生成补丁版本更新日志（如v1.0.0→v1.0.1）   |
| `prepare`                 | 工程化         | 初始化Husky（Git钩子）                    |

## 二、详细说明
### 1. 开发环境启动（dev）
| 命令           | 执行示例            | 说明                                                         |
| -------------- | ------------------- | ------------------------------------------------------------ |
| `web:dev`      | `pnpm web:dev`      | 启动基于`dev`模式的开发服务器，对接开发环境接口，热更新生效  |
| `web:dev:test` | `pnpm web:dev:test` | 启动基于`testing`模式的开发服务器，对接测试环境接口          |
| `web:dev:prod` | `pnpm web:dev:prod` | 启动基于`prod`模式的开发服务器，对接生产环境接口（谨慎使用） |

### 2. 构建打包（build）
| 命令             | 执行示例                       | 说明                                                                |
| ---------------- | ------------------------------ | ------------------------------------------------------------------- |
| `web:build`      | `pnpm web:build -- --mode dev` | 基础构建命令，需手动指定模式（推荐使用封装后的`web:build:*`命令）   |
| `web:build:dev`  | `pnpm web:build:dev`           | 构建`dev`环境生产包，输出到`dist`目录，适配开发环境部署             |
| `web:build:test` | `pnpm web:build:test`          | 构建`testing`环境生产包，输出到`dist`目录，适配测试环境部署         |
| `web:build:prod` | `pnpm web:build:prod`          | 构建`prod`环境生产包，输出到`dist`目录，代码压缩/优化，适配生产环境 |

### 3. 预览与测试（preview/test）
| 命令            | 执行示例             | 说明                                                                 |
| --------------- | -------------------- | -------------------------------------------------------------------- |
| `web:preview`   | `pnpm web:preview`   | 启动本地预览服务器，加载`prod`模式打包后的`dist`目录，验证生产包效果 |
| `web:test:unit` | `pnpm web:test:unit` | 运行Vitest单元测试，执行`src/**/*.{test,spec}.{js,ts,vue}`测试文件   |
| `web:test:e2e`  | `pnpm web:test:e2e`  | 运行Playwright端到端测试，模拟真实用户操作验证功能完整性             |

### 4. Docker部署（docker/compose）
> 注：以下命令暂未完善，建议补充示例如下（可根据实际Docker配置调整）
| 命令                | 建议补充示例                                                                                                                   | 说明                               |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- |
| `web:docker:dev`    | `pnpm web:docker:dev` → `docker build --build-arg MODE=dev -t defect-web:dev . && docker run -p 5173:80 defect-web:dev`        | 构建dev环境镜像并启动容器          |
| `web:docker:test`   | `pnpm web:docker:test` → `docker build --build-arg MODE=testing -t defect-web:test . && docker run -p 8080:80 defect-web:test` | 构建testing环境镜像并启动容器      |
| `web:docker:build`  | `pnpm web:docker:build` → `docker build --build-arg MODE=prod -t defect-web:latest .`                                          | 仅构建prod环境镜像（不启动容器）   |
| `web:compose:dev`   | `pnpm web:compose:dev` → `docker-compose -f docker-compose.dev.yml up -d`                                                      | 通过dev环境Compose配置启动服务     |
| `web:compose:test`  | `pnpm web:compose:test` → `docker-compose -f docker-compose.test.yml up -d`                                                    | 通过testing环境Compose配置启动服务 |
| `web:compose:build` | `pnpm web:compose:build` → `docker-compose build`                                                                              | 仅构建Compose配置中的所有镜像      |

### 5. 基础工具类（build-only/clean）
| 命令         | 执行示例                         | 说明                                                             |
| ------------ | -------------------------------- | ---------------------------------------------------------------- |
| `build-only` | `pnpm build-only -- --mode prod` | 底层Vite构建命令，上层`web:build:*`脚本的依赖，一般不直接调用    |
| `clean`      | `pnpm clean`                     | 删除项目根目录的`node_modules`，用于重新安装依赖（解决依赖冲突） |

### 6. 代码规范与提交（commit/lint/format/type-check）
| 命令         | 执行示例          | 说明                                                                           |
| ------------ | ----------------- | ------------------------------------------------------------------------------ |
| `commit`     | `pnpm commit`     | 启动git-cz交互式提交界面，强制按规范填写提交信息（如`feat: 新增缺陷提交表单`） |
| `type-check` | `pnpm type-check` | 执行Vue-TSC类型检查，校验所有.ts/.vue文件的TypeScript语法正确性                |
| `lint`       | `pnpm lint`       | 执行ESLint校验，自动修复可修复的代码规范问题，缓存校验结果提升速度             |
| `format`     | `pnpm format`     | 执行Prettier格式化，仅处理`src/`目录下的文件，统一代码格式（缩进/换行/引号等） |

### 7. 版本管理与工程化（release/prepare）
| 命令                      | 执行示例                       | 说明                                                                     |
| ------------------------- | ------------------------------ | ------------------------------------------------------------------------ |
| `release:changelog:major` | `pnpm release:changelog:major` | 升级大版本并生成CHANGELOG.md，如v1.2.3 → v2.0.0                          |
| `release:changelog:minor` | `pnpm release:changelog:minor` | 升级次版本并生成CHANGELOG.md，如v1.2.3 → v1.3.0                          |
| `release:changelog:patch` | `pnpm release:changelog:patch` | 升级补丁版本并生成CHANGELOG.md，如v1.2.3 → v1.2.4                        |
| `prepare`                 | `pnpm prepare`                 | 初始化Husky，安装Git钩子（如commit-msg校验提交信息、pre-commit执行lint） |

## 三、使用建议
1. **日常开发**：优先使用`web:dev`（对接开发环境），无需关注其他模式；
2. **测试部署**：开发完成后执行`web:build:test`，将`dist`目录部署到测试环境；
3. **生产发布**：先执行`web:build:prod`，验证`web:preview`无问题后再部署；
4. **代码提交**：提交代码前先执行`lint`+`format`+`type-check`，再用`commit`规范提交；
5. **版本更新**：发布正式版本前，执行对应`release:changelog:*`生成更新日志，便于追溯版本变更。

## 四、注意事项
1. 所有命令均基于`pnpm`执行，若使用`npm/yarn`，需替换为`npm run <命令>`/`yarn <命令>`；
2. Docker相关命令需先安装Docker/Docker Compose，且已编写对应`Dockerfile`/`docker-compose.yml`；
3. `web:dev:prod`仅用于本地验证生产环境配置，禁止在开发环境对接生产数据库/接口；
4. 单元测试/E2E测试需先编写测试用例，否则执行会提示无测试文件。