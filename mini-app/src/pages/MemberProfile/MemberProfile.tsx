import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Share2, Briefcase, Building2, Calendar,
  Lock, Heart, MessageCircle, ExternalLink, CheckCircle2
} from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { people } from '../../data/mock';
import { useTelegram } from '../../hooks/useTelegram';
import styles from './MemberProfile.module.css';

export const MemberProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { haptic, sendData, backButton, isAvailable } = useTelegram();
  const [liked, setLiked] = useState(false);
  const [showContacts, setShowContacts] = useState(false);

  const person = people.find(p => p.id === id);

  useEffect(() => {
    if (isAvailable) {
      backButton.show(() => navigate(-1));
    }
    return () => {
      if (isAvailable) backButton.hide();
    };
  }, []);

  if (!person) {
    return (
      <div className={styles.notFound}>
        <p>Участник не найден</p>
        <Button variant="secondary" onClick={() => navigate('/catalog')}>Назад к каталогу</Button>
      </div>
    );
  }

  const unlockedCount = person.achievements.filter(a => a.unlocked).length;
  const totalCount = person.achievements.length;

  const handleLike = () => {
    setLiked(true);
    if (isAvailable) {
      haptic.notification('success');
      sendData({ action: 'new_match', person_name: person.name, person_id: person.id });
    }
    // Simulate mutual match — show contacts
    if (!person.contactsHidden || Math.random() > 0.5) {
      setTimeout(() => setShowContacts(true), 600);
    }
  };

  const handleShare = () => {
    if (isAvailable) haptic.impact('light');
    if (navigator.share) {
      navigator.share({
        title: `${person.name} — Growing`,
        text: `${person.name}, ${person.role} @ ${person.company}`,
      });
    }
  };

  return (
    <div className={styles.page}>
      {/* Cover Photo + Avatar */}
      <div className={styles.coverSection}>
        <div className={styles.coverWrap}>
          {person.coverPhoto ? (
            <img src={person.coverPhoto} alt="" className={styles.coverImg} />
          ) : (
            <div className={styles.coverFallback} />
          )}
          <div className={styles.coverOverlay} />
        </div>

        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>

        <button className={styles.shareBtn} onClick={handleShare}>
          <Share2 size={18} />
        </button>

        {/* Name overlay on cover */}
        <div className={styles.nameOverlay}>
          <div className={styles.nameRow}>
            <h1 className={styles.name}>{person.name}</h1>
            {person.verified && (
              <div className={styles.verifiedBadge}>
                <CheckCircle2 size={18} />
              </div>
            )}
          </div>
          <div className={styles.roleRow}>
            <Briefcase size={13} />
            <span>{person.role}</span>
            <span className={styles.dot}>·</span>
            <Building2 size={13} />
            <span>{person.company}</span>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className={styles.statusBar}>
        <Badge variant={person.category === 'speaker' ? 'green' : 'blue'} size="md">
          {person.category === 'speaker' ? '🔥 Спикер' : '⚡ Active Member'}
        </Badge>
        <div className={styles.eventsCount}>
          <Calendar size={14} />
          <span>{person.eventsAttended}</span>
        </div>
      </div>

      {/* Industry */}
      <div className={styles.section}>
        <div className={styles.industryTag}>
          <Building2 size={14} />
          <span>{person.industry}</span>
        </div>
      </div>

      {/* About */}
      <div className={styles.section}>
        <div className={styles.card}>
          <span className={styles.cardLabel}>О СЕБЕ</span>
          <p className={styles.bioText}>{person.bio}</p>
        </div>
      </div>

      {/* Skills */}
      {person.skills.length > 0 && (
        <div className={styles.section}>
          <div className={styles.card}>
            <span className={styles.cardLabel}>
              <span className={styles.cardLabelIcon}>✦</span> НАВЫКИ И КОМПЕТЕНЦИИ
            </span>
            <div className={styles.skillsGrid}>
              {person.skills.map(skill => (
                <span key={skill} className={styles.skillTag}>{skill}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className={styles.section}>
        <div className={styles.card}>
          <div className={styles.achievementsHeader}>
            <span className={styles.cardLabel}>
              <span className={styles.cardLabelIcon}>🏆</span> ДОСТИЖЕНИЯ
            </span>
            <span className={styles.achievementsCount}>{unlockedCount}/{totalCount}</span>
          </div>
          <div className={styles.achievementsGrid}>
            {person.achievements.map(ach => (
              <div
                key={ach.id}
                className={`${styles.achievementItem} ${ach.unlocked ? styles.achievementUnlocked : styles.achievementLocked}`}
                title={ach.label}
              >
                <span className={styles.achievementIcon}>{ach.icon}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contacts */}
      <div className={styles.section}>
        <div className={styles.card}>
          {(!person.contactsHidden || showContacts || liked) && (person.telegram || person.linkedin || person.website) ? (
            <div className={styles.contactsList}>
              <span className={styles.cardLabel}>КОНТАКТЫ</span>
              {person.telegram && (
                <div className={styles.contactItem}>
                  <MessageCircle size={16} className={styles.contactIcon} />
                  <span>{person.telegram}</span>
                </div>
              )}
              {person.linkedin && (
                <div className={styles.contactItem}>
                  <ExternalLink size={16} className={styles.contactIcon} />
                  <span>linkedin.com/in/{person.linkedin}</span>
                </div>
              )}
              {person.website && (
                <div className={styles.contactItem}>
                  <ExternalLink size={16} className={styles.contactIcon} />
                  <span>{person.website}</span>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.contactsHidden}>
              <div className={styles.lockIcon}>
                <Lock size={22} />
              </div>
              <div className={styles.lockText}>
                <span className={styles.lockTitle}>Контакты скрыты</span>
                <span className={styles.lockSubtitle}>
                  Поставьте лайк — при взаимном интересе контакты откроются
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Like Button */}
      <div className={styles.likeSection}>
        {liked ? (
          <div className={styles.likedBanner}>
            <Heart size={20} fill="currentColor" />
            <span>Вы проявили интерес!</span>
          </div>
        ) : (
          <button className={styles.likeButton} onClick={handleLike}>
            <Heart size={22} />
            <span>Поставить лайк</span>
          </button>
        )}
      </div>

      {/* Member Since */}
      <div className={styles.memberSince}>
        Участник с {person.memberSince}
      </div>

      <div style={{ height: 20 }} />
    </div>
  );
};
