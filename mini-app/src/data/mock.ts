export interface Event {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  time: string;
  location: string;
  address: string;
  price: string;
  image: string;
  description: string;
  speakers: Speaker[];
  schedule: ScheduleItem[];
  tags: string[];
  status: 'upcoming' | 'past';
  attendees: number;
  maxAttendees: number;
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  topic?: string;
}

export interface ScheduleItem {
  time: string;
  title: string;
  speaker?: string;
}

export interface Achievement {
  id: string;
  icon: string;
  label: string;
  unlocked: boolean;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  coverPhoto?: string;
  bio: string;
  interests: string[];
  skills: string[];
  industry: string;
  telegram?: string;
  linkedin?: string;
  website?: string;
  category: 'speaker' | 'participant' | 'company';
  eventsAttended: number;
  memberSince: string;
  verified: boolean;
  achievements: Achievement[];
  contactsHidden: boolean;
}

export interface NewsItem {
  id: string;
  title: string;
  preview: string;
  date: string;
  channel: string;
}

// ---- Mock Data ----

export const events: Event[] = [
  {
    id: '1',
    title: 'Growing. Focus',
    subtitle: 'Стратегии масштабирования бизнеса в 2026',
    date: '20 апреля 2026',
    time: '10:00 - 18:00',
    location: 'Minsk City Mall',
    address: 'пр-т Победителей, 9, Минск',
    price: '290 BYN',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    description: 'Концентрация на одной ключевой теме — масштабирование бизнеса. Один топ-спикер, глубокое погружение, практические инструменты для внедрения.',
    speakers: [
      {
        id: 's1',
        name: 'Анастасия Белочкина',
        role: 'Бизнес-стратег',
        company: 'Scale Consulting',
        avatar: 'https://i.pravatar.cc/150?img=1',
        topic: 'От стартапа к корпорации: системный подход к масштабированию'
      }
    ],
    schedule: [
      { time: '09:30', title: 'Регистрация и нетворкинг-кофе' },
      { time: '10:00', title: 'Открытие. Приветственное слово' },
      { time: '10:15', title: 'Основной доклад: Стратегии масштабирования', speaker: 'Анастасия Белочкина' },
      { time: '12:00', title: 'Бизнес-ланч и нетворкинг' },
      { time: '13:30', title: 'Практическая сессия: Разбор кейсов' },
      { time: '15:30', title: 'Кофе-брейк' },
      { time: '16:00', title: 'Q&A сессия' },
      { time: '17:00', title: 'Закрытый нетворкинг' },
    ],
    tags: ['Стратегия', 'Масштабирование', 'B2B'],
    status: 'upcoming',
    attendees: 186,
    maxAttendees: 250,
  },
  {
    id: '2',
    title: 'Growing. Trends 2026',
    subtitle: 'Главные бизнес-тренды нового сезона',
    date: '15 мая 2026',
    time: '10:00 - 20:00',
    location: 'Falcon Club',
    address: 'ул. Интернациональная, 21, Минск',
    price: '390 BYN',
    image: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=800&h=400&fit=crop',
    description: 'Масштабная конференция о ключевых бизнес-трендах 2026 года. 5 топ-спикеров, панельные дискуссии, VIP-нетворкинг.',
    speakers: [
      { id: 's2', name: 'Дмитрий Козлов', role: 'CEO', company: 'TechVentures', avatar: 'https://i.pravatar.cc/150?img=3', topic: 'AI в бизнесе: практические кейсы' },
      { id: 's3', name: 'Мария Соколова', role: 'Основатель', company: 'DigitalBridge', avatar: 'https://i.pravatar.cc/150?img=5', topic: 'Цифровая трансформация малого бизнеса' },
      { id: 's4', name: 'Алексей Петров', role: 'Инвестор', company: 'StartFund', avatar: 'https://i.pravatar.cc/150?img=8', topic: 'Венчурный рынок СНГ' },
    ],
    schedule: [
      { time: '09:30', title: 'Регистрация' },
      { time: '10:00', title: 'Открытие конференции' },
      { time: '10:30', title: 'AI в бизнесе', speaker: 'Дмитрий Козлов' },
      { time: '12:00', title: 'Цифровая трансформация', speaker: 'Мария Соколова' },
      { time: '13:30', title: 'Бизнес-ланч' },
      { time: '14:30', title: 'Венчурный рынок СНГ', speaker: 'Алексей Петров' },
      { time: '16:00', title: 'Панельная дискуссия' },
      { time: '17:30', title: 'VIP-нетворкинг' },
    ],
    tags: ['Тренды', 'AI', 'Инвестиции'],
    status: 'upcoming',
    attendees: 312,
    maxAttendees: 400,
  },
  {
    id: '3',
    title: 'Growing. Business Environment',
    subtitle: 'Создание среды для роста бизнеса',
    date: '10 марта 2026',
    time: '10:00 - 17:00',
    location: 'DoubleTree by Hilton',
    address: 'пр-т Победителей, 9, Минск',
    price: '250 BYN',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800&h=400&fit=crop',
    description: 'Камерное мероприятие о создании продуктивной бизнес-среды. Практические воркшопы и разбор реальных кейсов.',
    speakers: [
      { id: 's5', name: 'Елена Власова', role: 'HR-директор', company: 'PeopleFirst', avatar: 'https://i.pravatar.cc/150?img=9', topic: 'Культура как конкурентное преимущество' },
    ],
    schedule: [
      { time: '10:00', title: 'Открытие' },
      { time: '10:30', title: 'Культура компании', speaker: 'Елена Власова' },
      { time: '12:30', title: 'Воркшоп' },
      { time: '14:00', title: 'Обед' },
      { time: '15:00', title: 'Разбор кейсов' },
    ],
    tags: ['HR', 'Культура', 'Менеджмент'],
    status: 'past',
    attendees: 120,
    maxAttendees: 120,
  },
  {
    id: '4',
    title: 'Growing. Marketing Power',
    subtitle: 'Маркетинг, который приносит деньги',
    date: '5 февраля 2026',
    time: '10:00 - 18:00',
    location: 'Marriott Hotel',
    address: 'ул. Кирова, 13, Минск',
    price: '320 BYN',
    image: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop',
    description: 'Глубокое погружение в мир маркетинга: от стратегии до аналитики. Реальные кейсы и инструменты.',
    speakers: [
      { id: 's6', name: 'Игорь Манн', role: 'Маркетолог №1', company: 'Маркетинг Машина', avatar: 'https://i.pravatar.cc/150?img=11' },
    ],
    schedule: [],
    tags: ['Маркетинг', 'Digital', 'Продажи'],
    status: 'past',
    attendees: 280,
    maxAttendees: 300,
  },
];

const defaultAchievements: Achievement[] = [
  { id: 'a1', icon: '📅', label: 'Первое событие', unlocked: true },
  { id: 'a2', icon: '🤝', label: 'Первый контакт', unlocked: true },
  { id: 'a3', icon: '🔗', label: 'Профиль заполнен', unlocked: true },
  { id: 'a4', icon: '🌐', label: 'Нетворкер', unlocked: true },
  { id: 'a5', icon: '🔥', label: '5 событий', unlocked: false },
  { id: 'a6', icon: '✅', label: '10 контактов', unlocked: false },
  { id: 'a7', icon: '⭐', label: 'VIP участник', unlocked: false },
  { id: 'a8', icon: '🎤', label: 'Спикер', unlocked: false },
  { id: 'a9', icon: '💎', label: 'Амбассадор', unlocked: false },
  { id: 'a10', icon: '🏆', label: 'Легенда', unlocked: false },
];

function makeAchievements(unlockedCount: number): Achievement[] {
  return defaultAchievements.map((a, i) => ({ ...a, unlocked: i < unlockedCount }));
}

export const people: Person[] = [
  {
    id: 'p1',
    name: 'Кирилл Сенников',
    role: 'Руководитель',
    company: 'pickme.agency',
    avatar: 'https://i.pravatar.cc/150?img=12',
    coverPhoto: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=400&fit=crop',
    bio: 'Руководитель маркетингового агентства. Специализируюсь на performance-маркетинге и growth hacking.',
    interests: ['Маркетинг', 'Growth', 'Digital'],
    skills: ['Performance', 'Таргетинг', 'Growth Hacking', 'SMM', 'Аналитика'],
    industry: 'Маркетинг / Реклама',
    telegram: '@kirill_s',
    category: 'participant',
    eventsAttended: 8,
    memberSince: 'январь 2025',
    verified: false,
    achievements: makeAchievements(5),
    contactsHidden: true,
  },
  {
    id: 'p2',
    name: 'Анастасия Белочкина',
    role: 'Бизнес-стратег',
    company: 'Scale Consulting',
    avatar: 'https://i.pravatar.cc/150?img=1',
    coverPhoto: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=400&fit=crop',
    bio: 'Помогаю бизнесам масштабироваться системно. 15+ лет опыта в стратегическом консалтинге.',
    interests: ['Стратегия', 'Масштабирование', 'Менеджмент'],
    skills: ['Стратегия', 'Консалтинг', 'M&A', 'Масштабирование', 'Лидерство', 'OKR'],
    industry: 'Консалтинг / Стратегия',
    telegram: '@nastya_bel',
    linkedin: 'anastasia-belochkina',
    category: 'speaker',
    eventsAttended: 12,
    memberSince: 'март 2024',
    verified: true,
    achievements: makeAchievements(8),
    contactsHidden: false,
  },
  {
    id: 'p3',
    name: 'Дмитрий Козлов',
    role: 'CEO',
    company: 'TechVentures',
    avatar: 'https://i.pravatar.cc/150?img=3',
    coverPhoto: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=400&fit=crop',
    bio: 'Строю технологические компании. Инвестирую в AI-стартапы.',
    interests: ['AI', 'Стартапы', 'Инвестиции'],
    skills: ['AI/ML', 'Венчур', 'Стратегия', 'Product', 'Управление'],
    industry: 'IT / Технологии',
    linkedin: 'dmitry-kozlov',
    website: 'techventures.by',
    category: 'speaker',
    eventsAttended: 6,
    memberSince: 'июнь 2024',
    verified: true,
    achievements: makeAchievements(7),
    contactsHidden: false,
  },
  {
    id: 'p4',
    name: 'Мария Соколова',
    role: 'Основатель',
    company: 'DigitalBridge',
    avatar: 'https://i.pravatar.cc/150?img=5',
    coverPhoto: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=400&fit=crop',
    bio: 'Помогаю малому бизнесу перейти в цифру. Запустила 50+ проектов цифровой трансформации.',
    interests: ['Digital', 'Трансформация', 'SMB'],
    skills: ['Digital', 'CRM', 'Автоматизация', 'UX', 'Аналитика'],
    industry: 'Digital / Трансформация',
    telegram: '@maria_sok',
    category: 'speaker',
    eventsAttended: 4,
    memberSince: 'сентябрь 2025',
    verified: true,
    achievements: makeAchievements(6),
    contactsHidden: false,
  },
  {
    id: 'p5',
    name: 'Алексей Петров',
    role: 'Инвестор',
    company: 'StartFund',
    avatar: 'https://i.pravatar.cc/150?img=8',
    coverPhoto: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop',
    bio: 'Управляющий партнер венчурного фонда. Портфель: 30+ компаний в СНГ.',
    interests: ['Инвестиции', 'Стартапы', 'Финтех'],
    skills: ['Венчур', 'Due Diligence', 'Финансы', 'M&A', 'Стартапы'],
    industry: 'Инвестиции / Финансы',
    category: 'speaker',
    eventsAttended: 5,
    memberSince: 'февраль 2025',
    verified: true,
    achievements: makeAchievements(6),
    contactsHidden: true,
  },
  {
    id: 'p6',
    name: 'Елена Власова',
    role: 'HR-директор',
    company: 'PeopleFirst',
    avatar: 'https://i.pravatar.cc/150?img=9',
    coverPhoto: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=800&h=400&fit=crop',
    bio: 'Создаю корпоративные культуры, которые привлекают лучших. 10+ лет в HR-консалтинге.',
    interests: ['HR', 'Культура', 'Лидерство'],
    skills: ['HR', 'Рекрутинг', 'Корп. культура', 'Обучение', 'Лидерство'],
    industry: 'HR / Консалтинг',
    telegram: '@elena_vl',
    category: 'speaker',
    eventsAttended: 3,
    memberSince: 'декабрь 2025',
    verified: false,
    achievements: makeAchievements(4),
    contactsHidden: false,
  },
  {
    id: 'p7',
    name: 'Артем Романчук',
    role: 'Директор по развитию',
    company: 'SmartLogistics',
    avatar: 'https://i.pravatar.cc/150?img=15',
    coverPhoto: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=400&fit=crop',
    bio: 'Развиваю логистические решения для e-commerce. Оптимизирую цепочки поставок.',
    interests: ['Логистика', 'E-commerce', 'Оптимизация'],
    skills: ['Логистика', 'Supply Chain', 'E-com', 'ERP', 'Оптимизация'],
    industry: 'Логистика / E-commerce',
    category: 'participant',
    eventsAttended: 5,
    memberSince: 'октябрь 2025',
    verified: false,
    achievements: makeAchievements(4),
    contactsHidden: true,
  },
  {
    id: 'p8',
    name: 'Марина Макарчук',
    role: 'Основатель',
    company: 'Favorit Catering',
    avatar: 'https://i.pravatar.cc/150?img=20',
    coverPhoto: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=400&fit=crop',
    bio: 'Создаю гастрономические впечатления для бизнес-мероприятий. Кейтеринг премиум-класса.',
    interests: ['HoReCa', 'Event', 'B2B'],
    skills: ['Кейтеринг', 'Event', 'Управление', 'B2B продажи', 'Сервис'],
    industry: 'HoReCa / Event',
    telegram: '@marina_fav',
    category: 'participant',
    eventsAttended: 10,
    memberSince: 'март 2024',
    verified: true,
    achievements: makeAchievements(7),
    contactsHidden: false,
  },
  {
    id: 'p9',
    name: 'Дарья Давыденко',
    role: 'Менеджер проектов',
    company: 'Anomalia Team',
    avatar: 'https://i.pravatar.cc/150?img=25',
    coverPhoto: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&h=400&fit=crop',
    bio: 'Организую мероприятия и управляю креативными проектами. Anomalia Talks — мой главный проект.',
    interests: ['Event', 'Креатив', 'Коммуникации'],
    skills: ['Project Mgmt', 'Event', 'Креатив', 'PR', 'Коммуникации'],
    industry: 'Event / Креатив',
    category: 'participant',
    eventsAttended: 7,
    memberSince: 'июль 2024',
    verified: false,
    achievements: makeAchievements(5),
    contactsHidden: true,
  },
  {
    id: 'p10',
    name: 'Никита Громов',
    role: 'CTO',
    company: 'CloudSys',
    avatar: 'https://i.pravatar.cc/150?img=30',
    coverPhoto: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=400&fit=crop',
    bio: 'Архитектор облачных решений. Помогаю компаниям мигрировать в облако.',
    interests: ['Cloud', 'DevOps', 'Технологии'],
    skills: ['AWS', 'DevOps', 'Kubernetes', 'Архитектура', 'Node.js'],
    industry: 'IT / Разработка',
    telegram: '@nikita_gr',
    category: 'participant',
    eventsAttended: 4,
    memberSince: 'январь 2026',
    verified: false,
    achievements: makeAchievements(3),
    contactsHidden: true,
  },
  {
    id: 'p11',
    name: 'Ольга Крайнова',
    role: 'Финансовый консультант',
    company: 'FinGrowth',
    avatar: 'https://i.pravatar.cc/150?img=32',
    coverPhoto: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop',
    bio: 'Помогаю бизнесам структурировать финансы и привлекать инвестиции.',
    interests: ['Финансы', 'Инвестиции', 'Консалтинг'],
    skills: ['Финмодели', 'Инвестиции', 'Бюджет', 'Аудит', 'Налоги'],
    industry: 'Финансы / Консалтинг',
    category: 'participant',
    eventsAttended: 6,
    memberSince: 'ноябрь 2024',
    verified: false,
    achievements: makeAchievements(5),
    contactsHidden: true,
  },
  {
    id: 'p12',
    name: 'Павел Жуков',
    role: 'Основатель',
    company: 'EduTech Lab',
    avatar: 'https://i.pravatar.cc/150?img=33',
    coverPhoto: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&h=400&fit=crop',
    bio: 'Создаю EdTech-продукты для корпоративного обучения. Выпустил 20+ онлайн-курсов.',
    interests: ['EdTech', 'Обучение', 'Продукт'],
    skills: ['EdTech', 'LMS', 'Курсы', 'Product', 'UX'],
    industry: 'EdTech / Образование',
    telegram: '@pavel_zh',
    category: 'participant',
    eventsAttended: 9,
    memberSince: 'май 2024',
    verified: true,
    achievements: makeAchievements(6),
    contactsHidden: false,
  },
];

export const news: NewsItem[] = [
  {
    id: 'n1',
    title: 'Открыта регистрация на Growing. Focus',
    preview: 'Успейте забронировать место на ближайшее мероприятие. Количество мест ограничено.',
    date: '28 марта 2026',
    channel: 'Анонсы',
  },
  {
    id: 'n2',
    title: 'Favorit Catering ищет новых звезд в команду',
    preview: 'Команда Favorit Catering в поиске новых звезд в свою команду! Подробности в канале вакансий.',
    date: '25 марта 2026',
    channel: 'Вакансии',
  },
  {
    id: 'n3',
    title: 'Anomalia Talks Mini 2.0 — набор спикеров',
    preview: 'Готовы выйти на сцену? Anomalia Team ищет тех, кому есть что сказать.',
    date: '18 марта 2026',
    channel: 'Анонсы',
  },
];

export const communityStats = {
  members: 1464,
  events: 52,
  speakers: 200,
  connections: 3500,
};
