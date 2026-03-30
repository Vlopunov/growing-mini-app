import React from 'react';
import { Outlet } from 'react-router-dom';
import { TabBar } from './TabBar';
import styles from './Layout.module.css';

export const Layout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <main className={styles.main}>
        <Outlet />
      </main>
      <TabBar />
    </div>
  );
};
