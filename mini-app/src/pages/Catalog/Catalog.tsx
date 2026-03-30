import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { PersonCard } from '../../components/PersonCard/PersonCard';
import { people } from '../../data/mock';
import styles from './Catalog.module.css';

type Category = 'all' | 'speaker' | 'participant' | 'company';

const categories: { key: Category; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'speaker', label: 'Спикеры' },
  { key: 'participant', label: 'Участники' },
  { key: 'company', label: 'Компании' },
];

export const Catalog: React.FC = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('all');

  const filtered = useMemo(() => {
    return people.filter(p => {
      if (category !== 'all' && p.category !== category) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.company.toLowerCase().includes(q) ||
          p.role.toLowerCase().includes(q) ||
          p.interests.some(t => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [search, category]);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Каталог</h1>
        <p className={styles.subtitle}>Спикеры и участники сообщества</p>
      </div>

      <div className={styles.searchRow}>
        <div className={styles.searchWrap}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Имя, компания, навыки..."
            className={styles.searchInput}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button className={styles.filterBtn}>
          <SlidersHorizontal size={18} />
        </button>
      </div>

      <div className={styles.categories}>
        {categories.map(c => (
          <button
            key={c.key}
            className={`${styles.categoryPill} ${category === c.key ? styles.categoryActive : ''}`}
            onClick={() => setCategory(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className={styles.count}>
        {filtered.length} {filtered.length === 1 ? 'человек' : 'человек'}
      </div>

      <div className={styles.list}>
        {filtered.map((person, i) => (
          <div key={person.id} style={{ animationDelay: `${i * 0.05}s` }}>
            <PersonCard person={person} />
          </div>
        ))}
        {filtered.length === 0 && (
          <div className={styles.empty}>
            <p>Никого не найдено</p>
          </div>
        )}
      </div>
    </div>
  );
};
