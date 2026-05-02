# 多轮学习笔记整理助手

这是一个课程作业用的纯前端 Web LLM 应用。项目只包含 HTML、CSS、JavaScript 静态文件，不包含后端、数据库、登录系统或服务器转发。

## 功能

- 输入阿里云百炼 API Key。
- 输入课程笔记，生成摘要、核心知识点、易混点和复习问题。
- 支持多轮修改，例如“更简短”“更适合考试复习”“改成表格”。
- 支持加载中提示、错误提示和清空对话。
- API Key 不写入代码，不提交到仓库，只在当前页面请求时使用。

## 使用模型与接口

- 模型：`qwen3.6-plus`
- 接口：`https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions`

## 本地测试

直接双击打开 `index.html`，或者用 VS Code 的 Live Server 打开。

测试流程：

1. 输入阿里云百炼 API Key。
2. 输入一段课程笔记。
3. 点击“生成整理结果”。
4. 等待模型回复。
5. 继续输入“改成表格”“更适合考试复习”等修改要求。
6. 点击“清空对话”测试重新开始功能。

## GitHub Pages 部署

1. 新建 GitHub 仓库，例如 `llm-note-helper`。
2. 上传 `index.html`、`style.css`、`script.js`、`README.md`。
3. 进入仓库 Settings → Pages。
4. Source 选择 `Deploy from a branch`。
5. Branch 选择 `main`，目录选择 `/root`。
6. 保存后等待部署完成。
7. 得到类似下面的 HTTPS 链接：

```text
https://你的用户名.github.io/llm-note-helper/
```

## 提交信息示例

| 字段 | 内容 |
|---|---|
| 项目名称 | 多轮学习笔记整理助手 |
| 项目链接 | GitHub Pages 生成的 HTTPS 链接 |

## 注意事项

不要把 API Key 写入任何文件，不要上传 API Key 截图，不要把账号密码或个人隐私信息放进网页或仓库。
