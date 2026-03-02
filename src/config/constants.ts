

export const NAVIGATION = [
  { text: 'О Евгении', url: '/' },
  { text: 'Финансовый аудит', url: '/about' },
  { text: 'Обучение', url: '/blog' },
  { text: 'Контакты', url: '/contact' }
] as const;

export const SOCIAL_LINKS = {
  tel:{
    src:'tel:+79000000000',
    text:'+7 (900) 000-00-00',
  },
  local :{
    src:'',
    text:'432070, Россия, г. Ульяновск, ул. Урицкого, д. 58, 3 этаж',
  },
  email:{
    src:'mailto:mardga@mail.ru',
    text:'mardga@mail.ru',
  },
  tg:"",
};