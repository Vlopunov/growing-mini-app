import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, ChevronRight } from 'lucide-react';
import { EventCard } from '../../components/EventCard/EventCard';
import { events, sredaEvent } from '../../data/mock';
import styles from './Events.module.css';

type Filter = 'all' | 'upcoming' | 'past';

const filters: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'upcoming', label: 'Предстоящие' },
  { key: 'past', label: 'Прошедшие' },
];

export const Events: React.FC = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');

  const filteredEvents = events.filter(e => {
    if (activeFilter !== 'all' && e.status !== activeFilter) return false;
    if (search && !e.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>События</h1>
        <p className={styles.subtitle}>Конференции и мероприятия</p>
      </div>

      <div className={styles.searchWrap}>
        <Search size={18} className={styles.searchIcon} />
        <input
          type="text"
          placeholder="Поиск событий..."
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Sreda Banner */}
      <div className={styles.sredaBanner} onClick={() => navigate('/sreda')}>
        <img src={sredaEvent.heroImage} alt="" className={styles.sredaImg} />
        <div className={styles.sredaOverlay} />
        <div className={styles.sredaContent}>
          <span className={styles.sredaBadge}>Mini-MBA</span>
          <h3 className={styles.sredaTitle}>{sredaEvent.title}</h3>
          <div className={styles.sredaMeta}>
            <Calendar size={12} />
            <span>{sredaEvent.dateRange}</span>
          </div>
          <div className={styles.sredaProgress}>
            <div className={styles.sredaProgressBar}>
              <div className={styles.sredaProgressFill} style={{ width: `${(sredaEvent.completedSessions / sredaEvent.totalSessions) * 100}%` }} />
            </div>
            <span>{sredaEvent.completedSessions}/{sredaEvent.totalSessions} сессий</span>
          </div>
        </div>
        <ChevronRight size={20} className={styles.sredaArrow} />
      </div>

      <div className={styles.filters}>
        {filters.map(f => (
          <button
            key={f.key}
            className={`${styles.filterPill} ${activeFilter === f.key ? styles.filterActive : ''}`}
            onClick={() => setActiveFilter(f.key)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {filteredEvents.map((event, i) => (
          <div key={event.id} style={{ animationDelay: `${i * 0.08}s` }}>
            <EventCard
              event={event}
              variant={i === 0 && activeFilter !== 'past' ? 'large' : 'compact'}
              onClick={() => navigate(`/events/${event.id}`)}
            />
          </div>
        ))}
        {filteredEvents.length === 0 && (
          <div className={styles.empty}>
            <p>Событий не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
};
