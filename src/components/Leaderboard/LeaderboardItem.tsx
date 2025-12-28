  import React from 'react';
import styles from './LeaderboardItem.module.css';

export type BadgeKind = 'primary' | 'danger' | 'warning' | 'light';

export interface LeaderboardItemProps {
  rank: number;
  title: string;        // school or person name
  subtitle: string;     // location or school
  value: number | string;
  valueLabel: string;   // "Eco-Score" or "Eco-Points"
  badge?: BadgeKind;
  onClick?: () => void;
}

const LeaderboardItem: React.FC<LeaderboardItemProps> = ({ rank, title, subtitle, value, valueLabel, badge = 'light', onClick }) => {
  const badgeClass = `${styles.badge} ${styles[`badge${badge.charAt(0).toUpperCase()}${badge.slice(1)}`]}`;

  return (
    <div
      className={styles.root}
      tabIndex={0}
      role="listitem"
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter') onClick?.(); }}
    >
      <div className={styles.rankBadge}>
        <span className={badgeClass}>{rank}</span>
      </div>

      <div className={styles.itemInfo}>
        <h6 className={styles.itemName}>{title}</h6>
        <small className={styles.itemLocation}>{subtitle}</small>
      </div>

      <div className={styles.itemScore}>
        <div className={styles.scoreValue}>{typeof value === 'number' ? value.toLocaleString('id-ID') : value}</div>
        <small className={styles.scoreLabel}>{valueLabel}</small>
      </div>
    </div>
  );
};

export default LeaderboardItem;
