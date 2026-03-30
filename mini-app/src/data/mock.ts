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

export interface Person {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  bio: string;
  interests: string[];
  telegram?: string;
  linkedin?: string;
  website?: string;
  category: 'speaker' | 'participant' | 'company';
  eventsAttended: number;
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

export const people: Person[] = [
  {
    id: 'p1',
    name: 'Кирилл Сенников',
    role: 'Руководитель',
    company: 'pickme.agency',
    avatar: 'https://i.pravatar.cc/150?img=12',
    bio: 'Руководитель маркетингового агентства. Специализируюсь на performance-маркетинге и growth hacking.',
    interests: ['Маркетинг', 'Growth', 'Digital'],
    telegram: '@kirill_s',
    category: 'participant',
    eventsAttended: 8,
  },
  {
    id: 'p2',
    name: 'Анастасия Белочкина',
    role: 'Бизнес-стратег',
    company: 'Scale Consulting',
    avatar: 'https://i.pravatar.cc/150?img=1',
    bio: 'Помогаю бизнесам масштабироваться системно. 15+ лет опыта в стратегическом консалтинге.',
    interests: ['Стратегия', 'Масштабирование', 'Менеджмент'],
    telegram: '@nastya_bel',
    linkedin: 'anastasia-belochkina',
    category: 'speaker',
    eventsAttended: 12,
  },
  {
    id: 'p3',
    name: 'Дмитрий Козлов',
    role: 'CEO',
    company: 'TechVentures',
    avatar: 'https://i.pravatar.cc/150?img=3',
    bio: 'Строю технологические компании. Инвестирую в AI-стартапы.',
    interests: ['AI', 'Стартапы', 'Инвестиции'],
    linkedin: 'dmitry-kozlov',
    website: 'techventures.by',
    category: 'speaker',
    eventsAttended: 6,
  },
  {
    id: 'p4',
    name: 'Мария Соколова',
    role: 'Основатель',
    company: 'DigitalBridge',
    avatar: 'https://i.pravatar.cc/150?img=5',
    bio: 'Помогаю малому бизнесу перейти в цифру. Запустила 50+ проектов цифровой трансформации.',
    interests: ['Digital', 'Трансформация', 'SMB'],
    telegram: '@maria_sok',
    category: 'speaker',
    eventsAttended: 4,
  },
  {
    id: 'p5',
    name: 'Алексей Петров',
    role: 'Инвестор',
    company: 'StartFund',
    avatar: 'https://i.pravatar.cc/150?img=8',
    bio: 'Управляющий партнер венчурного фонда. Портфель: 30+ компаний в СНГ.',
    interests: ['Инвестиции', 'Стартапы', 'Финтех'],
    category: 'speaker',
    eventsAttended: 5,
  },
  {
    id: 'p6',
    name: 'Елена Власова',
    role: 'HR-директор',
    company: 'PeopleFirst',
    avatar: 'https://i.pravatar.cc/150?img=9',
    bio: 'Создаю корпоративные культуры, которые привлекают лучших. 10+ лет в HR-консалтинге.',
    interests: ['HR', 'Культура', 'Лидерство'],
    telegram: '@elena_vl',
    category: 'speaker',
    eventsAttended: 3,
  },
  {
    id: 'p7',
    name: 'Артем Романчук',
    role: 'Директор по развитию',
    company: 'SmartLogistics',
    avatar: 'https://i.pravatar.cc/150?img=15',
    bio: 'Развиваю логистические решения для e-commerce. Оптимизирую цепочки поставок.',
    interests: ['Логистика', 'E-commerce', 'Оптимизация'],
    category: 'participant',
    eventsAttended: 5,
  },
  {
    id: 'p8',
    name: 'Марина Макарчук',
    role: 'Основатель',
    company: 'Favorit Catering',
    avatar: 'https://i.pravatar.cc/150?img=20',
    bio: 'Создаю гастрономические впечатления для бизнес-мероприятий. Кейтеринг премиум-класса.',
    interests: ['HoReCa', 'Event', 'B2B'],
    telegram: '@marina_fav',
    category: 'participant',
    eventsAttended: 10,
  },
  {
    id: 'p9',
    name: 'Дарья Давыденко',
    role: 'Менеджер проектов',
    company: 'Anomalia Team',
    avatar: 'https://i.pravatar.cc/150?img=25',
    bio: 'Организую мероприятия и управляю креативными проектами. Anomalia Talks — мой главный проект.',
    interests: ['Event', 'Креатив', 'Коммуникации'],
    category: 'participant',
    eventsAttended: 7,
  },
  {
    id: 'p10',
    name: 'Никита Громов',
    role: 'CTO',
    company: 'CloudSys',
    avatar: 'https://i.pravatar.cc/150?img=30',
    bio: 'Архитектор облачных решений. Помогаю компаниям мигрировать в облако.',
    interests: ['Cloud', 'DevOps', 'Технологии'],
    telegram: '@nikita_gr',
    category: 'participant',
    eventsAttended: 4,
  },
  {
    id: 'p11',
    name: 'Ольга Крайнова',
    role: 'Финансовый консультант',
    company: 'FinGrowth',
    avatar: 'https://i.pravatar.cc/150?img=32',
    bio: 'Помогаю бизнесам структурировать финансы и привлекать инвестиции.',
    interests: ['Финансы', 'Инвестиции', 'Консалтинг'],
    category: 'participant',
    eventsAttended: 6,
  },
  {
    id: 'p12',
    name: 'Павел Жуков',
    role: 'Основатель',
    company: 'EduTech Lab',
    avatar: 'https://i.pravatar.cc/150?img=33',
    bio: 'Создаю EdTech-продукты для корпоративного обучения. Выпустил 20+ онлайн-курсов.',
    interests: ['EdTech', 'Обучение', 'Продукт'],
    telegram: '@pavel_zh',
    category: 'participant',
    eventsAttended: 9,
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
