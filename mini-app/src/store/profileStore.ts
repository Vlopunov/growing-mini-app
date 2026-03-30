import { useState, useEffect } from 'react';

export interface UserProfile {
  photoUrl: string;
  firstName: string;
  lastName: string;
  company: string;
  role: string;
  customRole: string;
  industry: string;
  skills: string[];
  bio: string;
  telegram: string;
  linkedin: string;
  website: string;
  phone: string;
  isComplete: boolean;
  completeness: number;
}

const STORAGE_KEY = 'growing_profile';

const defaultProfile: UserProfile = {
  photoUrl: '',
  firstName: '',
  lastName: '',
  company: '',
  role: '',
  customRole: '',
  industry: '',
  skills: [],
  bio: '',
  telegram: '',
  linkedin: '',
  website: '',
  phone: '',
  isComplete: false,
  completeness: 0,
};

function calcCompleteness(p: UserProfile): number {
  let filled = 0;
  if (p.firstName && p.lastName) filled++;
  if (p.company) filled++;
  if (p.role || p.customRole) filled++;
  if (p.industry) filled++;
  if (p.bio) filled++;
  return filled;
}

function loadProfile(): UserProfile {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      const completeness = calcCompleteness(parsed);
      return { ...defaultProfile, ...parsed, completeness, isComplete: completeness >= 5 };
    }
  } catch { /* ignore */ }
  return { ...defaultProfile };
}

export function saveProfile(profile: UserProfile): UserProfile {
  const completeness = calcCompleteness(profile);
  const updated = { ...profile, completeness, isComplete: completeness >= 5 };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('profile-updated'));
  return updated;
}

export function useProfile(): [UserProfile, (p: UserProfile) => void] {
  const [profile, setProfile] = useState<UserProfile>(loadProfile);

  useEffect(() => {
    const handler = () => setProfile(loadProfile());
    window.addEventListener('profile-updated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('profile-updated', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const update = (p: UserProfile) => {
    const updated = saveProfile(p);
    setProfile(updated);
  };

  return [profile, update];
}

export const ROLES = [
  'CEO / Основатель',
  'Директор',
  'CTO / Техдиректор',
  'CMO / Маркдиректор',
  'CFO / Финдиректор',
  'COO / Операционный директор',
  'Руководитель отдела',
  'Менеджер проектов',
  'Бизнес-стратег',
  'Инвестор',
  'Консультант',
  'Фрилансер',
  'Другое',
];

export const INDUSTRIES = [
  'IT / Разработка',
  'Маркетинг / Реклама',
  'Финансы / Инвестиции',
  'E-commerce / Торговля',
  'Консалтинг / Стратегия',
  'HR / Рекрутинг',
  'EdTech / Образование',
  'HoReCa / Общепит',
  'Логистика / Транспорт',
  'Производство',
  'Недвижимость',
  'Медицина / Здоровье',
  'Event / Развлечения',
  'Медиа / Контент',
  'Юриспруденция',
  'Другое',
];
