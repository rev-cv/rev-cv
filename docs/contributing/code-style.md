# Стиль кода

## Обзор

Этот документ описывает стандарты кодирования, принятые в проекте. Следование этим стандартам обеспечивает консистентность, читаемость и поддерживаемость кода.

## Общие принципы

- **Читаемость** - код должен быть понятен без дополнительных объяснений
- **Консистентность** - одинаковые задачи решаются одинаково
- **Простота** - предпочитайте простое решение сложному
- **Производительность** - оптимизируйте критичные части
- **Безопасность** - учитывайте безопасность с самого начала

## TypeScript

### Именование

```typescript
// ✅ Хорошо
interface PortfolioItem {
    jobtitle: string;
    description: string;
    url: string;
}

type PortfolioStatus = 'active' | 'inactive';

const MAX_PORTFOLIO_ITEMS = 10;

function validatePortfolioItem(item: PortfolioItem): boolean {
    return item.jobtitle.length > 0;
}

// ❌ Плохо
interface portfolioitem {
    jobtitle: string;
    description: string;
    url: string;
}

const maxPortfolioItems = 10; // Должно быть UPPER_CASE для констант
```

### Типы и интерфейсы

```typescript
// ✅ Используйте интерфейсы для объектов
interface Contact {
    title: string;
    contact: string;
    icon: string;
}

// ✅ Используйте типы для объединений и примитивов
type Theme = 'light' | 'dark';
type Status = 'loading' | 'success' | 'error';

// ✅ Используйте generic типы для переиспользования
interface ApiResponse<T> {
    data: T;
    status: number;
    message: string;
}
```

### Функции

```typescript
// ✅ Хорошо - явные типы параметров и возвращаемого значения
function calculateTotal(items: PortfolioItem[]): number {
    return items.length;
}

// ✅ Хорошо - стрелочные функции для коротких операций
const formatUrl = (url: string): string => url.toLowerCase().replace(/\s+/g, '-');

// ✅ Хорошо - async/await вместо Promise.then
async function loadPortfolios(): Promise<PortfolioItem[]> {
    try {
        const response = await fetch('/api/portfolios');
        return await response.json();
    } catch (error) {
        console.error('Failed to load portfolios:', error);
        return [];
    }
}

// ❌ Плохо - неявные типы
function calculateTotal(items) {
    return items.length;
}
```

### Обработка ошибок

```typescript
// ✅ Хорошо - явная обработка ошибок
function validatePortfolioItem(data: unknown): data is PortfolioItem {
    if (typeof data !== 'object' || data === null) {
        return false;
    }
    
    const item = data as Record<string, unknown>;
    return (
        typeof item.jobtitle === 'string' &&
        typeof item.description === 'string' &&
        typeof item.url === 'string'
    );
}

// ✅ Хорошо - использование Result pattern
type Result<T, E = Error> = 
    | { success: true; data: T }
    | { success: false; error: E };

function loadPortfolio(id: string): Result<PortfolioItem> {
    try {
        const portfolio = getPortfolioById(id);
        return { success: true, data: portfolio };
    } catch (error) {
        return { success: false, error: error as Error };
    }
}
```

## Astro компоненты

### Структура компонента

```astro
---
// 1. Импорты (внешние библиотеки, затем внутренние)
import { someExternalLib } from 'external-lib';
import Layout from '../layouts/Layout.astro';
import type { PortfolioItem } from '../types/TypePortfolio';

// 2. Props и типы
interface Props {
    title: string;
    description?: string;
    items: PortfolioItem[];
}

const { title, description = 'Default description', items } = Astro.props;

// 3. Данные и логика
const processedItems = items.map(item => ({
    ...item,
    formattedUrl: item.url.toLowerCase()
}));
---

<!-- 4. HTML разметка -->
<div class="component">
    <h2>{title}</h2>
    {description && <p>{description}</p>}
    
    {items.length > 0 ? (
        <ul>
            {items.map(item => (
                <li key={item.url}>
                    <a href={`/${item.url}`}>{item.jobtitle}</a>
                </li>
            ))}
        </ul>
    ) : (
        <p>Нет доступных элементов</p>
    )}
</div>

<!-- 5. Стили -->
<style lang="scss">
    .component {
        padding: 1rem;
        
        h2 {
            color: var(--color-basic-white);
            margin-bottom: 0.5rem;
        }
        
        ul {
            list-style: none;
            padding: 0;
        }
        
        li {
            margin-bottom: 0.5rem;
        }
        
        a {
            color: var(--color-azure);
            text-decoration: none;
            
            &:hover {
                color: var(--color-azure-light);
            }
        }
    }
</style>

<!-- 6. JavaScript (если нужен) -->
<script>
    // Интерактивная логика
    document.addEventListener('DOMContentLoaded', () => {
        // Инициализация
    });
</script>
```

### Именование компонентов

```astro
<!-- ✅ Хорошо - PascalCase для файлов -->
<!-- HeroBanner.astro -->
<!-- PortfolioCard.astro -->
<!-- ContactForm.astro -->

<!-- ❌ Плохо -->
<!-- hero-banner.astro -->
<!-- portfolio_card.astro -->
<!-- contactform.astro -->
```

### Props

```astro
---
// ✅ Хорошо - явные типы и значения по умолчанию
interface Props {
    title: string;
    description?: string;
    isVisible?: boolean;
    items: PortfolioItem[];
}

const { 
    title, 
    description = 'Default description',
    isVisible = true,
    items = []
} = Astro.props;

// ✅ Хорошо - валидация props
if (!title) {
    throw new Error('Title prop is required');
}
---
```

## SCSS/CSS

### Структура стилей

```scss
// ✅ Хорошо - BEM методология
.hero-banner {
    // Блок
    padding: 20px;
    position: relative;
    
    &__content {
        // Элемент
        display: grid;
        gap: 1em;
    }
    
    &__title {
        // Элемент
        font-size: 2em;
        font-weight: 700;
    }
    
    &--large {
        // Модификатор
        padding: 40px;
    }
    
    &--dark {
        // Модификатор
        background-color: var(--color-black);
    }
    
    // Состояния
    &:hover {
        transform: translateY(-2px);
    }
    
    // Медиа-запросы
    @media (max-width: 768px) {
        padding: 10px;
        
        &__content {
            grid-template-columns: 1fr;
        }
    }
}
```

### CSS переменные

```scss
// ✅ Хорошо - использование CSS переменных
:root {
    --color-primary: #00bfff;
    --color-primary-light: #63d8ff;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 2rem;
    --border-radius: 6px;
    --transition: all 0.3s ease;
}

.component {
    color: var(--color-primary);
    padding: var(--spacing-md);
    border-radius: var(--border-radius);
    transition: var(--transition);
}

// ❌ Плохо - хардкод значений
.component {
    color: #00bfff;
    padding: 16px;
    border-radius: 6px;
}
```

### Медиа-запросы

```scss
// ✅ Хорошо - mobile-first подход
.component {
    // Мобильные стили (базовые)
    padding: 1rem;
    font-size: 1rem;
    
    // Планшеты
    @media (min-width: 768px) {
        padding: 1.5rem;
        font-size: 1.125rem;
    }
    
    // Десктоп
    @media (min-width: 1024px) {
        padding: 2rem;
        font-size: 1.25rem;
    }
    
    // Большие экраны
    @media (min-width: 1440px) {
        padding: 3rem;
        font-size: 1.5rem;
    }
}
```

## JavaScript

### Современный JavaScript

```javascript
// ✅ Хорошо - const/let вместо var
const portfolios = [];
let currentIndex = 0;

// ✅ Хорошо - стрелочные функции
const formatUrl = (url) => url.toLowerCase().replace(/\s+/g, '-');

// ✅ Хорошо - деструктуризация
const { jobtitle, description, url } = portfolio;

// ✅ Хорошо - spread оператор
const updatedPortfolio = { ...portfolio, isActive: true };

// ✅ Хорошо - template literals
const message = `Portfolio ${jobtitle} loaded successfully`;

// ❌ Плохо - устаревший синтаксис
var portfolios = [];
function formatUrl(url) {
    return url.toLowerCase().replace(/\s+/g, '-');
}
```

### Обработка событий

```javascript
// ✅ Хорошо - современная обработка событий
document.addEventListener('DOMContentLoaded', () => {
    const portfolioButton = document.querySelector('.portfolio-button');
    
    if (portfolioButton) {
        portfolioButton.addEventListener('click', handlePortfolioClick);
    }
});

function handlePortfolioClick(event) {
    event.preventDefault();
    const portfolioId = event.target.dataset.portfolioId;
    loadPortfolio(portfolioId);
}

// ✅ Хорошо - делегирование событий
document.addEventListener('click', (event) => {
    if (event.target.matches('.portfolio-item')) {
        handlePortfolioClick(event);
    }
});
```

### Асинхронный код

```javascript
// ✅ Хорошо - async/await
async function loadPortfolios() {
    try {
        const response = await fetch('/api/portfolios');
        const portfolios = await response.json();
        return portfolios;
    } catch (error) {
        console.error('Failed to load portfolios:', error);
        return [];
    }
}

// ✅ Хорошо - обработка Promise.all
async function loadMultiplePortfolios(ids) {
    try {
        const promises = ids.map(id => loadPortfolio(id));
        const portfolios = await Promise.all(promises);
        return portfolios;
    } catch (error) {
        console.error('Failed to load multiple portfolios:', error);
        return [];
    }
}
```

## HTML

### Семантическая разметка

```html
<!-- ✅ Хорошо - семантические теги -->
<header>
    <nav>
        <ul>
            <li><a href="/">Главная</a></li>
            <li><a href="/about">Обо мне</a></li>
            <li><a href="/projects">Проекты</a></li>
        </ul>
    </nav>
</header>

<main>
    <section class="hero">
        <h1>Ревин Роман</h1>
        <p>Разработчик</p>
    </section>
    
    <section class="portfolio">
        <h2>Мои работы</h2>
        <article class="portfolio-item">
            <h3>Проект 1</h3>
            <p>Описание проекта</p>
        </article>
    </section>
</main>

<footer>
    <p>&copy; 2024 Ревин Роман</p>
</footer>

<!-- ❌ Плохо - не семантическая разметка -->
<div class="header">
    <div class="nav">
        <div class="nav-item">Главная</div>
    </div>
</div>
```

### Доступность

```html
<!-- ✅ Хорошо - ARIA атрибуты -->
<button 
    class="portfolio-toggle"
    aria-expanded="false"
    aria-controls="portfolio-menu"
    aria-label="Открыть меню портфолио"
>
    Портфолио
</button>

<ul id="portfolio-menu" class="portfolio-menu" hidden>
    <li><a href="/react">React Developer</a></li>
    <li><a href="/vue">Vue Developer</a></li>
</ul>

<!-- ✅ Хорошо - alt текст для изображений -->
<img 
    src="/avatar.jpg" 
    alt="Фотография Ревина Романа, разработчика"
    width="200"
    height="200"
>

<!-- ✅ Хорошо - заголовки для структуры -->
<h1>Ревин Роман</h1>
<h2>Разработчик</h2>
<h3>Навыки</h3>
```

## Комментарии

### JSDoc для функций

```typescript
/**
 * Валидирует элемент портфолио
 * @param item - объект для валидации
 * @returns true если элемент валиден
 * @throws {Error} если item не определен
 * @example
 * ```typescript
 * const isValid = validatePortfolioItem({
 *   jobtitle: 'React Developer',
 *   description: 'Description',
 *   url: 'react-developer'
 * });
 * ```
 */
function validatePortfolioItem(item: PortfolioItem): boolean {
    if (!item) {
        throw new Error('Item is required');
    }
    
    return (
        typeof item.jobtitle === 'string' &&
        typeof item.description === 'string' &&
        typeof item.url === 'string'
    );
}
```

### Комментарии в коде

```typescript
// ✅ Хорошо - объяснение сложной логики
// Создаем уникальные URL, добавляя суффикс если необходимо
const uniqueUrls = portfolios.map((portfolio, index) => {
    const baseUrl = portfolio.url.toLowerCase();
    const existingUrls = portfolios.slice(0, index).map(p => p.url);
    
    if (existingUrls.includes(baseUrl)) {
        return `${baseUrl}-${index + 1}`;
    }
    
    return baseUrl;
});

// ❌ Плохо - очевидные комментарии
// Увеличиваем счетчик
counter++;

// ❌ Плохо - комментарии вместо рефакторинга
// Проверяем если это React Developer
if (portfolio.jobtitle === 'React Developer') {
    // ...
}
```

## Тестирование

### Unit тесты

```typescript
// ✅ Хорошо - описательные названия тестов
describe('validatePortfolioItem', () => {
    test('should return true for valid portfolio item', () => {
        const validItem: PortfolioItem = {
            jobtitle: 'React Developer',
            description: 'Description',
            url: 'react-developer'
        };
        
        expect(validatePortfolioItem(validItem)).toBe(true);
    });
    
    test('should return false for item with missing jobtitle', () => {
        const invalidItem = {
            description: 'Description',
            url: 'react-developer'
        };
        
        expect(validatePortfolioItem(invalidItem)).toBe(false);
    });
    
    test('should throw error for null item', () => {
        expect(() => validatePortfolioItem(null)).toThrow('Item is required');
    });
});
```

### Интеграционные тесты

```typescript
describe('Portfolio loading', () => {
    test('should load all portfolio files', async () => {
        const portfolios = await loadPortfoliosSafely();
        
        expect(portfolios).toBeDefined();
        expect(Array.isArray(portfolios)).toBe(true);
        expect(portfolios.length).toBeGreaterThan(0);
    });
    
    test('should validate unique URLs', async () => {
        const portfolios = await loadPortfoliosSafely();
        const urls = portfolios.map(p => p.url);
        const uniqueUrls = new Set(urls);
        
        expect(urls.length).toBe(uniqueUrls.size);
    });
});
```

## Производительность

### Оптимизация загрузки

```typescript
// ✅ Хорошо - ленивая загрузка
const loadPortfolioLazy = async (id: string) => {
    const module = await import(`../data/portfolios/${id}.json`);
    return module.default;
};

// ✅ Хорошо - кэширование
const portfolioCache = new Map<string, PortfolioItem>();

async function getPortfolio(id: string): Promise<PortfolioItem> {
    if (portfolioCache.has(id)) {
        return portfolioCache.get(id)!;
    }
    
    const portfolio = await loadPortfolioLazy(id);
    portfolioCache.set(id, portfolio);
    return portfolio;
}
```

### Оптимизация рендеринга

```astro
---
// ✅ Хорошо - предварительная обработка данных
const processedPortfolios = portfolios.map(portfolio => ({
    ...portfolio,
    formattedUrl: portfolio.url.toLowerCase(),
    shortDescription: portfolio.description.substring(0, 100) + '...'
}));
---

<!-- ✅ Хорошо - условный рендеринг -->
{processedPortfolios.length > 0 ? (
    <ul class="portfolio-list">
        {processedPortfolios.map(portfolio => (
            <li key={portfolio.url}>
                <a href={`/${portfolio.formattedUrl}`}>
                    {portfolio.jobtitle}
                </a>
                <p>{portfolio.shortDescription}</p>
            </li>
        ))}
    </ul>
) : (
    <p>Нет доступных портфолио</p>
)}
```

## Безопасность

### Валидация входных данных

```typescript
// ✅ Хорошо - санитизация HTML
function sanitizeHtml(html: string): string {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}

// ✅ Хорошо - валидация URL
function isValidUrl(url: string): boolean {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
}

// ✅ Хорошо - экранирование данных
function escapeHtml(text: string): string {
    const map: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    
    return text.replace(/[&<>"']/g, (m) => map[m]);
}
```

## Инструменты

### Prettier конфигурация

```json
{
    "semi": true,
    "trailingComma": "es5",
    "singleQuote": true,
    "printWidth": 80,
    "tabWidth": 4,
    "useTabs": false
}
```

### ESLint конфигурация

```json
{
    "extends": [
        "@typescript-eslint/recommended",
        "astro/recommended"
    ],
    "rules": {
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/explicit-function-return-type": "warn",
        "prefer-const": "error",
        "no-var": "error"
    }
}
```

### Stylelint конфигурация

```json
{
    "extends": ["stylelint-config-standard-scss"],
    "rules": {
        "selector-class-pattern": "^[a-z][a-zA-Z0-9]*(__[a-z][a-zA-Z0-9]*)?(--[a-z][a-zA-Z0-9]*)?$",
        "scss/at-rule-no-unknown": [
            true,
            {
                "ignoreAtRules": ["tailwind", "apply", "variants", "responsive", "screen"]
            }
        ]
    }
}
```
