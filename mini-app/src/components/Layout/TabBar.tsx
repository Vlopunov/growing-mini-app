import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, Heart, Gift, User } from 'lucide-react';
import { useTelegram } from '../../hooks/useTelegram';
import styles from './TabBar.module.css';

const tabs = [
  { path: '/', label: 'Главная', icon: Home },
  { path: '/events', label: 'События', icon: Calendar },
  { path: '/tinder', label: 'Тиндер', icon: Heart },
  { path: '/bonuses', label: 'Бонусы', icon: Gift },
  { path: '/profile', label: 'Профиль', icon: User },
];

export const TabBar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { haptic, isAvailable } = useTelegram();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleTabClick = (path: string) => {
    if (isAvailable) haptic.selection();
    navigate(path);
  };

  return (
    <nav className={styles.tabBar}>
      <div className={styles.inner}>
        {tabs.map((tab) => {
          const active = isActive(tab.path);
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              className={`${styles.tab} ${active ? styles.active : ''}`}
              onClick={() => handleTabClick(tab.path)}
            >
              <div className={styles.iconWrap}>
                {active && <div className={styles.activeGlow} />}
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
              </div>
              <span className={styles.label}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
