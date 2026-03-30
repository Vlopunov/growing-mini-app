import React, { useState, useRef, useCallback } from 'react';
import { Gift, Zap, Clock, ShoppingBag, Info, ChevronRight } from 'lucide-react';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { useTelegram } from '../../hooks/useTelegram';
import styles from './Bonuses.module.css';

type Tab = 'wheel' | 'my' | 'shop';

interface Prize {
  label: string;
  color: string;
  textColor: string;
  value: string;
  type: 'discount' | 'points' | 'special' | 'empty';
}

const PRIZES: Prize[] = [
  { label: '10 %',    color: '#2dbc3b', textColor: '#fff', value: '10% скидка на следующее событие', type: 'discount' },
  { label: '—',       color: '#555e6e', textColor: '#999', value: 'Попробуйте завтра', type: 'empty' },
  { label: '10',      color: '#e6a817', textColor: '#fff', value: '10 бонусных баллов', type: 'points' },
  { label: '—',       color: '#555e6e', textColor: '#999', value: 'Попробуйте завтра', type: 'empty' },
  { label: '60 BYN',  color: '#8b5cf6', textColor: '#fff', value: 'Скидка 60 BYN на любое событие', type: 'special' },
  { label: '50 %',    color: '#3b82f6', textColor: '#fff', value: '50% скидка на событие', type: 'discount' },
  { label: '—',       color: '#555e6e', textColor: '#999', value: 'Попробуйте завтра', type: 'empty' },
  { label: '25',      color: '#2dbc3b', textColor: '#fff', value: '25 бонусных баллов', type: 'points' },
];

const CATALOG_ITEMS = [
  { id: 'c1', name: 'Скидка 10% на событие', cost: 50, icon: '🎟️' },
  { id: 'c2', name: 'VIP-место на конференции', cost: 200, icon: '👑' },
  { id: 'c3', name: 'Кофе-брейк 1-на-1 со спикером', cost: 150, icon: '☕' },
  { id: 'c4', name: 'Мерч Growing (футболка)', cost: 100, icon: '👕' },
  { id: 'c5', name: 'Доступ к записям прошлых событий', cost: 75, icon: '🎬' },
  { id: 'c6', name: 'Приоритетная регистрация', cost: 30, icon: '⚡' },
];

const MY_BONUSES = [
  { id: 'b1', label: 'Скидка 10%', date: '28 марта 2026', status: 'active' as const },
  { id: 'b2', label: '25 баллов', date: '25 марта 2026', status: 'used' as const },
];

export const Bonuses: React.FC = () => {
  const { haptic, isAvailable } = useTelegram();
  const [tab, setTab] = useState<Tab>('wheel');
  const [spinsLeft, setSpinsLeft] = useState(1);
  const [points, setPoints] = useState(85);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<Prize | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const segmentAngle = 360 / PRIZES.length;

  const spin = useCallback(() => {
    if (isSpinning || spinsLeft <= 0) return;

    setIsSpinning(true);
    setShowResult(false);
    setResult(null);

    if (isAvailable) haptic.impact('heavy');

    // Pick random prize (weighted — avoid empty more often)
    const weights = PRIZES.map(p => p.type === 'empty' ? 1 : 3);
    const totalWeight = weights.reduce((s, w) => s + w, 0);
    let random = Math.random() * totalWeight;
    let winIndex = 0;
    for (let i = 0; i < weights.length; i++) {
      random -= weights[i];
      if (random <= 0) { winIndex = i; break; }
    }

    // Calculate rotation: multiple full spins + land on prize
    // The wheel top (pointer) corresponds to index 0 at angle 0
    // Each segment center is at segmentAngle * index + segmentAngle/2
    const targetAngle = 360 - (winIndex * segmentAngle + segmentAngle / 2);
    const fullSpins = 5 + Math.floor(Math.random() * 3); // 5-7 full rotations
    const totalRotation = rotation + fullSpins * 360 + targetAngle - (rotation % 360);

    setRotation(totalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setResult(PRIZES[winIndex]);
      setShowResult(true);
      setSpinsLeft(prev => prev - 1);

      if (PRIZES[winIndex].type === 'points') {
        const pts = parseInt(PRIZES[winIndex].label);
        setPoints(prev => prev + pts);
      }

      if (isAvailable) {
        if (PRIZES[winIndex].type === 'empty') {
          haptic.notification('warning');
        } else {
          haptic.notification('success');
        }
      }
    }, 4500);
  }, [isSpinning, spinsLeft, rotation]);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'wheel', label: 'Колесо', icon: <Zap size={15} /> },
    { key: 'my', label: 'Мои бонусы', icon: <Gift size={15} /> },
    { key: 'shop', label: 'Каталог', icon: <ShoppingBag size={15} /> },
  ];

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Бонусы</h1>
        <p className={styles.subtitle}>Крутите колесо за ежедневные привилегии</p>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map(t => (
          <button
            key={t.key}
            className={`${styles.tab} ${tab === t.key ? styles.tabActive : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* === Wheel Tab === */}
      {tab === 'wheel' && (
        <>
          {/* Stats */}
          <div className={styles.statsRow}>
            <div className={styles.statCard}>
              <div className={styles.statIconWrap} style={{ background: 'var(--accent-green-light)', color: 'var(--accent-green)' }}>
                <Zap size={18} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{spinsLeft}/1</span>
                <span className={styles.statLabel}>Спинов/день</span>
              </div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statIconWrap} style={{ background: 'var(--accent-orange-light)', color: 'var(--accent-orange)' }}>
                <Zap size={18} />
              </div>
              <div className={styles.statInfo}>
                <span className={styles.statValue}>{points}</span>
                <span className={styles.statLabel}>Бонусных баллов</span>
              </div>
            </div>
          </div>

          {/* Wheel */}
          <div className={styles.wheelContainer}>
            {/* Pointer */}
            <div className={styles.pointer}>▼</div>

            {/* Wheel SVG */}
            <div
              ref={wheelRef}
              className={styles.wheel}
              style={{
                transform: `rotate(${rotation}deg)`,
                transition: isSpinning ? 'transform 4.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none',
              }}
            >
              <svg viewBox="0 0 300 300" className={styles.wheelSvg}>
                {PRIZES.map((prize, i) => {
                  const startAngle = i * segmentAngle;
                  const endAngle = startAngle + segmentAngle;
                  const startRad = (startAngle - 90) * Math.PI / 180;
                  const endRad = (endAngle - 90) * Math.PI / 180;
                  const x1 = 150 + 140 * Math.cos(startRad);
                  const y1 = 150 + 140 * Math.sin(startRad);
                  const x2 = 150 + 140 * Math.cos(endRad);
                  const y2 = 150 + 140 * Math.sin(endRad);
                  const largeArc = segmentAngle > 180 ? 1 : 0;

                  // Text position at segment center
                  const midRad = ((startAngle + endAngle) / 2 - 90) * Math.PI / 180;
                  const tx = 150 + 95 * Math.cos(midRad);
                  const ty = 150 + 95 * Math.sin(midRad);
                  const textRotation = (startAngle + endAngle) / 2;

                  return (
                    <g key={i}>
                      <path
                        d={`M 150 150 L ${x1} ${y1} A 140 140 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={prize.color}
                        stroke="rgba(0,0,0,0.15)"
                        strokeWidth="1"
                      />
                      {/* Dot decoration */}
                      <circle
                        cx={150 + 130 * Math.cos(midRad)}
                        cy={150 + 130 * Math.sin(midRad)}
                        r="3"
                        fill={prize.textColor}
                        opacity="0.5"
                      />
                      {/* Text */}
                      <text
                        x={tx}
                        y={ty}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill={prize.textColor}
                        fontSize="16"
                        fontWeight="800"
                        fontFamily="Montserrat, sans-serif"
                        transform={`rotate(${textRotation}, ${tx}, ${ty})`}
                      >
                        {prize.label}
                      </text>
                    </g>
                  );
                })}
                {/* Center circle */}
                <circle cx="150" cy="150" r="38" fill="var(--bg-card)" stroke="var(--border)" strokeWidth="2" />
              </svg>

              {/* Center button */}
              <div className={styles.centerBtn}>
                {isSpinning ? (
                  <div className={styles.centerSpinning} />
                ) : spinsLeft > 0 ? (
                  <span className={styles.centerText}>SPIN</span>
                ) : (
                  <span className={styles.centerTextSmall}>Завтра</span>
                )}
              </div>
            </div>

            {/* Spin button overlay (clickable area) */}
            <button
              className={styles.spinTrigger}
              onClick={spin}
              disabled={isSpinning || spinsLeft <= 0}
            />
          </div>

          {/* Status */}
          <div className={styles.wheelStatus}>
            {spinsLeft <= 0 && !showResult && (
              <div className={styles.statusMsg}>
                <Clock size={15} />
                <span>Бесплатные вращения на сегодня использованы</span>
              </div>
            )}
          </div>

          {/* Result Popup */}
          {showResult && result && (
            <div className={styles.resultCard}>
              <div className={styles.resultEmoji}>
                {result.type === 'empty' ? '😔' : result.type === 'special' ? '🎉' : result.type === 'discount' ? '🎟️' : '⭐'}
              </div>
              <span className={styles.resultTitle}>
                {result.type === 'empty' ? 'Не повезло!' : 'Поздравляем!'}
              </span>
              <span className={styles.resultValue}>{result.value}</span>
              {result.type !== 'empty' && (
                <Badge variant="green" size="md">Добавлено в «Мои бонусы»</Badge>
              )}
            </div>
          )}

          {/* Extra spin */}
          <div className={styles.extraSpinCard}>
            <div className={styles.extraSpinHeader}>
              <Zap size={18} className={styles.extraSpinIcon} />
              <span className={styles.extraSpinTitle}>Доп. вращение за баллы</span>
            </div>
            <p className={styles.extraSpinText}>Потратьте 50 бонусных баллов на дополнительное вращение</p>
            <Button
              variant={points >= 50 ? 'primary' : 'secondary'}
              size="md"
              fullWidth
              onClick={() => {
                if (points >= 50) {
                  setPoints(p => p - 50);
                  setSpinsLeft(s => s + 1);
                  if (isAvailable) haptic.notification('success');
                }
              }}
              disabled={points < 50}
            >
              {points >= 50 ? 'Крутить за 50 баллов' : `Нужно 50 баллов (у вас ${points})`}
            </Button>
          </div>

          {/* How it works */}
          <div className={styles.infoCard}>
            <div className={styles.infoHeader}>
              <Info size={16} />
              <span>Как работает Колесо бонусов</span>
            </div>
            <ul className={styles.infoList}>
              <li>Участники комьюнити крутят колесо <strong>1 раз в день</strong></li>
              <li>Выигрывайте скидки, баллы и спецпризы</li>
              <li>Баллы можно обменять на призы в каталоге</li>
              <li>Дополнительные вращения — за 50 баллов</li>
            </ul>
          </div>
        </>
      )}

      {/* === My Bonuses Tab === */}
      {tab === 'my' && (
        <div className={styles.myBonuses}>
          {MY_BONUSES.length === 0 ? (
            <div className={styles.emptyState}>
              <Gift size={40} className={styles.emptyIcon} />
              <p>Пока нет бонусов</p>
              <span>Крутите колесо, чтобы получить первый бонус</span>
            </div>
          ) : (
            MY_BONUSES.map(bonus => (
              <div key={bonus.id} className={styles.bonusItem}>
                <div className={styles.bonusIcon}>
                  <Gift size={20} />
                </div>
                <div className={styles.bonusInfo}>
                  <span className={styles.bonusName}>{bonus.label}</span>
                  <span className={styles.bonusDate}>{bonus.date}</span>
                </div>
                <Badge
                  variant={bonus.status === 'active' ? 'green' : 'default'}
                  size="sm"
                >
                  {bonus.status === 'active' ? 'Активен' : 'Использован'}
                </Badge>
              </div>
            ))
          )}

          <div className={styles.pointsBalance}>
            <span className={styles.pointsLabel}>Ваш баланс</span>
            <span className={styles.pointsValue}>{points} баллов</span>
          </div>
        </div>
      )}

      {/* === Shop Tab === */}
      {tab === 'shop' && (
        <div className={styles.shop}>
          <div className={styles.shopBalance}>
            <Zap size={16} />
            <span>Баланс: <strong>{points} баллов</strong></span>
          </div>
          {CATALOG_ITEMS.map(item => (
            <div key={item.id} className={styles.shopItem}>
              <span className={styles.shopEmoji}>{item.icon}</span>
              <div className={styles.shopInfo}>
                <span className={styles.shopName}>{item.name}</span>
                <span className={styles.shopCost}>{item.cost} баллов</span>
              </div>
              <button
                className={`${styles.shopBuyBtn} ${points >= item.cost ? styles.shopBuyActive : ''}`}
                onClick={() => {
                  if (points >= item.cost) {
                    setPoints(p => p - item.cost);
                    if (isAvailable) haptic.notification('success');
                  }
                }}
                disabled={points < item.cost}
              >
                <ChevronRight size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ height: 20 }} />
    </div>
  );
};
