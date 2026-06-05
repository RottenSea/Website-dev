// theme.js

// 获取根元素
const root = document.documentElement; // 即 <html>

// 存储键名
const THEME_KEY = "user-theme";

// 定义主题模式
const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  AUTO: "auto",
};

/**
 * 应用主题
 * @param {string} theme - 'light', 'dark', 或 'auto'
 */
function applyTheme(theme) {
  if (theme === THEMES.AUTO) {
    // 移除手动设置的类，让 CSS 媒体查询生效
    root.classList.remove("light", "dark");
    // 可选：设置一个标记表示跟随系统
    root.setAttribute("data-theme-mode", "auto");
    return;
  }

  // 手动设置主题
  if (theme === THEMES.LIGHT) {
    root.classList.remove("dark");
    root.classList.add("light");
    root.setAttribute("data-theme-mode", "light");
  } else if (theme === THEMES.DARK) {
    root.classList.remove("light");
    root.classList.add("dark");
    root.setAttribute("data-theme-mode", "dark");
  }
}

/**
 * 获取当前激活的主题（实际显示的颜色主题）
 * @returns {string} 'light' 或 'dark'
 */
function getCurrentTheme() {
  // 检测实际生效的是深色还是浅色（通过计算后的背景色判断）
  const bgColor = getComputedStyle(document.body).backgroundColor;
  // 简单判断：RGB 平均值小于 128 认为是深色
  const match = bgColor.match(/\d+/g);
  if (match) {
    const brightness =
      (parseInt(match[0]) + parseInt(match[1]) + parseInt(match[2])) / 3;
    return brightness < 128 ? "dark" : "light";
  }
  // 备用：通过类名判断
  if (root.classList.contains("dark")) return "dark";
  if (root.classList.contains("light")) return "light";
  // 默认根据系统时间简单判断（不准确，仅备用）
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/**
 * 保存用户偏好到 localStorage
 */
function saveThemePreference(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * 加载用户保存的主题偏好
 */
function loadThemePreference() {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved && Object.values(THEMES).includes(saved)) {
    applyTheme(saved);
    // 可选：更新按钮的激活状态
    updateActiveButton(saved);
  } else {
    // 没有保存过，默认跟随系统
    applyTheme(THEMES.AUTO);
    updateActiveButton(THEMES.AUTO);
  }
}

/**
 * 更新按钮的激活样式（可选）
 */
function updateActiveButton(activeTheme) {
  document.querySelectorAll(".theme-buttons button").forEach((btn) => {
    btn.classList.remove("active");
  });
  if (activeTheme === THEMES.LIGHT) {
    document.getElementById("lightBtn")?.classList.add("active");
  } else if (activeTheme === THEMES.DARK) {
    document.getElementById("darkBtn")?.classList.add("active");
  } else {
    document.getElementById("autoBtn")?.classList.add("active");
  }
}

/**
 * 监听系统主题变化（当处于 auto 模式时自动更新）
 */
function watchSystemThemeChange() {
  const darkModeQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handleChange = (e) => {
    const currentMode = root.getAttribute("data-theme-mode");
    // 只有在 auto 模式下才响应系统变化
    if (currentMode === "auto") {
      // 不需要做任何事，因为 CSS 媒体查询会自动生效
      // 但可以在这里触发一些额外的回调
      console.log("系统主题变为:", e.matches ? "dark" : "light");
    }
  };

  // 兼容旧浏览器的写法
  if (darkModeQuery.addEventListener) {
    darkModeQuery.addEventListener("change", handleChange);
  } else {
    darkModeQuery.addListener(handleChange); // Safari 旧版
  }
}

// --- 绑定按钮事件 ---
document.addEventListener("DOMContentLoaded", () => {
  // 加载保存的主题
  loadThemePreference();

  // 监听系统主题变化（保持 auto 模式实时响应）
  watchSystemThemeChange();

  // 绑定按钮点击事件
  const lightBtn = document.getElementById("lightBtn");
  const darkBtn = document.getElementById("darkBtn");
  const autoBtn = document.getElementById("autoBtn");

  lightBtn?.addEventListener("click", () => {
    applyTheme(THEMES.LIGHT);
    saveThemePreference(THEMES.LIGHT);
    updateActiveButton(THEMES.LIGHT);
  });

  darkBtn?.addEventListener("click", () => {
    applyTheme(THEMES.DARK);
    saveThemePreference(THEMES.DARK);
    updateActiveButton(THEMES.DARK);
  });

  autoBtn?.addEventListener("click", () => {
    applyTheme(THEMES.AUTO);
    saveThemePreference(THEMES.AUTO);
    updateActiveButton(THEMES.AUTO);
  });
});
