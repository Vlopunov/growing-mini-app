/**
 * Telegram WebApp integration hook.
 * Provides access to Telegram WebApp API, user data, and actions.
 */

// Extend Window type for Telegram
declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

interface TelegramWebApp {
  ready: () => void;
  expand: () => void;
  close: () => void;
  sendData: (data: string) => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
    setText: (text: string) => void;
    enable: () => void;
    disable: () => void;
    showProgress: (leaveActive?: boolean) => void;
    hideProgress: () => void;
  };
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (cb: () => void) => void;
    offClick: (cb: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
  themeParams: {
    bg_color?: string;
    text_color?: string;
    hint_color?: string;
    link_color?: string;
    button_color?: string;
    button_text_color?: string;
    secondary_bg_color?: string;
  };
  initDataUnsafe: {
    user?: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
      photo_url?: string;
    };
    start_param?: string;
  };
  colorScheme: 'light' | 'dark';
  viewportHeight: number;
  viewportStableHeight: number;
  isExpanded: boolean;
  platform: string;
}

const tg = window.Telegram?.WebApp;

export function useTelegram() {
  const isAvailable = !!tg;

  const user = tg?.initDataUnsafe?.user;
  const startParam = tg?.initDataUnsafe?.start_param;

  const ready = () => {
    tg?.ready();
  };

  const expand = () => {
    tg?.expand();
  };

  const close = () => {
    tg?.close();
  };

  const sendData = (data: Record<string, unknown>) => {
    tg?.sendData(JSON.stringify(data));
  };

  const haptic = {
    impact: (style: 'light' | 'medium' | 'heavy' = 'medium') => {
      tg?.HapticFeedback?.impactOccurred(style);
    },
    notification: (type: 'success' | 'error' | 'warning' = 'success') => {
      tg?.HapticFeedback?.notificationOccurred(type);
    },
    selection: () => {
      tg?.HapticFeedback?.selectionChanged();
    },
  };

  const mainButton = {
    show: (text: string, onClick: () => void) => {
      if (!tg?.MainButton) return;
      tg.MainButton.setText(text);
      tg.MainButton.show();
      tg.MainButton.onClick(onClick);
    },
    hide: () => {
      tg?.MainButton?.hide();
    },
    showProgress: () => {
      tg?.MainButton?.showProgress(true);
    },
    hideProgress: () => {
      tg?.MainButton?.hideProgress();
    },
  };

  const backButton = {
    show: (onClick: () => void) => {
      if (!tg?.BackButton) return;
      tg.BackButton.show();
      tg.BackButton.onClick(onClick);
    },
    hide: () => {
      tg?.BackButton?.hide();
    },
  };

  return {
    tg,
    isAvailable,
    user,
    startParam,
    ready,
    expand,
    close,
    sendData,
    haptic,
    mainButton,
    backButton,
    platform: tg?.platform || 'unknown',
    colorScheme: tg?.colorScheme || 'dark',
  };
}
