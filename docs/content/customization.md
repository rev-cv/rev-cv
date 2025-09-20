# Кастомизация

## Обзор

Проект предоставляет множество возможностей для кастомизации без изменения основного кода. Вы можете изменить цвета, шрифты, контент и даже добавить новые функции.

## Цветовая схема

### Основные цвета

Цвета определены в `src/styles/colors.scss`:

```scss
:root {
    // Основные цвета
    --color-basic-white: rgba(240, 240, 240, 1);
    --color-basic-white-80: rgba(240, 240, 240, 0.8);
    
    // Акцентные цвета
    --color-azure: #00bfff;
    --color-azure-light: #63d8ff;
    
    // Темные цвета
    --color-black: rgb(17, 17, 17);
    --color-black-60: rgba(17, 17, 17, 0.6);
    
    // Дополнительные цвета
    --color-button-hover-bg: rgba(255, 255, 255, 0.05);
    --color-dark-charcoal: #313131;
    // ... другие цвета
}
```

### Изменение цветовой схемы

#### Светлая тема
```scss
:root {
    --color-basic-white: #000000;
    --color-black: #ffffff;
    --color-azure: #0066cc;
    --color-azure-light: #3388dd;
}
```

#### Темная тема (текущая)
```scss
:root {
    --color-basic-white: rgba(240, 240, 240, 1);
    --color-black: rgb(17, 17, 17);
    --color-azure: #00bfff;
    --color-azure-light: #63d8ff;
}
```

#### Кастомная палитра
```scss
:root {
    // Основные цвета
    --color-primary: #ff6b6b;
    --color-primary-light: #ff8e8e;
    --color-secondary: #4ecdc4;
    --color-secondary-light: #7eddd6;
    
    // Фоновые цвета
    --color-background: #1a1a1a;
    --color-surface: #2d2d2d;
    --color-text: #ffffff;
    --color-text-muted: rgba(255, 255, 255, 0.7);
}
```

### Градиенты

Добавьте градиенты для более современного вида:

```scss
:root {
    --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
    --gradient-hero: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

Использование в компонентах:
```scss
.hero-banner {
    background: var(--gradient-hero);
}
```

## Типографика

### Шрифты

Текущий шрифт определен в `Layout.astro`:

```html
<link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
```

#### Изменение шрифта

1. Выберите шрифт на [Google Fonts](https://fonts.google.com/)
2. Обновите ссылку в `Layout.astro`:

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

3. Обновите CSS переменные:

```scss
:root {
    --font-family-primary: 'Inter', sans-serif;
    --font-family-secondary: 'Inter', sans-serif;
}

body {
    font-family: var(--font-family-primary);
}
```

#### Размеры шрифтов

```scss
:root {
    --font-size-xs: 0.75rem;    // 12px
    --font-size-sm: 0.875rem;   // 14px
    --font-size-base: 1rem;     // 16px
    --font-size-lg: 1.125rem;   // 18px
    --font-size-xl: 1.25rem;    // 20px
    --font-size-2xl: 1.5rem;    // 24px
    --font-size-3xl: 1.875rem;  // 30px
    --font-size-4xl: 2.25rem;   // 36px
}
```

### Интерлиньяж и отступы

```scss
:root {
    --line-height-tight: 1.25;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.75;
    
    --letter-spacing-tight: -0.025em;
    --letter-spacing-normal: 0;
    --letter-spacing-wide: 0.025em;
}
```

## Макет и верстка

### Контейнеры

Текущий контейнер определен в `page-container.css`:

```css
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}
```

#### Изменение ширины контейнера

```css
.container {
    max-width: 1400px; /* Увеличить ширину */
    /* или */
    max-width: 1000px; /* Уменьшить ширину */
}
```

#### Адаптивные контейнеры

```css
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

@media (max-width: 768px) {
    .container {
        padding: 0 0.5rem;
    }
}

@media (min-width: 1400px) {
    .container {
        max-width: 1600px;
    }
}
```

### Сетка

Текущая сетка использует CSS Grid:

```scss
.hero-banner__content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas:
        "name avatar"
        "job avatar"
        "descr avatar"
        "btns avatar"
        "media touch";
    gap: 0 1em;
}
```

#### Изменение макета

```scss
// Вертикальный макет
.hero-banner__content {
    grid-template-columns: 1fr;
    grid-template-areas:
        "name"
        "job"
        "descr"
        "btns"
        "avatar"
        "media"
        "touch";
}

// Трехколоночный макет
.hero-banner__content {
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-areas:
        "name . avatar"
        "job descr avatar"
        "btns . avatar"
        "media . touch";
}
```

## Анимации и переходы

### CSS переходы

Текущие переходы определены в компонентах:

```scss
button {
    transition: color 300ms ease-in-out;
}

.hero-banner__my-job > div {
    transition: grid-template-rows 300ms ease-in-out;
}
```

#### Кастомные анимации

```scss
// Fade in анимация
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.fade-in {
    animation: fadeIn 0.6s ease-out;
}

// Slide in анимация
@keyframes slideIn {
    from { transform: translateX(-100%); }
    to { transform: translateX(0); }
}

.slide-in {
    animation: slideIn 0.4s ease-out;
}
```

#### Hover эффекты

```scss
.button {
    transition: all 0.3s ease;
    
    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
}
```

## Контент

### Персональная информация

#### Имя и заголовок

В `HeroBanner.astro`:

```astro
<div class="hero-banner__my-name">Ревин Роман</div>
<div class="hero-banner__my-job">
    <button>{resume.jobtitle}</button>
</div>
```

#### Описание

```astro
<div class="hero-banner__descr">{resume.description}</div>
```

#### Социальные сети

В `contacts.json`:

```json
{
    "github": {
        "title": "GitHub",
        "contact": "https://github.com/your-username",
        "icon": "/src/assets/github.svg"
    },
    "linkedin": {
        "title": "LinkedIn",
        "contact": "https://linkedin.com/in/your-profile",
        "icon": "/src/assets/linkedin.svg"
    }
}
```

### Изображения

#### Аватар

Замените изображение в `public/2025-09-17.png` или обновите путь:

```astro
<picture class="hero-banner__avatar">
    <img src="/public/your-avatar.jpg" alt="Your Name" />
</picture>
```

#### Фоновое изображение

```astro
<picture class="hero-banner__bg">
    <img src="/public/your-background.jpg" alt="Background" />
</picture>
```

## Навигация

### Меню

В `Header.astro`:

```astro
<div class="navigator">
    <button>Главная</button>
    <button>Обо мне</button>
    <button>Проекты</button>
    <button>Навыки</button>
    <button>Контакты</button>
</div>
```

#### Добавление новых пунктов меню

```astro
<div class="navigator">
    <button>Главная</button>
    <button>Обо мне</button>
    <button>Проекты</button>
    <button>Блог</button>        <!-- Новый пункт -->
    <button>Навыки</button>
    <button>Контакты</button>
</div>
```

#### Ссылки на страницы

```astro
<div class="navigator">
    <a href="/">Главная</a>
    <a href="/about">Обо мне</a>
    <a href="/projects">Проекты</a>
    <a href="/blog">Блог</a>
    <a href="/skills">Навыки</a>
    <a href="/contact">Контакты</a>
</div>
```

## SEO и мета-теги

### Базовые мета-теги

В `Layout.astro`:

```html
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width" />
    <meta name="description" content="Персональный сайт-портфолио разработчика" />
    <meta name="keywords" content="разработчик, портфолио, React, TypeScript" />
    <meta name="author" content="Ваше Имя" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="Ваше Имя - Разработчик" />
    <meta property="og:description" content="Описание вашего портфолио" />
    <meta property="og:image" content="/public/og-image.jpg" />
    <meta property="og:url" content="https://your-domain.com" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="Ваше Имя - Разработчик" />
    <meta name="twitter:description" content="Описание вашего портфолио" />
    <meta name="twitter:image" content="/public/twitter-image.jpg" />
</head>
```

### Динамические мета-теги

```astro
---
// В pages/index.astro
const title = `${resume.jobtitle} - Ваше Имя`;
const description = resume.description;
---

<Layout title={title} description={description}>
    <!-- контент -->
</Layout>
```

## Аналитика

### Google Analytics

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Yandex Metrica

```html
<!-- Yandex Metrica -->
<script type="text/javascript">
    (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
    m[i].l=1*new Date();k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
    ym(YOUR_COUNTER_ID, "init", {
        clickmap:true,
        trackLinks:true,
        accurateTrackBounce:true
    });
</script>
```

## Производительность

### Оптимизация изображений

```astro
<picture class="hero-banner__avatar">
    <source srcset="/public/avatar.webp" type="image/webp">
    <source srcset="/public/avatar.jpg" type="image/jpeg">
    <img src="/public/avatar.jpg" alt="Avatar" loading="lazy" />
</picture>
```

### Критический CSS

```html
<style>
    /* Критический CSS для первого экрана */
    .hero-banner {
        height: 100vh;
        background: var(--color-black);
    }
</style>
```

### Preload ресурсов

```html
<link rel="preload" href="/fonts/montserrat.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/public/avatar.jpg" as="image">
```

## Тестирование кастомизации

### Локальное тестирование

```bash
npm run dev
```

### Проверка на разных устройствах

1. Используйте DevTools для эмуляции устройств
2. Тестируйте на реальных устройствах
3. Проверьте производительность в Lighthouse

### Валидация

```bash
# Проверка HTML
npm run build
npx html-validate dist/**/*.html

# Проверка CSS
npx stylelint "src/**/*.{css,scss}"

# Проверка TypeScript
npm run astro check
```
