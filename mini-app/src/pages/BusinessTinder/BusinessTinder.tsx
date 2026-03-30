import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Heart, MessageCircle, Users, ChevronDown, UserPlus } from 'lucide-react';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { people } from '../../data/mock';
import { useTelegram } from '../../hooks/useTelegram';
import { useProfile } from '../../store/profileStore';
import styles from './BusinessTinder.module.css';

type View = 'swipe' | 'matches';

interface Match {
  person: typeof people[0];
  timestamp: Date;
}

export const BusinessTinder: React.FC = () => {
  const navigate = useNavigate();
  const { sendData, haptic, isAvailable } = useTelegram();
  const [profile] = useProfile();
  const [view, setView] = useState<View>('swipe');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDir, setSwipeDir] = useState<'left' | 'right' | null>(null);
  const [matches, setMatches] = useState<Match[]>([
    { person: people[1], timestamp: new Date('2026-03-28') },
    { person: people[3], timestamp: new Date('2026-03-25') },
  ]);
  const [showMatch, setShowMatch] = useState(false);
  const [expandedCard, setExpandedCard] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

  const currentPerson = people[currentIndex % people.length];

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    setSwipeDir(direction);
    if (isAvailable) {
      haptic.impact(direction === 'right' ? 'medium' : 'light');
    }
    if (direction === 'right' && Math.random() > 0.4) {
      setTimeout(() => {
        setShowMatch(true);
        setMatches(prev => [{ person: currentPerson, timestamp: new Date() }, ...prev]);
        if (isAvailable) {
          haptic.notification('success');
          sendData({ action: 'new_match', person_name: currentPerson.name, person_id: currentPerson.id });
        }
      }, 400);
    }
    setTimeout(() => {
      setSwipeDir(null);
      setCurrentIndex(prev => prev + 1);
      setExpandedCard(false);
    }, 350);
  }, [currentPerson]);

  const onTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || !cardRef.current) return;
    currentX.current = e.touches[0].clientX - startX.current;
    const rotation = currentX.current * 0.08;
    cardRef.current.style.transform = `translateX(${currentX.current}px) rotate(${rotation}deg)`;
    cardRef.current.style.transition = 'none';
  };

  const onTouchEnd = () => {
    isDragging.current = false;
    if (!cardRef.current) return;
    cardRef.current.style.transition = 'transform 0.3s ease';
    if (Math.abs(currentX.current) > 100) {
      handleSwipe(currentX.current > 0 ? 'right' : 'left');
    } else {
      cardRef.current.style.transform = 'translateX(0) rotate(0)';
    }
    currentX.current = 0;
  };

  // Gate: profile must be complete
  if (!profile.isComplete) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <h1 className={styles.title}>Бизнес-тиндер</h1>
          <p className={styles.subtitle}>Находите полезные контакты</p>
        </div>
        <div className={styles.gateCard}>
          <div className={styles.gateIcon}><UserPlus size={40} /></div>
          <h3 className={styles.gateTitle}>Заполните профиль</h3>
          <p className={styles.gateText}>
            Чтобы участвовать в бизнес-тиндере, нужно заполнить визитку.
            Другие участники увидят ваш профиль и смогут с вами связаться.
          </p>
          <div className={styles.gateProgress}>
            <div className={styles.gateProgressBar}>
              <div className={styles.gateProgressFill} style={{ width: `${(profile.completeness / 5) * 100}%` }} />
            </div>
            <span className={styles.gateProgressText}>{profile.completeness}/5 полей заполнено</span>
          </div>
          <Button variant="primary" size="lg" fullWidth onClick={() => navigate('/edit-profile')} icon={<UserPlus size={18} />}>
            {profile.completeness > 0 ? 'Дозаполнить профиль' : 'Создать профиль'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Бизнес-тиндер</h1>
        <p className={styles.subtitle}>Находите полезные контакты</p>
      </div>

      {/* View Toggle */}
      <div className={styles.viewToggle}>
        <button
          className={`${styles.toggleBtn} ${view === 'swipe' ? styles.toggleActive : ''}`}
          onClick={() => setView('swipe')}
        >
          <Heart size={16} /> Поиск
        </button>
        <button
          className={`${styles.toggleBtn} ${view === 'matches' ? styles.toggleActive : ''}`}
          onClick={() => setView('matches')}
        >
          <Users size={16} /> Контакты ({matches.length})
        </button>
      </div>

      {/* Swipe View */}
      {view === 'swipe' && (
        <div className={styles.swipeContainer}>
          {/* Card Stack */}
          <div className={styles.cardStack}>
            {/* Background card */}
            <div className={styles.bgCard} />

            {/* Main card */}
            <div
              ref={cardRef}
              className={`${styles.card} ${swipeDir === 'left' ? styles.swipeLeft : ''} ${swipeDir === 'right' ? styles.swipeRight : ''}`}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
            >
              {/* Swipe indicators */}
              <div className={`${styles.swipeLabel} ${styles.likeLabel}`}>
                <Heart size={24} />
                <span>CONNECT</span>
              </div>
              <div className={`${styles.swipeLabel} ${styles.skipLabel}`}>
                <X size={24} />
                <span>SKIP</span>
              </div>

              <div className={styles.cardAvatar}>
                <img src={currentPerson.avatar} alt={currentPerson.name} className={styles.cardPhoto} />
                <div className={styles.cardPhotoOverlay} />
              </div>

              <div className={styles.cardBody}>
                <div className={styles.cardNameRow}>
                  <h3 className={styles.cardName}>{currentPerson.name}</h3>
                  <Badge variant="green" size="sm">{currentPerson.category === 'speaker' ? 'Спикер' : 'Участник'}</Badge>
                </div>
                <p className={styles.cardRole}>{currentPerson.role} @ {currentPerson.company}</p>

                <button
                  className={styles.expandToggle}
                  onClick={(e) => { e.stopPropagation(); setExpandedCard(!expandedCard); }}
                >
                  <span>Подробнее</span>
                  <ChevronDown size={16} className={expandedCard ? styles.expandedIcon : ''} />
                </button>

                {expandedCard && (
                  <div className={styles.expandedContent}>
                    <p className={styles.cardBio}>{currentPerson.bio}</p>
                    <div className={styles.cardTags}>
                      {currentPerson.interests.map(tag => (
                        <span key={tag} className={styles.cardTag}>{tag}</span>
                      ))}
                    </div>
                    <div className={styles.cardStats}>
                      <span>{currentPerson.eventsAttended} мероприятий</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            <button className={`${styles.actionBtn} ${styles.skipBtn}`} onClick={() => handleSwipe('left')}>
              <X size={28} />
            </button>
            <button className={`${styles.actionBtn} ${styles.likeBtn}`} onClick={() => handleSwipe('right')}>
              <Heart size={28} />
            </button>
          </div>
        </div>
      )}

      {/* Matches View */}
      {view === 'matches' && (
        <div className={styles.matchesList}>
          {matches.length === 0 ? (
            <div className={styles.emptyMatches}>
              <Heart size={40} className={styles.emptyIcon} />
              <p>Пока нет контактов</p>
              <span>Свайпайте вправо, чтобы познакомиться</span>
            </div>
          ) : (
            matches.map((match, i) => (
              <div key={`${match.person.id}-${i}`} className={styles.matchCard} style={{ animationDelay: `${i * 0.08}s` }}>
                <Avatar src={match.person.avatar} name={match.person.name} size="md" border />
                <div className={styles.matchInfo}>
                  <span className={styles.matchName}>{match.person.name}</span>
                  <span className={styles.matchRole}>{match.person.role} @ {match.person.company}</span>
                </div>
                <button className={styles.matchMsgBtn}>
                  <MessageCircle size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      )}

      {/* Match Popup */}
      {showMatch && (
        <div className={styles.matchOverlay} onClick={() => setShowMatch(false)}>
          <div className={styles.matchPopup}>
            <div className={styles.matchEmoji}>🤝</div>
            <h2 className={styles.matchTitle}>Новый контакт!</h2>
            <p className={styles.matchText}>
              Вы и {currentPerson.name} хотите познакомиться
            </p>
            <button className={styles.matchCloseBtn} onClick={() => setShowMatch(false)}>
              Отлично!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
