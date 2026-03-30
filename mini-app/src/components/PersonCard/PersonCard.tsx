import React from 'react';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import type { Person } from '../../data/mock';
import styles from './PersonCard.module.css';

interface PersonCardProps {
  person: Person;
  onClick?: () => void;
}

export const PersonCard: React.FC<PersonCardProps> = ({ person, onClick }) => {
  const categoryLabel = {
    speaker: 'Спикер',
    participant: 'Участник',
    company: 'Компания',
  };

  const categoryVariant = {
    speaker: 'green' as const,
    participant: 'blue' as const,
    company: 'orange' as const,
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <Avatar src={person.avatar} name={person.name} size="md" />
      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{person.name}</span>
          <Badge variant={categoryVariant[person.category]} size="sm">
            {categoryLabel[person.category]}
          </Badge>
        </div>
        <span className={styles.role}>{person.role} @ {person.company}</span>
        <div className={styles.tags}>
          {person.interests.slice(0, 3).map((tag) => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
