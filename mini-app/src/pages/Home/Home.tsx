import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Heart, BookOpen, User, Gift, ArrowRight, TrendingUp, Users, Mic, Sparkles } from 'lucide-react';
import { EventCard } from '../../components/EventCard/EventCard';
import { Button } from '../../components/ui/Button';
import { events, news, communityStats } from '../../data/mock';
import logo from '../../assets/logo.svg';
import styles from './Home.module.css';

const quickActions = [
  { label: 'События', icon: Calendar, path: '/events', color: 'var(--accent-green)' },
  { label: 'Нетворкинг', icon: Heart, path: '/tinder', color: '#e74c8b' },
  { label: 'Бонусы', icon: Gift, path: '/bonuses', color: '#8b5cf6' },
  { label: 'Каталог', icon: BookOpen, path: '/catalog', color: 'var(--accent-blue)' },
];

const statItems = [
  { key: 'members', label: 'Участников', icon: Users, value: communityStats.members },
  { key: 'events', label: 'Мероприятий', icon: Calendar, value: communityStats.events },
  { key: 'speakers', label: 'Спикеров', icon: Mic, value: communityStats.speakers },
  { key: 'connections', label: 'Контактов', icon: TrendingUp, value: communityStats.connections },
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [animatedStats, setAnimatedStats] = useState<Record<string, number>>({});
  const nextEvent = events.find(e => e.status === 'upcoming');

  useEffect(() => {
    statItems.forEach((stat, i) => {
      const duration = 1200;
      const steps = 30;
      const increment = stat.value / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.value) {
          current = stat.value;
          clearInterval(timer);
        }
        setAnimatedStats(prev => ({ ...prev, [stat.key]: Math.round(current) }));
      }, (duration / steps) + (i * 50));
    });
  }, []);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <div className={styles.heroGlow} />
          <div className={styles.heroGlow2} />
        </div>
        <div className={styles.heroContent}>
          <img src={logo} alt="Growing" className={styles.logo} />
          <p className={styles.slogan}>Бизнес-сообщество для лидеров</p>
          <div className={styles.heroLine} />
        </div>
      </section>

      {/* Quick Actions */}
      <section className={styles.section}>
        <div className={styles.quickGrid}>
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={action.path}
                className={styles.quickAction}
                onClick={() => navigate(action.path)}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className={styles.quickIcon} style={{ background: `${action.color}18`, color: action.color }}>
                  <Icon size={22} />
                </div>
                <span className={styles.quickLabel}>{action.label}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Next Event */}
      {nextEvent && (
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>
              <Sparkles size={18} className={styles.sectionIcon} />
              Ближайшее событие
            </h2>
            <button className={styles.seeAll} onClick={() => navigate('/events')}>
              Все <ArrowRight size={14} />
            </button>
          </div>
          <EventCard
            event={nextEvent}
            variant="large"
            onClick={() => navigate(`/events/${nextEvent.id}`)}
          />
        </section>
      )}

      {/* Stats */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Сообщество в цифрах</h2>
        <div className={styles.statsGrid}>
          {statItems.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={stat.key} className={styles.statCard} style={{ animationDelay: `${i * 0.1}s` }}>
                <Icon size={20} className={styles.statIcon} />
                <span className={styles.statValue}>
                  {(animatedStats[stat.key] || 0).toLocaleString('ru-RU')}+
                </span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* News */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Новости</h2>
        </div>
        <div className={styles.newsList}>
          {news.map((item, i) => (
            <div key={item.id} className={styles.newsCard} style={{ animationDelay: `${i * 0.1}s` }}>
              <div className={styles.newsHeader}>
                <span className={styles.newsChannel}>{item.channel}</span>
                <span className={styles.newsDate}>{item.date}</span>
              </div>
              <h4 className={styles.newsTitle}>{item.title}</h4>
              <p className={styles.newsPreview}>{item.preview}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className={styles.section}>
        <div className={styles.ctaCard}>
          <h3 className={styles.ctaTitle}>Присоединяйтесь к Growing</h3>
          <p className={styles.ctaText}>Станьте частью крупнейшего бизнес-сообщества Беларуси</p>
          <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/events')}>
            Смотреть события
          </Button>
        </div>
      </section>

      <div className={styles.bottomSpacer} />
    </div>
  );
};
