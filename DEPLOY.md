# 部署到 Railway

## 方式一：通过 GitHub（推荐）

### 1. 创建 GitHub 仓库
- 打开 https://github.com
- 点 **New repository**
- 仓库名随意，例如 `ins-miniprogram-server`
- 设为 **Private**（私有）
- 创建后不要初始化 README

### 2. 上传代码
把 `C:\Users\X\Documents\test\ins-miniprogram\server\` 目录里的所有文件上传到 GitHub：
- 在 GitHub 仓库页面点 **Add file → Upload files**
- 把 server 文件夹里的所有文件拖进去
- 注意：**不要上传 node_modules/**（有 .gitignore 会忽略）
- 提交

### 3. 在 Railway 连接仓库
- 打开 https://railway.app
- 点 **New Project → Deploy from GitHub repo**
- 选择刚创建的那个仓库
- Railway 会自动检测 Node.js 并部署
- 部署完成后，Railway 会自动分配一个域名，例如 `xxx.up.railway.app`
- 更新 `miniprogram/utils/api.js` 里的 API_BASE 为这个新域名

## 方式二：直接上传 ZIP（不需要 GitHub）

### 1. 在 Railway 创建项目
- 打开 https://railway.app
- 点 **New Project → Empty Project**
- 点 **Deploy**
- 在 `server/` 目录右键 → 压缩为 ZIP → 拖到 Railway 上传区域

## 首次部署后
服务启动后会自动填充种子数据（12位博主 + 帖子 + 评论）。
在微信开发者工具重新编译即可看到数据。
