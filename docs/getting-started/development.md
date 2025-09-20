# Разработка

## Обзор

Этот документ описывает процесс разработки проекта, включая настройку окружения, рабочий процесс и лучшие практики.

## Настройка окружения разработки

### 1. IDE и редакторы

**Рекомендуемый редактор:** Visual Studio Code

**Обязательные расширения:**
- Astro - поддержка .astro файлов
- TypeScript Importer - автоимпорт типов
- SCSS IntelliSense - поддержка SCSS
- Prettier - форматирование кода
- ESLint - линтинг кода

### 2. Настройка VS Code

Создайте `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.associations": {
    "*.astro": "astro"
  },
  "emmet.includeLanguages": {
    "astro": "html"
  }
}
```

### 3. Git конфигурация

```bash
# Настройте имя и email
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Настройте редактор по умолчанию
git config --global core.editor "code --wait"
```

## Рабочий процесс

### 1. Создание ветки

```bash
# Обновите main ветку
git checkout main
git pull origin main

# Создайте новую ветку
git checkout -b feature/your-feature-name

# Или для исправления бага
git checkout -b fix/bug-description
```

### 2. Разработка

```bash
# Запустите dev сервер
npm run dev

# В другом терминале - следите за изменениями
npm run astro check --watch
```

### 3. Коммиты

```bash
# Добавьте изменения
git add .

# Создайте коммит
git commit -m "feat: add new portfolio component"

# Отправьте ветку
git push origin feature/your-feature-name
```

### 4. Создание Pull Request

1. Перейдите на GitHub
2. Нажмите "New Pull Request"
3. Заполните описание
4. Назначьте ревьюеров
5. Дождитесь одобрения и мержа

## Структура проекта

### Компоненты

```
src/components/
├── Header.astro          # Навигация
├── HeroBanner.astro      # Главный баннер
└── Welcome.astro         # Приветственный блок
```

**Структура компонента:**
```astro
---
// 1. Импорты
import SomeComponent from './SomeComponent.astro';

// 2. Props и типы
interface Props {
    title: string;
    description?: string;
}

const { title, description = 'Default' } = Astro.props;

// 3. Данные и логика
const processedData = processData(data);
---

<!-- 4. HTML разметка -->
<div class="component">
    <h2>{title}</h2>
    {description && <p>{description}</p>}
</div>

<!-- 5. Стили -->
<style lang="scss">
    .component {
        // Стили
    }
</style>

<!-- 6. JavaScript (если нужен) -->
<script>
    // Логика
</script>
```

### Данные

```
src/data/
├── contacts.json         # Контактная информация
└── portfolios/           # Данные портфолио
    ├── react-developer.json
    ├── frontend-developer.json
    └── python-developer.json
```

**Формат данных портфолио:**
```json
{
    "jobtitle": "React Developer",
    "description": "Описание роли и навыков",
    "url": "react-developer"
}
```

### Стили

```
src/styles/
├── colors.scss           # CSS переменные
├── reset.css            # Сброс стилей
└── page-container.css   # Утилитарные классы
```

**Использование SCSS переменных:**
```scss
.component {
    color: var(--color-basic-white);
    background: var(--color-azure);
    
    &:hover {
        background: var(--color-azure-light);
    }
}
```

## Лучшие практики

### 1. Именование

**Файлы и папки:**
- PascalCase для компонентов: `HeroBanner.astro`
- kebab-case для данных: `react-developer.json`
- camelCase для функций: `loadPortfolios()`

**CSS классы (BEM):**
```scss
.hero-banner {           // Блок
    &__content {         // Элемент
        // Стили
    }
    
    &--large {           // Модификатор
        // Стили
    }
}
```

### 2. TypeScript

**Типизация:**
```typescript
// ✅ Хорошо - явные типы
function validatePortfolio(item: PortfolioItem): boolean {
    return item.jobtitle.length > 0;
}

// ❌ Плохо - неявные типы
function validatePortfolio(item) {
    return item.jobtitle.length > 0;
}
```

**Интерфейсы:**
```typescript
interface PortfolioItem {
    jobtitle: string;
    description: string;
    url: string;
}
```

### 3. Компоненты

**Props:**
```astro
---
interface Props {
    title: string;
    description?: string;
    items: PortfolioItem[];
}

const { title, description = 'Default', items = [] } = Astro.props;
---
```

**Условный рендеринг:**
```astro
{items.length > 0 ? (
    <ul>
        {items.map(item => (
            <li key={item.url}>{item.jobtitle}</li>
        ))}
    </ul>
) : (
    <p>Нет элементов</p>
)}
```

### 4. Стили

**CSS переменные:**
```scss
:root {
    --color-primary: #00bfff;
    --spacing-md: 1rem;
    --border-radius: 6px;
}

.component {
    color: var(--color-primary);
    padding: var(--spacing-md);
    border-radius: var(--border-radius);
}
```

**Адаптивность:**
```scss
.component {
    // Мобильные стили (базовые)
    padding: 1rem;
    
    // Планшеты
    @media (min-width: 768px) {
        padding: 1.5rem;
    }
    
    // Десктоп
    @media (min-width: 1024px) {
        padding: 2rem;
    }
}
```

## Тестирование

### 1. Ручное тестирование

```bash
# Запустите проект
npm run dev

# Проверьте в разных браузерах
# Chrome, Firefox, Safari, Edge

# Проверьте на разных устройствах
# Мобильные, планшеты, десктоп
```

### 2. Автоматическое тестирование

```bash
# Проверка TypeScript
npm run astro check

# Проверка сборки
npm run build

# Проверка стилей (если настроен)
npm run stylelint
```

### 3. Тестирование производительности

```bash
# Анализ размера бандла
npm run build
ls -la dist/

# Lighthouse аудит
# Откройте Chrome DevTools -> Lighthouse
```

## Отладка

### 1. TypeScript ошибки

```bash
# Проверка типов
npm run astro check

# Детальная информация
npm run astro check --verbose
```

### 2. Стили

```bash
# Проверка SCSS синтаксиса
npm run stylelint

# Проверка в браузере
# Откройте DevTools -> Elements
```

### 3. JavaScript

```javascript
// Используйте console.log для отладки
console.log('Portfolio data:', portfolios);

// Используйте debugger для пошаговой отладки
debugger;

// Проверяйте в DevTools -> Console
```

### 4. Сетевые запросы

```bash
# Проверьте Network tab в DevTools
# Убедитесь, что все ресурсы загружаются
```

## Оптимизация

### 1. Производительность

**Изображения:**
```astro
<!-- ✅ Хорошо - оптимизированные изображения -->
<picture>
    <source srcset="/image.webp" type="image/webp">
    <img src="/image.jpg" alt="Description" loading="lazy">
</picture>
```

**CSS:**
```scss
// ✅ Хорошо - используйте CSS переменные
.component {
    color: var(--color-primary);
}

// ❌ Плохо - дублирование значений
.component {
    color: #00bfff;
}
```

**JavaScript:**
```javascript
// ✅ Хорошо - ленивая загрузка
const loadPortfolio = async (id) => {
    const module = await import(`../data/portfolios/${id}.json`);
    return module.default;
};
```

### 2. SEO

**Мета-теги:**
```astro
---
const title = `${resume.jobtitle} - Ревин Роман`;
const description = resume.description;
---

<Layout title={title} description={description}>
    <!-- контент -->
</Layout>
```

**Семантическая разметка:**
```html
<main>
    <section class="hero">
        <h1>Ревин Роман</h1>
        <p>Разработчик</p>
    </section>
</main>
```

## Деплой

### 1. Подготовка к деплою

```bash
# Соберите проект
npm run build

# Проверьте сборку
npm run preview

# Проверьте размер dist/
ls -la dist/
```

### 2. Vercel

```bash
# Установите Vercel CLI
npm install -g vercel

# Деплой
vercel

# Или подключите GitHub репозиторий на vercel.com
```

### 3. Netlify

```bash
# Установите Netlify CLI
npm install -g netlify-cli

# Деплой
netlify deploy --prod --dir=dist
```

## Мониторинг

### 1. Аналитика

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

### 2. Ошибки

```javascript
// Отслеживание ошибок
window.addEventListener('error', (event) => {
    console.error('Error:', event.error);
    // Отправка в сервис мониторинга
});
```

## Полезные команды

```bash
# Разработка
npm run dev                    # Запуск dev сервера
npm run dev -- --port 3000    # Запуск на другом порту

# Сборка
npm run build                  # Сборка проекта
npm run preview               # Предварительный просмотр

# Проверка
npm run astro check           # Проверка TypeScript
npm run stylelint             # Проверка стилей
npm run format                # Форматирование кода

# Git
git status                    # Статус репозитория
git log --oneline            # История коммитов
git diff                     # Изменения
```

## Получение помощи

1. **Документация:** Изучите файлы в папке `docs/`
2. **Issues:** Создайте Issue на GitHub
3. **Сообщество:** Обратитесь к сообществу Astro
4. **Код:** Изучите существующий код в проекте
