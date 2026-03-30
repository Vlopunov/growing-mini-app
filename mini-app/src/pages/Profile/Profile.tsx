import React from 'react';
import {
  Edit3, Calendar, Users, Settings, ChevronRight,
  Bell, Shield, LogOut, ExternalLink, Briefcase, MessageCircle, UserPlus, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '../../components/ui/Avatar';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { events, people } from '../../data/mock';
import { useTelegram } from '../../hooks/useTelegram';
import { useProfile } from '../../store/profileStore';
import styles from './Profile.module.css';

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user: tgUser, close, isAvailable } = useTelegram();
  const [savedProfile] = useProfile();

  // Use saved profile data > Telegram data > fallback
  const user = {
    name: savedProfile.firstName
      ? `${savedProfile.firstName} ${savedProfile.lastName}`
      : tgUser?.first_name
        ? `${tgUser.first_name}${tgUser.last_name ? ' ' + tgUser.last_name : ''}`
        : 'Владислав Лопунов',
    avatar: savedProfile.photoUrl || tgUser?.photo_url || 'https://i.pravatar.cc/150?img=53',
    company: savedProfile.company || 'Growing Community',
    role: savedProfile.role || savedProfile.customRole || 'Участник',
    bio: savedProfile.bio || 'Предприниматель. Интересуюсь технологиями, маркетингом и развитием бизнеса.',
    telegram: savedProfile.telegram ? `@${savedProfile.telegram}` : tgUser?.username ? `@${tgUser.username}` : '@vlad_lop',
    eventsCount: 5,
    matchesCount: 8,
  };

  const myEvents = events.filter(e => e.status === 'upcoming').slice(0, 2);
  const myMatches = people.slice(0, 3);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerBg}>
          <div className={styles.headerGlow} />
        </div>
        <div className={styles.headerContent}>
          <div className={styles.avatarWrap}>
            <Avatar src={user.avatar} name={user.name} size="xl" border />
            <button className={styles.editAvatarBtn}>
              <Edit3 size={14} />
            </button>
          </div>
          <h1 className={styles.name}>{user.name}</h1>
          <p className={styles.role}>{user.role} @ {user.company}</p>
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statNum}>{user.eventsCount}</span>
              <span className={styles.statLabel}>События</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <span className={styles.statNum}>{user.matchesCount}</span>
              <span className={styles.statLabel}>Контакты</span>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Completion Banner */}
      {!savedProfile.isComplete && (
        <section className={styles.section}>
          <div className={styles.completionBanner}>
            <div className={styles.completionTop}>
              <AlertCircle size={16} />
              <span>Заполните профиль ({savedProfile.completeness}/5)</span>
            </div>
            <div className={styles.completionBar}>
              <div className={styles.completionFill} style={{ width: `${(savedProfile.completeness / 5) * 100}%` }} />
            </div>
            <Button variant="primary" size="sm" fullWidth onClick={() => navigate('/edit-profile')} icon={<UserPlus size={15} />}>
              {savedProfile.completeness > 0 ? 'Дозаполнить визитку' : 'Создать визитку'}
            </Button>
          </div>
        </section>
      )}

      {/* Business Card */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            <Briefcase size={16} />
            Визитка
          </h3>
          <button className={styles.editBtn} onClick={() => navigate('/edit-profile')}>
            <Edit3 size={14} />
            Изменить
          </button>
        </div>
        <div className={styles.card}>
          <p className={styles.bio}>{user.bio}</p>
          {savedProfile.skills && savedProfile.skills.length > 0 && (
            <div className={styles.profileSkills}>
              {savedProfile.skills.map(s => (
                <span key={s} className={styles.profileSkillTag}>{s}</span>
              ))}
            </div>
          )}
          <div className={styles.contactRow}>
            <MessageCircle size={14} />
            <span>{user.telegram}</span>
          </div>
        </div>
      </section>

      {/* My Events */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            <Calendar size={16} />
            Мои события
          </h3>
          <button className={styles.seeAll} onClick={() => navigate('/events')}>
            Все <ChevronRight size={14} />
          </button>
        </div>
        <div className={styles.eventsList}>
          {myEvents.map(event => (
            <div key={event.id} className={styles.eventMini} onClick={() => navigate(`/events/${event.id}`)}>
              <img src={event.image} alt={event.title} className={styles.eventThumb} />
              <div className={styles.eventInfo}>
                <span className={styles.eventName}>{event.title}</span>
                <span className={styles.eventDate}>{event.date}</span>
              </div>
              <Badge variant="green" size="sm">Иду</Badge>
            </div>
          ))}
        </div>
      </section>

      {/* My Contacts */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>
            <Users size={16} />
            Мои контакты
          </h3>
          <button className={styles.seeAll} onClick={() => navigate('/tinder')}>
            Все <ChevronRight size={14} />
          </button>
        </div>
        <div className={styles.matchesRow}>
          {myMatches.map(person => (
            <div key={person.id} className={styles.matchAvatar}>
              <Avatar src={person.avatar} name={person.name} size="lg" border />
              <span className={styles.matchName}>{person.name.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Settings */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>
          <Settings size={16} />
          Настройки
        </h3>
        <div className={styles.settingsList}>
          <div className={styles.settingItem}>
            <Bell size={18} className={styles.settingIcon} />
            <span>Уведомления</span>
            <ChevronRight size={16} className={styles.settingArrow} />
          </div>
          <div className={styles.settingItem}>
            <Shield size={18} className={styles.settingIcon} />
            <span>Приватность</span>
            <ChevronRight size={16} className={styles.settingArrow} />
          </div>
          <div className={styles.settingItem}>
            <ExternalLink size={18} className={styles.settingIcon} />
            <span>growing.by</span>
            <ChevronRight size={16} className={styles.settingArrow} />
          </div>
          <div className={`${styles.settingItem} ${styles.settingDanger}`} onClick={() => { if (isAvailable) close(); }}>
            <LogOut size={18} className={styles.settingIcon} />
            <span>Закрыть приложение</span>
          </div>
        </div>
      </section>

      <div className={styles.bottomSpacer} />
    </div>
  );
};
