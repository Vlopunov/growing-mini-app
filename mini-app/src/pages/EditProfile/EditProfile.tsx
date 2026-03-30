import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera, User, Building2, Briefcase, Factory, Sparkles,
  FileText, Send, Globe, Phone, Save, Eye, Edit3,
  X, ChevronDown, AlertCircle
} from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { useProfile, saveProfile, ROLES, INDUSTRIES } from '../../store/profileStore';
import { useTelegram } from '../../hooks/useTelegram';
import styles from './EditProfile.module.css';

type View = 'edit' | 'preview';

export const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { user: tgUser, haptic, isAvailable } = useTelegram();
  const [profile] = useProfile();

  const [view, setView] = useState<View>('edit');
  const [photoPreview, setPhotoPreview] = useState<string>(profile.photoUrl || '');
  const [firstName, setFirstName] = useState(profile.firstName || tgUser?.first_name || '');
  const [lastName, setLastName] = useState(profile.lastName || tgUser?.last_name || '');
  const [company, setCompany] = useState(profile.company || '');
  const [role, setRole] = useState(profile.role || '');
  const [customRole, setCustomRole] = useState(profile.customRole || '');
  const [industry, setIndustry] = useState(profile.industry || '');
  const [skills, setSkills] = useState<string[]>(profile.skills || []);
  const [skillInput, setSkillInput] = useState('');
  const [bio, setBio] = useState(profile.bio || '');
  const [telegram, setTelegram] = useState(profile.telegram || tgUser?.username || '');
  const [linkedin, setLinkedin] = useState(profile.linkedin || '');
  const [website, setWebsite] = useState(profile.website || '');
  const [phone, setPhone] = useState(profile.phone || '');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-fill from Telegram on first load
  useEffect(() => {
    if (tgUser && !profile.firstName) {
      if (tgUser.first_name) setFirstName(tgUser.first_name);
      if (tgUser.last_name) setLastName(tgUser.last_name);
      if (tgUser.username) setTelegram(tgUser.username);
      if (tgUser.photo_url) setPhotoPreview(tgUser.photo_url);
    }
  }, [tgUser]);

  // Completeness calc
  const filledCount = [
    firstName && lastName,
    industry,
    role || customRole,
    skills.length > 0,
    bio,
  ].filter(Boolean).length;
  const totalRequired = 5;

  // Missing fields for chips
  const missingFields: string[] = [];
  if (!industry) missingFields.push('Отрасль');
  if (!role && !customRole) missingFields.push('Должность');
  if (skills.length === 0) missingFields.push('Навыки');
  if (!bio) missingFields.push('О себе');

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('Максимальный размер фото: 5 МБ');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPhotoPreview(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && skills.length < 10 && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
      if (isAvailable) haptic.impact('light');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter(s => s !== skill));
  };

  const handleSkillKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const handleSave = () => {
    if (!firstName || !lastName) {
      if (isAvailable) haptic.notification('error');
      return;
    }

    saveProfile({
      ...profile,
      photoUrl: photoPreview,
      firstName,
      lastName,
      company,
      role: role === 'Другое' ? '' : role,
      customRole: role === 'Другое' ? customRole : '',
      industry,
      skills,
      bio,
      telegram,
      linkedin,
      website,
      phone,
      isComplete: false,
      completeness: 0,
    });

    if (isAvailable) haptic.notification('success');
    navigate(-1);
  };

  const displayRole = role === 'Другое' ? customRole : role;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>
          {profile.isComplete ? 'Редактировать профиль' : 'Создать профиль'}
        </h1>

        {/* View Toggle */}
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewBtn} ${view === 'edit' ? styles.viewActive : ''}`}
            onClick={() => setView('edit')}
          >
            <Edit3 size={14} /> Редактировать
          </button>
          <button
            className={`${styles.viewBtn} ${view === 'preview' ? styles.viewActive : ''}`}
            onClick={() => setView('preview')}
          >
            <Eye size={14} /> Предпросмотр
          </button>
        </div>

        {/* Progress */}
        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${(filledCount / totalRequired) * 100}%` }} />
          </div>
          <div className={styles.progressInfo}>
            {missingFields.length > 0 && <AlertCircle size={14} className={styles.progressWarn} />}
            <span>{filledCount}/{totalRequired}</span>
          </div>
        </div>

        {/* Missing field chips */}
        {missingFields.length > 0 && (
          <div className={styles.missingChips}>
            {missingFields.map(f => (
              <span key={f} className={styles.missingChip}>{f}</span>
            ))}
          </div>
        )}
      </div>

      {/* === EDIT VIEW === */}
      {view === 'edit' && (
        <div className={styles.form}>
          {/* Photo */}
          <div className={styles.card}>
            <div className={styles.photoSection}>
              <div className={styles.photoPreview}>
                {photoPreview ? (
                  <img src={photoPreview} alt="" className={styles.photoImg} />
                ) : (
                  <div className={styles.photoPlaceholder}>
                    <Camera size={28} />
                  </div>
                )}
              </div>
              <div className={styles.photoInfo}>
                <span className={styles.photoTitle}>
                  <Camera size={15} /> Фото профиля
                </span>
                <span className={styles.photoHint}>Перетащите фото или нажмите для выбора. Макс. 5 МБ.</span>
                <div className={styles.photoActions}>
                  <button className={styles.uploadBtn} onClick={() => fileInputRef.current?.click()}>
                    Загрузить
                  </button>
                </div>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className={styles.hiddenInput}
              onChange={handlePhotoUpload}
            />
          </div>

          {/* Name + Company + Role */}
          <div className={styles.card}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                <User size={14} /> Имя и фамилия <span className={styles.required}>*</span>
              </label>
              <div className={styles.nameRow}>
                <input
                  className={styles.input}
                  placeholder="Имя"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                />
                <input
                  className={styles.input}
                  placeholder="Фамилия"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                <Building2 size={14} /> Компания
              </label>
              <input
                className={styles.input}
                placeholder="Название компании"
                value={company}
                onChange={e => setCompany(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                <Briefcase size={14} /> Должность
              </label>
              <div className={styles.selectWrap}>
                <select
                  className={styles.select}
                  value={role}
                  onChange={e => setRole(e.target.value)}
                >
                  <option value="">Выберите должность...</option>
                  {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
                <ChevronDown size={16} className={styles.selectArrow} />
              </div>
              {role === 'Другое' && (
                <input
                  className={styles.input}
                  placeholder="Укажите должность"
                  value={customRole}
                  onChange={e => setCustomRole(e.target.value)}
                  style={{ marginTop: 8 }}
                />
              )}
            </div>
          </div>

          {/* Industry + Skills */}
          <div className={styles.card}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                <Factory size={14} /> Отрасль <span className={styles.required}>*</span>
              </label>
              <div className={styles.selectWrap}>
                <select
                  className={styles.select}
                  value={industry}
                  onChange={e => setIndustry(e.target.value)}
                >
                  <option value="">Выберите отрасль...</option>
                  {INDUSTRIES.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                </select>
                <ChevronDown size={16} className={styles.selectArrow} />
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                <Sparkles size={14} /> Навыки и компетенции ({skills.length}/10)
              </label>
              <div className={styles.skillInputRow}>
                <input
                  className={styles.input}
                  placeholder="Введите навык и нажмите Enter..."
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  maxLength={30}
                  disabled={skills.length >= 10}
                />
              </div>
              {skills.length > 0 && (
                <div className={styles.skillTags}>
                  {skills.map(s => (
                    <span key={s} className={styles.skillTag}>
                      {s}
                      <button className={styles.skillRemove} onClick={() => removeSkill(s)}>
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className={styles.card}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>
                <FileText size={14} /> О себе
              </label>
              <textarea
                className={styles.textarea}
                placeholder="Расскажите о своём опыте, чем занимаетесь, что ищете в нетворкинге..."
                value={bio}
                onChange={e => setBio(e.target.value.slice(0, 500))}
                rows={4}
              />
              <span className={styles.charCount}>{bio.length}/500</span>
            </div>
          </div>

          {/* Contacts */}
          <div className={styles.card}>
            <span className={styles.cardSectionTitle}>
              <Globe size={14} /> Контакты и ссылки
            </span>

            <div className={styles.field}>
              <label className={styles.fieldLabelSmall}>
                <Send size={13} /> Telegram username
              </label>
              <input
                className={styles.input}
                placeholder="username"
                value={telegram}
                onChange={e => setTelegram(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabelSmall}>
                <Globe size={13} /> LinkedIn URL
              </label>
              <input
                className={styles.input}
                placeholder="https://linkedin.com/in/..."
                value={linkedin}
                onChange={e => setLinkedin(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabelSmall}>
                <Globe size={13} /> Веб-сайт
              </label>
              <input
                className={styles.input}
                placeholder="https://example.com"
                value={website}
                onChange={e => setWebsite(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabelSmall}>
                <Phone size={13} /> Номер телефона
                <span className={styles.verifyHint}>для верификации</span>
              </label>
              <input
                className={styles.input}
                placeholder="+375..."
                value={phone}
                onChange={e => setPhone(e.target.value)}
                type="tel"
              />
            </div>
          </div>

          {/* Save */}
          <Button variant="primary" size="lg" fullWidth onClick={handleSave} icon={<Save size={18} />}>
            Сохранить профиль
          </Button>
        </div>
      )}

      {/* === PREVIEW VIEW === */}
      {view === 'preview' && (
        <div className={styles.preview}>
          <div className={styles.previewCard}>
            <div className={styles.previewPhoto}>
              {photoPreview ? (
                <img src={photoPreview} alt="" className={styles.previewPhotoImg} />
              ) : (
                <div className={styles.previewPhotoPlaceholder}>
                  <User size={32} />
                </div>
              )}
            </div>
            <h2 className={styles.previewName}>
              {firstName || 'Имя'} {lastName || 'Фамилия'}
            </h2>
            <p className={styles.previewRole}>
              {displayRole || 'Должность'}{company ? `, ${company}` : ''}
            </p>

            {industry && (
              <div className={styles.previewIndustry}>
                <Factory size={13} /> {industry}
              </div>
            )}

            {bio && (
              <div className={styles.previewSection}>
                <span className={styles.previewLabel}>О СЕБЕ</span>
                <p className={styles.previewBio}>{bio}</p>
              </div>
            )}

            {skills.length > 0 && (
              <div className={styles.previewSection}>
                <span className={styles.previewLabel}>НАВЫКИ</span>
                <div className={styles.previewSkills}>
                  {skills.map(s => (
                    <span key={s} className={styles.previewSkillTag}>{s}</span>
                  ))}
                </div>
              </div>
            )}

            {(telegram || linkedin || website) && (
              <div className={styles.previewSection}>
                <span className={styles.previewLabel}>КОНТАКТЫ</span>
                {telegram && <div className={styles.previewContact}><Send size={13} /> @{telegram}</div>}
                {linkedin && <div className={styles.previewContact}><Globe size={13} /> {linkedin}</div>}
                {website && <div className={styles.previewContact}><Globe size={13} /> {website}</div>}
              </div>
            )}
          </div>

          <Button variant="outline" size="md" fullWidth onClick={() => setView('edit')} icon={<Edit3 size={16} />}>
            Вернуться к редактированию
          </Button>
        </div>
      )}

      <div style={{ height: 20 }} />
    </div>
  );
};
