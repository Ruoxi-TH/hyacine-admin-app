import { createContext, useContext, ReactNode } from "react";
import { useColorScheme } from "react-native";

type Lang = "zh" | "en" | "ja";

const translations: Record<string, Record<Lang, string>> = {
  adminTitle: { zh: "Hyacine 管理后台", en: "Hyacine Admin", ja: "Hyacine 管理画面" },
  signInToManage: { zh: "登录以管理服务器", en: "Sign in to manage your server", ja: "サーバー管理にサインイン" },
  email: { zh: "邮箱", en: "Email", ja: "メール" },
  password: { zh: "密码", en: "Password", ja: "パスワード" },
  signIn: { zh: "登录", en: "Sign In", ja: "サインイン" },
  signingIn: { zh: "登录中...", en: "Signing in...", ja: "サインイン中..." },
  backendUrl: { zh: "后端地址", en: "Backend URL", ja: "バックエンドURL" },
  backendUrlHint: { zh: "例如: https://music.example.com", en: "e.g. https://music.example.com", ja: "例: https://music.example.com" },
  enterEmailAndPassword: { zh: "请输入邮箱和密码", en: "Please enter email and password", ja: "メールとパスワードを入力してください" },
  backendUrlNotConfigured: { zh: "后端地址未配置", en: "Backend URL not configured", ja: "バックエンドURL未設定" },
  networkError: { zh: "网络错误", en: "Network error", ja: "ネットワークエラー" },
  loginFailed: { zh: "登录失败", en: "Login failed", ja: "ログイン失敗" },
  dashboard: { zh: "仪表盘", en: "Dashboard", ja: "ダッシュボード" },
  serverOverview: { zh: "服务器概览", en: "Server overview", ja: "サーバー概要" },
  totalUsers: { zh: "总用户", en: "Total Users", ja: "総ユーザー" },
  activeUsers: { zh: "活跃用户", en: "Active", ja: "アクティブ" },
  bannedUsers: { zh: "封禁用户", en: "Banned", ja: "BAN済み" },
  adminUsers: { zh: "管理员", en: "Admins", ja: "管理者" },
  serverStatus: { zh: "服务器状态", en: "Server Status", ja: "サーバーステータス" },
  users: { zh: "用户", en: "Users", ja: "ユーザー" },
  registeredUsers: { zh: "个注册用户", en: "registered users", ja: "登録ユーザー" },
  searchUsers: { zh: "搜索用户...", en: "Search users...", ja: "ユーザー検索..." },
  ban: { zh: "封禁", en: "Ban", ja: "BAN" },
  unban: { zh: "解封", en: "Unban", ja: "BAN解除" },
  promote: { zh: "提权", en: "Promote", ja: "昇格" },
  demote: { zh: "降权", en: "Demote", ja: "降格" },
  banned: { zh: "已封禁", en: "Banned", ja: "BAN済み" },
  banUser: { zh: "封禁用户", en: "Ban User", ja: "ユーザーBAN" },
  unbanUser: { zh: "解封用户", en: "Unban User", ja: "BAN解除" },
  banConfirm: { zh: "禁止此用户登录？", en: "Prevent this user from logging in?", ja: "このユーザーのログインを禁止しますか？" },
  unbanConfirm: { zh: "允许此用户重新登录？", en: "Allow this user to login again?", ja: "このユーザーのログインを再許可しますか？" },
  deleteUser: { zh: "删除用户", en: "Delete User", ja: "ユーザー削除" },
  deleteConfirm: { zh: "永久删除", en: "Permanently delete", ja: "完全に削除" },
  cannotUndo: { zh: "？此操作不可撤销。", en: "? This cannot be undone.", ja: "？この操作は取り消せません。" },
  changeRole: { zh: "更改角色", en: "Change Role", ja: "ロール変更" },
  toRole: { zh: "为", en: "to", ja: "に" },
  cancel: { zh: "取消", en: "Cancel", ja: "キャンセル" },
  confirm: { zh: "确认", en: "Confirm", ja: "確認" },
  operationFailed: { zh: "操作失败", en: "Operation failed", ja: "操作失敗" },
  deleteFailed: { zh: "删除失败", en: "Delete failed", ja: "削除失敗" },
  settings: { zh: "设置", en: "Settings", ja: "設定" },
  smtpEmail: { zh: "SMTP 邮件", en: "SMTP Email", ja: "SMTPメール" },
  edit: { zh: "编辑", en: "Edit", ja: "編集" },
  smtpHost: { zh: "SMTP 主机", en: "SMTP Host", ja: "SMTPホスト" },
  port: { zh: "端口", en: "Port", ja: "ポート" },
  username: { zh: "用户名", en: "Username", ja: "ユーザー名" },
  passwordAlreadySet: { zh: "(已设置)", en: "(already set)", ja: "(設定済み)" },
  leaveEmptyToKeep: { zh: "留空保持当前密码", en: "Leave empty to keep current", ja: "空欄で現在のパスワードを維持" },
  enterPassword: { zh: "输入密码", en: "Enter password", ja: "パスワード入力" },
  fromAddress: { zh: "发件地址", en: "From Address", ja: "送信元アドレス" },
  save: { zh: "保存", en: "Save", ja: "保存" },
  saving: { zh: "保存中...", en: "Saving...", ja: "保存中..." },
  notConfigured: { zh: "未配置", en: "Not configured", ja: "未設定" },
  set: { zh: "已设置", en: "Set", ja: "設定済み" },
  notSet: { zh: "未设置", en: "Not set", ja: "未設定" },
  from: { zh: "发件人", en: "From", ja: "送信元" },
  host: { zh: "主机", en: "Host", ja: "ホスト" },
  logout: { zh: "退出登录", en: "Sign Out", ja: "サインアウト" },
  logoutConfirm: { zh: "确定要退出登录吗？", en: "Are you sure you want to sign out?", ja: "サインアウトしますか？" },
  version: { zh: "Hyacine 管理后台 v1.0.0", en: "Hyacine Admin v1.0.0", ja: "Hyacine 管理画面 v1.0.0" },
  banReason: { zh: "封禁原因", en: "Ban reason", ja: "BAN理由" },
  bannedByAdmin: { zh: "管理员封禁", en: "Banned by admin", ja: "管理者によるBAN" },
  noUsers: { zh: "暂无用户", en: "No users", ja: "ユーザーなし" },
  loadMore: { zh: "加载更多", en: "Load more", ja: "もっと読み込む" },
  createdAt: { zh: "注册时间", en: "Created", ja: "登録日" },
  role: { zh: "角色", en: "Role", ja: "ロール" },
};

interface I18nContextValue {
  t: (key: string) => string;
  lang: Lang;
}

const I18nContext = createContext<I18nContextValue>({
  t: (key: string) => key,
  lang: "en",
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const colorScheme = useColorScheme();
  const lang: Lang = "zh";

  const t = (key: string): string => {
    return translations[key]?.[lang] ?? translations[key]?.["en"] ?? key;
  };

  return (
    <I18nContext.Provider value={{ t, lang }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
