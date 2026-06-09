/* ============================================================
   考研数学二真题管理系统 - 主逻辑
   (API 配置由用户在页面中自行填写，见 index.html 内联脚本)
   ============================================================ */

/* ============================================================
   常量定义
   ============================================================ */
const STORAGE_KEY = 'math2_questions';
const TYPE_BADGE = {
  '选择题': 'bg-primary',
  '填空题': 'bg-success',
  '解答题': 'bg-warning text-dark'
};

/* ============================================================
   KaTeX 自动渲染配置
   ============================================================ */
const KATEX_CONFIG = {
  delimiters: [
    { left: '$$', right: '$$', display: true },
    { left: '$', right: '$', display: false }
  ],
  throwOnError: false
};

/** 对当前页面中所有含 LaTeX 公式的容器执行渲染 */
function renderMath() {
  const targets = document.querySelectorAll(
    '#listContainer, #aiResponse, #previewContent, .question-text'
  );
  targets.forEach(el => {
    if (el && el.innerHTML.trim()) {
      try {
        renderMathInElement(el, KATEX_CONFIG);
      } catch (e) {
        // KaTeX 渲染失败不阻塞页面
      }
    }
  });
}

/* ============================================================
   数据管理（localStorage）
   ============================================================ */

/** 读取所有题目 */
function loadQuestions() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

/** 保存题目列表 */
function saveQuestions(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

/** 添加一道题，返回新列表 */
function addQuestion(year, type, content) {
  const list = loadQuestions();
  list.push({
    id: Date.now() + '_' + Math.random().toString(36).slice(2, 8),
    year: parseInt(year, 10),
    type: type,
    content: content,
    createdAt: new Date().toISOString()
  });
  saveQuestions(list);
  return list;
}

/** 删除一道题 */
function deleteQuestion(id) {
  let list = loadQuestions();
  list = list.filter(q => q.id !== id);
  saveQuestions(list);
  return list;
}

/* ============================================================
   工具函数
   ============================================================ */

/** HTML 转义（防止 XSS） */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/** 将题目原文转为可安全显示的 HTML（转义 HTML 但保留 $ 符号给 KaTeX） */
function contentToHtml(text) {
  return escapeHtml(text);
}

/** Toast 消息提示 */
function showToast(msg, type) {
  type = type || 'success';
  const existing = document.querySelector('.toast-container');
  if (existing) existing.remove();

  const container = document.createElement('div');
  container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
  container.style.zIndex = '9999';
  const bg = type === 'success' ? 'text-bg-success' : 'text-bg-danger';
  container.innerHTML =
    '<div class="toast align-items-center ' + bg + ' border-0 show" role="alert">' +
    '<div class="d-flex">' +
    '<div class="toast-body">' + escapeHtml(msg) + '</div>' +
    '<button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>' +
    '</div>' +
    '</div>';
  document.body.appendChild(container);

  setTimeout(function () {
    var t = container.querySelector('.toast');
    if (t) { bootstrap.Toast.getOrCreateInstance(t).hide(); }
    setTimeout(function () { container.remove(); }, 500);
  }, 3000);
}

/* ============================================================
   真题列表渲染
   ============================================================ */
function renderQuestionList() {
  const list = loadQuestions();
  const container = document.getElementById('listContainer');
  const countEl = document.getElementById('questionCount');
  countEl.textContent = '共 ' + list.length + ' 道真题';

  if (list.length === 0) {
    container.innerHTML =
      '<div class="empty-state">' +
      '<div class="icon">📚</div>' +
      '<h5>还没有录入真题</h5>' +
      '<p class="text-muted">切换到「录入题目」标签页添加第一道真题吧</p>' +
      '</div>';
    return;
  }

  // 按年份降序排列
  const sorted = list.slice().sort(function (a, b) { return b.year - a.year; });

  var html = '';
  sorted.forEach(function (q, idx) {
    var badgeClass = TYPE_BADGE[q.type] || 'bg-secondary';
    html +=
      '<div class="card question-card" data-id="' + q.id + '">' +
      '<div class="card-body py-3">' +
      '<div class="d-flex justify-content-between align-items-start gap-2">' +
      '<div class="flex-grow-1">' +
      '<div class="d-flex align-items-center gap-3 mb-2 flex-wrap">' +
      '<span class="fw-bold text-secondary">' + q.year + ' 年</span>' +
      '<span class="badge badge-type ' + badgeClass + '">' + q.type + '</span>' +
      '<small class="text-muted">#' + (idx + 1) + '</small>' +
      '</div>' +
      '<div class="question-text">' + contentToHtml(q.content) + '</div>' +
      '</div>' +
      '<button class="btn btn-outline-danger btn-sm flex-shrink-0 ms-2" onclick="handleDelete(\'' + q.id + '\')" title="删除此题">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">' +
      '<path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>' +
      '<path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>' +
      '</svg> 删除' +
      '</button>' +
      '</div>' +
      '</div>' +
      '</div>';
  });
  container.innerHTML = html;

  // 渲染 LaTeX 公式
  renderMath();
}

/** 删除确认 */
function handleDelete(id) {
  if (!confirm('确定要删除这道真题吗？')) return;
  deleteQuestion(id);
  renderQuestionList();
  refreshQuestionSelector();
  showToast('已删除该真题');
}
/* 暴露给 HTML onclick 使用 */
window.handleDelete = handleDelete;

/* ============================================================
   录入表单
   ============================================================ */

/** 初始化年份下拉框 */
function initYearSelect() {
  var sel = document.getElementById('inputYear');
  var currentYear = new Date().getFullYear();
  for (var y = currentYear; y >= 2000; y--) {
    var opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y + ' 年';
    sel.appendChild(opt);
  }
}

/** 录入提交 */
function setupAddForm() {
  var form = document.getElementById('addForm');

  // 实时预览
  var contentInput = document.getElementById('inputContent');
  var previewArea = document.getElementById('previewArea');
  var previewContent = document.getElementById('previewContent');
  var previewTimer = null;
  contentInput.addEventListener('input', function () {
    clearTimeout(previewTimer);
    previewTimer = setTimeout(function () {
      var val = contentInput.value.trim();
      if (val) {
        previewArea.style.display = 'block';
        previewContent.innerHTML = contentToHtml(val);
        renderMath();
      } else {
        previewArea.style.display = 'none';
      }
    }, 500);
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var year = document.getElementById('inputYear');
    var type = document.getElementById('inputType');
    var content = document.getElementById('inputContent');

    form.classList.add('was-validated');
    if (!form.checkValidity()) return;

    addQuestion(year.value, type.value, content.value);

    year.value = '';
    type.value = '';
    content.value = '';
    previewArea.style.display = 'none';
    form.classList.remove('was-validated');

    renderQuestionList();
    refreshQuestionSelector();

    // 切换到真题列表标签页
    bootstrap.Tab.getOrCreateInstance(document.getElementById('list-tab')).show();
    showToast('真题录入成功！');
  });

  // 快速填入示例
  document.getElementById('btnQuickFill').addEventListener('click', function () {
    var samples = [
      {
        year: 2025,
        type: '选择题',
        content: '设函数 $f(x) = x^3 - 3x + 1$，则 $f(x)$ 在区间 $[-2, 2]$ 上的最大值为（  ）\nA. $3$    B. $5$    C. $7$    D. $9$'
      },
      {
        year: 2025,
        type: '填空题',
        content: '曲线 $y = x^3 - 3x^2 + 2x$ 在点 $(1, 0)$ 处的切线方程为 __________。'
      },
      {
        year: 2024,
        type: '解答题',
        content: '求由曲线 $y = \\ln x$，直线 $x = 1$，$x = e$ 及 $x$ 轴所围成的平面图形绕 $x$ 轴旋转一周所得旋转体的体积。'
      },
      {
        year: 2024,
        type: '选择题',
        content: '设 $A$ 是 $3$ 阶矩阵，$|A| = 2$，则 $|-2A^T| =$（  ）\nA. $-16$    B. $-8$    C. $8$    D. $16$'
      },
      {
        year: 2023,
        type: '解答题',
        content: '求极限 $\\lim_{x \\to 0} \\frac{1 - \\cos x}{x^2}$。'
      },
      {
        year: 2023,
        type: '填空题',
        content: '设 $z = f(x^2 + y^2)$，其中 $f$ 可微，则 $\\frac{\\partial z}{\\partial x} + \\frac{\\partial z}{\\partial y} =$ __________。'
      }
    ];
    var s = samples[Math.floor(Math.random() * samples.length)];
    document.getElementById('inputYear').value = s.year;
    document.getElementById('inputType').value = s.type;
    document.getElementById('inputContent').value = s.content;
    // 触发预览
    var evt = new Event('input');
    contentInput.dispatchEvent(evt);
  });
}

/* ============================================================
   AI 答疑 - 题目选择器
   ============================================================ */
function refreshQuestionSelector() {
  var list = loadQuestions();
  var sel = document.getElementById('questionSelector');
  sel.innerHTML = '<option value="">-- 不选择，仅提问 --</option>';

  if (list.length === 0) return;

  // 按年份分组
  var grouped = {};
  list.forEach(function (q) {
    if (!grouped[q.year]) grouped[q.year] = [];
    grouped[q.year].push(q);
  });

  Object.keys(grouped).sort(function (a, b) { return b - a; }).forEach(function (year) {
    var optgroup = document.createElement('optgroup');
    optgroup.label = year + ' 年';
    grouped[year].forEach(function (q) {
      var opt = document.createElement('option');
      opt.value = q.id;
      var preview = q.content.length > 50 ? q.content.slice(0, 50) + '...' : q.content;
      opt.textContent = '[' + q.type + '] ' + preview;
      optgroup.appendChild(opt);
    });
    sel.appendChild(optgroup);
  });
}

/* ============================================================
   AI 答疑 - 清空结果（核心逻辑在 index.html 内联脚本中）
   ============================================================ */
function clearAIResponse() {
  document.getElementById('aiResponse').innerHTML = '';
  document.getElementById('aiError').classList.add('d-none');
  var ph = document.getElementById('aiPlaceholder');
  if (ph) ph.style.display = '';
}

/* ============================================================
   初始化
   ============================================================ */
document.addEventListener('DOMContentLoaded', function () {
  initYearSelect();
  setupAddForm();
  renderQuestionList();
  refreshQuestionSelector();

  // 绑定清空结果按钮
  var clearBtn = document.getElementById('btnClearAI');
  if (clearBtn) clearBtn.addEventListener('click', clearAIResponse);

  // 每次标签页切换后重新渲染公式
  var tabEls = document.querySelectorAll('[data-bs-toggle="tab"]');
  tabEls.forEach(function (tab) {
    tab.addEventListener('shown.bs.tab', function () {
      renderMath();
    });
  });
});
