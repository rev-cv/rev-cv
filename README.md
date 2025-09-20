# Revin Portfolio Website

Современный персональный сайт-портфолио на Astro с поддержкой множественных ролей разработчика.

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Предварительный просмотр сборки
npm run preview
```

## 📋 Возможности

- **Множественные роли разработчика** - переключение между React Developer, Frontend Developer, Python Developer
- **Интерактивный интерфейс** - анимированные переходы и hover-эффекты
- **Адаптивный дизайн** - корректное отображение на всех устройствах
- **SEO-оптимизация** - семантическая разметка и мета-теги
- **Современный стек** - Astro, TypeScript, SCSS

## 🛠 Технологии

- **Astro 5.13.7** - современный фреймворк для статических сайтов
- **TypeScript** - типизированный JavaScript
- **SCSS** - препроцессор CSS с переменными и миксинами
- **CSS Grid/Flexbox** - современная верстка
- **Vite** - быстрая сборка и HMR

## 📁 Структура проекта

```
src/
├── components/          # Переиспользуемые компоненты
│   ├── Header.astro    # Навигация
│   ├── HeroBanner.astro # Главный баннер
│   └── Welcome.astro   # Приветственный блок
├── data/               # JSON данные
│   ├── contacts.json   # Контактная информация
│   └── portfolios/     # Данные портфолио
├── layouts/            # Шаблоны страниц
│   └── Layout.astro    # Базовый шаблон
├── pages/              # Страницы сайта
│   └── index.astro     # Главная страница
├── styles/             # Стили
│   ├── colors.scss     # Цветовая палитра
│   ├── reset.css       # Сброс стилей
│   └── page-container.css # Контейнеры
└── types/              # TypeScript типы
    └── TypePortfolio.ts # Типы портфолио
```

## 🎨 Кастомизация

### Добавление новой роли разработчика

1. Создайте JSON файл в `src/data/portfolios/`:
```json
{
    "jobtitle": "Vue Developer",
    "description": "Создаю современные приложения на Vue.js",
    "url": "vue-developer"
}
```

2. Роль автоматически появится в интерфейсе

### Изменение цветовой схемы

Отредактируйте переменные в `src/styles/colors.scss`:
```scss
:root {
    --color-azure: #00bfff;        // Основной цвет
    --color-azure-light: #63d8ff;  // Светлый оттенок
    --color-black: rgb(17, 17, 17); // Темный фон
}
```

## 📚 Документация

- [Установка и настройка](docs/getting-started/installation.md)
- [Архитектура проекта](docs/architecture/overview.md)
- [Управление портфолио](docs/content/portfolio-management.md)
- [API и схемы данных](docs/api/data-schemas.md)
- [Руководство разработчика](docs/contributing/code-style.md)

## 🚀 Деплой

Проект готов для деплоя на:
- **Vercel** - рекомендуемый вариант
- **Netlify** - альтернативный вариант
- **GitHub Pages** - для статического хостинга

## 🤝 Участие в разработке

1. Форкните репозиторий
2. Создайте ветку для новой функции (`git checkout -b feature/amazing-feature`)
3. Зафиксируйте изменения (`git commit -m 'Add amazing feature'`)
4. Отправьте в ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE` для подробностей.

## 📞 Контакты

- **GitHub**: [@rev-cv](https://github.com/rev-cv)
- **Telegram**: [@rev-cv](https://t.me/rev-cv)
- **Email**: your.email@example.com

---

Создано с ❤️ с использованием Astro