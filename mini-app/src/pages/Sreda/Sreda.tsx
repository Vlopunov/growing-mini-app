import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, MapPin, Clock, Users, Play,
  CheckCircle2, Lock, ChevronRight, Sparkles
} from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { sredaEvent } from '../../data/mock';
import type { SredaSession } from '../../data/mock';
import styles from './Sreda.module.css';

export const Sreda: React.FC = () => {
  const navigate = useNavigate();
  const [expandedSession, setExpandedSession] = useState<string | null>(null);
  const e = sredaEvent;
  const progress = Math.round((e.completedSessions / e.totalSessions) * 100);

  const statusIcon = (s: SredaSession) => {
    if (s.status === 'past') return <CheckCircle2 size={16} className={styles.statusDone} />;
    if (s.status === 'live') return <Play size={16} className={styles.statusLive} />;
    return <Lock size={14} className={styles.statusLocked} />;
  };

  const statusLabel = (s: SredaSession) => {
    if (s.status === 'past') return 'Прошла';
    if (s.status === 'live') return 'Сейчас';
    return 'Скоро';
  };

  return (
    <div className={styles.page}>
      {/* Hero */}
      <div className={styles.hero}>
        <img src={e.heroImage} alt="" className={styles.heroImg} />
        <div className={styles.heroOverlay} />
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <div className={styles.heroContent}>
          <Badge variant="green" size="md">Mini-MBA</Badge>
          <h1 className={styles.heroTitle}>{e.title}</h1>
          <p className={styles.heroSubtitle}>{e.subtitle}</p>
        </div>
      </div>

      {/* Info Bar */}
      <div className={styles.infoBar}>
        <div className={styles.infoItem}>
          <Calendar size={15} />
          <span>{e.dateRange}</span>
        </div>
        <div className={styles.infoItem}>
          <Clock size={15} />
          <span>{e.frequency}</span>
        </div>
        <div className={styles.infoItem}>
          <MapPin size={15} />
          <span>{e.location}</span>
        </div>
        <div className={styles.infoItem}>
          <Users size={15} />
          <span>{e.attendees}/{e.maxAttendees} участников</span>
        </div>
      </div>

      {/* Description */}
      <div className={styles.section}>
        <p className={styles.description}>{e.description}</p>
      </div>

      {/* Tags */}
      <div className={styles.tags}>
        {e.tags.map(tag => (
          <Badge key={tag} variant="default" size="sm">{tag}</Badge>
        ))}
      </div>

      {/* Progress */}
      <div className={styles.section}>
        <div className={styles.progressCard}>
          <div className={styles.progressHeader}>
            <span className={styles.progressTitle}>Прогресс курса</span>
            <span className={styles.progressCount}>{e.completedSessions}/{e.totalSessions}</span>
          </div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }} />
          </div>
          <div className={styles.progressDots}>
            {e.sessions.map((s) => (
              <div
                key={s.id}
                className={`${styles.progressDot} ${s.status === 'past' ? styles.dotDone : s.status === 'live' ? styles.dotLive : ''}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Sessions */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Sparkles size={17} className={styles.sectionIcon} />
          Программа — 10 сессий
        </h2>

        <div className={styles.sessionsList}>
          {e.sessions.map((session) => {
            const isExpanded = expandedSession === session.id;
            return (
              <div
                key={session.id}
                className={`${styles.sessionCard} ${session.status === 'past' ? styles.sessionPast : ''}`}
                onClick={() => setExpandedSession(isExpanded ? null : session.id)}
              >
                {/* Session Image */}
                <div className={styles.sessionImgWrap}>
                  <img src={session.image} alt="" className={styles.sessionImg} />
                  <div className={styles.sessionImgOverlay} />
                  <span className={styles.sessionNumber}>#{session.number}</span>
                </div>

                {/* Session Content */}
                <div className={styles.sessionContent}>
                  <div className={styles.sessionTop}>
                    <div className={styles.sessionMeta}>
                      <span className={styles.sessionDate}>{session.date}</span>
                      <div className={styles.sessionStatus}>
                        {statusIcon(session)}
                        <span>{statusLabel(session)}</span>
                      </div>
                    </div>
                    <h3 className={styles.sessionTopic}>{session.topic}</h3>
                  </div>

                  {/* Speaker mini */}
                  <div className={styles.sessionSpeaker}>
                    <Avatar src={session.speaker.avatar} name={session.speaker.name} size="sm" />
                    <div className={styles.speakerInfo}>
                      <span className={styles.speakerName}>{session.speaker.name}</span>
                      <span className={styles.speakerRole}>{session.speaker.role}, {session.speaker.company}</span>
                    </div>
                    <ChevronRight size={16} className={`${styles.expandArrow} ${isExpanded ? styles.expandArrowOpen : ''}`} />
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className={styles.sessionExpanded}>
                      <p className={styles.sessionDesc}>{session.description}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className={styles.section}>
        <div className={styles.ctaCard}>
          <div className={styles.ctaPrice}>
            <span className={styles.ctaPriceLabel}>Стоимость полного курса</span>
            <span className={styles.ctaPriceValue}>{e.price}</span>
          </div>
          <Button variant="primary" size="lg" fullWidth>
            Купить билет
          </Button>
          <span className={styles.ctaHint}>10 сессий + нетворкинг + материалы</span>
        </div>
      </div>

      {/* Partners */}
      <div className={styles.section}>
        <div className={styles.partners}>
          <span className={styles.partnersLabel}>Совместный проект</span>
          <div className={styles.partnerLogos}>
            <span className={styles.partnerName}>Growing</span>
            <span className={styles.partnerX}>x</span>
            <span className={styles.partnerName}>mooon+</span>
          </div>
        </div>
      </div>

      <div style={{ height: 20 }} />
    </div>
  );
};
