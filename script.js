const API_URL = "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
const MODEL_NAME = "qwen3.6-plus";

const systemPrompt = `你是一个学习笔记整理助手。你的任务是帮助学生整理课程笔记。
第一次收到课程笔记时，请优先输出：
1. 简明摘要；
2. 核心知识点；
3. 易混点提醒；
4. 复习问题。
如果用户后续提出“更简短”“更适合考试复习”“改成表格”“控制字数”等修改要求，请基于当前会话已有内容继续优化，而不是重新开始。`;

let messages = [{ role: "system", content: systemPrompt }];

const apiKeyInput = document.querySelector("#apiKey");
const toggleKeyBtn = document.querySelector("#toggleKeyBtn");
const userInput = document.querySelector("#userInput");
const sendBtn = document.querySelector("#sendBtn");
const clearBtn = document.querySelector("#clearBtn");
const chatBox = document.querySelector("#chatBox");
const statusText = document.querySelector("#statusText");
const errorBox = document.querySelector("#errorBox");
const exampleChips = document.querySelectorAll(".example-chip");

function escapeHTML(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function clearEmptyState() {
  const emptyState = chatBox.querySelector(".empty-state");
  if (emptyState) emptyState.remove();
}

function appendMessage(role, content) {
  clearEmptyState();

  const wrapper = document.createElement("div");
  wrapper.className = `message ${role}`;

  const meta = document.createElement("div");
  meta.className = "message-meta";
  meta.textContent = role === "user" ? "你" : "学习笔记整理助手";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.innerHTML = escapeHTML(content);

  wrapper.append(meta, bubble);
  chatBox.appendChild(wrapper);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function setLoading(isLoading) {
  sendBtn.disabled = isLoading;
  clearBtn.disabled = isLoading;
  statusText.textContent = isLoading ? "正在生成中，请稍候……" : "";
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.add("show");
}

function clearError() {
  errorBox.textContent = "";
  errorBox.classList.remove("show");
}

function resetChat() {
  messages = [{ role: "system", content: systemPrompt }];
  chatBox.innerHTML = `
    <div class="empty-state">
      <strong>还没有开始对话</strong>
      <span>请先输入 API Key 和课程笔记，然后点击“生成整理结果”。</span>
    </div>
  `;
  userInput.value = "";
  clearError();
  statusText.textContent = "已清空，可以重新开始。";
  setTimeout(() => {
    if (statusText.textContent === "已清空，可以重新开始。") statusText.textContent = "";
  }, 1800);
}

async function requestQwen(apiKey) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages,
      temperature: 0.7,
      stream: false
    })
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const detail = data?.error?.message || data?.message || `HTTP ${response.status}`;
    throw new Error(`请求失败：${detail}`);
  }

  const answer = data?.choices?.[0]?.message?.content;
  if (!answer) {
    throw new Error("模型没有返回有效内容，请稍后重试。");
  }

  return answer;
}

async function handleSend() {
  const apiKey = apiKeyInput.value.trim();
  const userText = userInput.value.trim();

  clearError();

  if (!apiKey) {
    showError("请先填写阿里云百炼 API Key。注意：不要把 API Key 写进代码或上传到仓库。");
    apiKeyInput.focus();
    return;
  }

  if (!userText) {
    showError("请输入课程笔记或修改要求。比如：把这段笔记整理成摘要、知识点和复习题。");
    userInput.focus();
    return;
  }

  appendMessage("user", userText);
  messages.push({ role: "user", content: userText });
  userInput.value = "";
  setLoading(true);

  try {
    const answer = await requestQwen(apiKey);
    messages.push({ role: "assistant", content: answer });
    appendMessage("assistant", answer);
  } catch (error) {
    messages.pop();
    showError(`${error.message}\n\n如果你确认 API Key 没问题，可能是网络、接口权限、模型权限或浏览器跨域限制导致。`);
  } finally {
    setLoading(false);
  }
}

toggleKeyBtn.addEventListener("click", () => {
  const isPassword = apiKeyInput.type === "password";
  apiKeyInput.type = isPassword ? "text" : "password";
  toggleKeyBtn.textContent = isPassword ? "隐藏" : "显示";
});

sendBtn.addEventListener("click", handleSend);
clearBtn.addEventListener("click", resetChat);

userInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
    handleSend();
  }
});

exampleChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    const text = chip.textContent.trim();
    userInput.value = userInput.value ? `${userInput.value}\n${text}` : text;
    userInput.focus();
  });
});
