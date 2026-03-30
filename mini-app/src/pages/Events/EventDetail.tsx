import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Clock, Users, Tag } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { events } from '../../data/mock';
import styles from './EventDetail.module.css';

export const EventDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const event = events.find(e => e.id === id);

  if (!event) {
    return (
      <div className={styles.notFound}>
        <p>Событие не найдено</p>
        <Button variant="secondary" onClick={() => navigate('/events')}>Назад к событиям</Button>
      </div>
    );
  }

  const progress = Math.round((event.attendees / event.maxAttendees) * 100);

  return (
    <div className={styles.page}>
      {/* Header Image */}
      <div className={styles.imageWrap}>
        <img src={event.image} alt={event.title} className={styles.image} />
        <div className={styles.overlay} />
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div className={styles.imageBadge}>
          <Badge variant={event.status === 'upcoming' ? 'green' : 'default'} size="md">
            {event.status === 'upcoming' ? 'Предстоящее' : 'Прошедшее'}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h1 className={styles.title}>{event.title}</h1>
        <p className={styles.subtitle}>{event.subtitle}</p>

        {/* Meta */}
        <div className={styles.metaGrid}>
          <div className={styles.metaItem}>
            <Calendar size={16} />
            <span>{event.date}</span>
          </div>
          <div className={styles.metaItem}>
            <Clock size={16} />
            <span>{event.time}</span>
          </div>
          <div className={styles.metaItem}>
            <MapPin size={16} />
            <div>
              <span>{event.location}</span>
              <span className={styles.metaSub}>{event.address}</span>
            </div>
          </div>
          <div className={styles.metaItem}>
            <Users size={16} />
            <div>
              <span>{event.attendees} / {event.maxAttendees} мест</span>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className={styles.tags}>
          <Tag size={14} className={styles.tagIcon} />
          {event.tags.map(tag => (
            <Badge key={tag} variant="default" size="sm">{tag}</Badge>
          ))}
        </div>

        {/* Description */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>О мероприятии</h3>
          <p className={styles.description}>{event.description}</p>
        </div>

        {/* Speakers */}
        {event.speakers.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Спикеры</h3>
            <div className={styles.speakers}>
              {event.speakers.map(speaker => (
                <div key={speaker.id} className={styles.speakerCard}>
                  <Avatar src={speaker.avatar} name={speaker.name} size="lg" border />
                  <div className={styles.speakerInfo}>
                    <span className={styles.speakerName}>{speaker.name}</span>
                    <span className={styles.speakerRole}>{speaker.role} @ {speaker.company}</span>
                    {speaker.topic && <span className={styles.speakerTopic}>{speaker.topic}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Schedule */}
        {event.schedule.length > 0 && (
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Программа</h3>
            <div className={styles.schedule}>
              {event.schedule.map((item, i) => (
                <div key={i} className={styles.scheduleItem}>
                  <span className={styles.scheduleTime}>{item.time}</span>
                  <div className={styles.scheduleLine}>
                    <div className={styles.scheduleDot} />
                    {i < event.schedule.length - 1 && <div className={styles.scheduleConnector} />}
                  </div>
                  <div className={styles.scheduleContent}>
                    <span className={styles.scheduleTitle}>{item.title}</span>
                    {item.speaker && <span className={styles.scheduleSpeaker}>{item.speaker}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Price + CTA */}
        <div className={styles.cta}>
          <div className={styles.priceBlock}>
            <span className={styles.priceLabel}>Стоимость</span>
            <span className={styles.priceValue}>{event.price}</span>
          </div>
          {event.status === 'upcoming' && (
            <Button variant="primary" size="lg" fullWidth>
              Зарегистрироваться
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
