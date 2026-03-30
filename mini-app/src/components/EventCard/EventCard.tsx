import React from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Badge } from '../ui/Badge';
import type { Event } from '../../data/mock';
import styles from './EventCard.module.css';

interface EventCardProps {
  event: Event;
  onClick: () => void;
  variant?: 'large' | 'compact';
}

export const EventCard: React.FC<EventCardProps> = ({ event, onClick, variant = 'compact' }) => {
  const progress = Math.round((event.attendees / event.maxAttendees) * 100);

  if (variant === 'large') {
    return (
      <div className={styles.cardLarge} onClick={onClick}>
        <div className={styles.imageWrap}>
          <img src={event.image} alt={event.title} className={styles.image} />
          <div className={styles.imageOverlay} />
          <Badge variant={event.status === 'upcoming' ? 'green' : 'default'} size="md">
            {event.status === 'upcoming' ? 'Скоро' : 'Прошло'}
          </Badge>
        </div>
        <div className={styles.contentLarge}>
          <h3 className={styles.titleLarge}>{event.title}</h3>
          <p className={styles.subtitle}>{event.subtitle}</p>
          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <Calendar size={14} />
              <span>{event.date}</span>
            </div>
            <div className={styles.metaItem}>
              <MapPin size={14} />
              <span>{event.location}</span>
            </div>
          </div>
          <div className={styles.footer}>
            <div className={styles.attendees}>
              <Users size={14} />
              <span>{event.attendees}/{event.maxAttendees}</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
            <span className={styles.price}>{event.price}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.thumbWrap}>
        <img src={event.image} alt={event.title} className={styles.thumb} />
        {event.status === 'upcoming' && <div className={styles.dot} />}
      </div>
      <div className={styles.content}>
        <h4 className={styles.title}>{event.title}</h4>
        <div className={styles.metaItem}>
          <Calendar size={12} />
          <span>{event.date}</span>
        </div>
        <div className={styles.metaItem}>
          <MapPin size={12} />
          <span>{event.location}</span>
        </div>
      </div>
      <div className={styles.priceCompact}>{event.price}</div>
    </div>
  );
};
