# 考研数学二真题管理系统

纯前端、本地运行的考研数学二真题收录、管理及 AI 答疑工具。集成 **KaTeX** 公式渲染引擎，支持 LaTeX 数学公式实时预览与展示。

## 项目结构

```
考研数二真题系统/
├── index.html          # 主页面（三标签：真题列表 | 录入题目 | AI答疑）
├── css/
│   └── style.css       # 全局样式 + KaTeX 公式样式
├── js/
│   └── main.js         # 核心逻辑（增删题目、本地存储、豆包API对接、公式渲染）
└── README.md           # 本文件
```

## 部署说明

1. 将整个 `考研数二真题系统/` 目录复制到任意位置；
2. 直接双击 `index.html` 用浏览器打开即可使用；
3. **无需安装任何服务器或运行时环境**，纯前端本地运行。

> 首次打开时请确保网络通畅（CDN 加载 Bootstrap 5、KaTeX 及字体文件）。

## API 密钥配置

系统通过 **火山方舟 Ark API** (Responses API) 调用豆包模型提供 AI 答疑能力。密钥已内置，通常情况下无需额外配置。

如需更换密钥或模型：

1. 用文本编辑器打开 `js/main.js`；
2. 修改第 5 行的 `DOUBAO_API_KEY` 值为你的新 Key；
3. 修改第 7 行的 `DOUBAO_MODEL` 值为你的模型名称（如 `doubao-seed-2-0-pro-260215`）；
4. 保存文件，刷新页面即可。

> 未配置密钥时，点击"开始答疑"会给出明确的提示，不会发送无效请求。

## 数据存储

- 所有真题数据保存在浏览器 **localStorage** 中；
- 刷新页面、关闭浏览器后数据不丢失；
- **清除浏览器缓存 / 站点数据** 会导致数据丢失，请注意备份。

## LaTeX 公式输入规则

系统基于 **KaTeX** 渲染数学公式，支持考研数学二涉及的全部公式类型。

### 基本语法

| 类型 | 写法 | 示例 | 渲染效果 |
|------|------|------|----------|
| 行内公式 | `$...$` | `$\int_a^b f(x)dx$` | $\int_a^b f(x)dx$ |
| 独立公式块 | `$$...$$` | `$$\sum_{n=1}^\infty \frac{1}{n^2}$$` | $$\sum_{n=1}^\infty \frac{1}{n^2}$$ |

### 常用公式参考

```
# 极限
$\lim_{x \to 0} \frac{\sin x}{x} = 1$

# 导数
$f'(x) = \frac{dy}{dx}$

# 积分
$\int_0^1 x^2 dx$

# 微分方程
$y'' + p(x)y' + q(x)y = 0$

# 多元微分
$\frac{\partial z}{\partial x}$

# 行列式
$\begin{vmatrix} a & b \\ c & d \end{vmatrix}$

# 矩阵
$\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}$

# 级数
$\sum_{n=1}^\infty \frac{(-1)^n}{n}$
```

### LaTeX 转义注意

在 JavaScript 字符串中写 LaTeX 时，**反斜杠 `\` 需要写成 `\\`**（双反斜杠）。例如：
- 正确：`$\\int_0^1 x \\, dx$`
- 错误：`$\int_0^1 x \, dx$`

但在 ``<textarea>`` 编辑框中直接输入时，使用**单反斜杠**即可：
```
$\int_0^1 x \, dx$
```

### 常见公式对照表

| 渲染结果 | LaTeX 代码 |
|----------|-----------|
| $x^n$ | `x^n` |
| $\sqrt{x}$ | `\sqrt{x}` |
| $\frac{a}{b}$ | `\frac{a}{b}` |
| $\sin x$ | `\sin x` |
| $\cos x$ | `\cos x` |
| $\tan x$ | `\tan x` |
| $\ln x$ | `\ln x` |
| $\log_a b$ | `\log_a b` |
| $\lim_{x \to 0}$ | `\lim_{x \to 0}` |
| $\int_a^b$ | `\int_a^b` |
| $\sum_{n=1}^\infty$ | `\sum_{n=1}^\infty` |
| $\partial$ | `\partial` |
| $\infty$ | `\infty` |
| $\pi$ | `\pi` |
| $\alpha, \beta, \gamma$ | `\alpha`, `\beta`, `\gamma` |
| $\Rightarrow$ | `\Rightarrow` |
| $\to$ | `\to` |
| $\cdot$ | `\cdot` |
| $\cdots$ | `\cdots` |
| $\times$ | `\times` |

## AI 答疑说明

- 支持从已录入的真题中选择一道作为上下文，也可不选择仅提问；
- 点击"开始答疑"后，系统将 **题干（含公式 $ 标记） + 用户提问** 整体发给豆包 API；
- API 返回要求按 **解题思路 / 考点分析 / 详细解答** 三段组织，公式统一用 LaTeX 包裹；
- 返回内容自动经过 KaTeX 渲染为规范数学排版。

## 技术栈

- **Bootstrap 5** — 界面框架，响应式布局
- **KaTeX** — 快速 LaTeX 公式渲染（无需 JavaScript 重排，比 MathJax 更快）
- **localStorage** — 本地数据持久化
- **Fetch API** — 豆包 API HTTP 调用

## 许可

仅限个人学习使用。
