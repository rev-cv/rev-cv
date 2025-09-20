# API и схемы данных

## Обзор

Проект использует статические JSON файлы для хранения данных, которые загружаются через Astro's `import.meta.glob`. Все данные типизированы через TypeScript интерфейсы для обеспечения безопасности типов.

## Схемы данных

### PortfolioItem

Основной интерфейс для элементов портфолио.

```typescript
interface PortfolioItem {
    jobtitle: string;    // Название роли разработчика
    description: string; // Подробное описание роли и навыков
    url: string;        // URL slug для навигации
}
```

**Обязательные поля:**
- `jobtitle` (string) - отображаемое название роли
- `description` (string) - описание роли и навыков
- `url` (string) - уникальный URL slug

**Пример:**
```json
{
    "jobtitle": "React Developer",
    "description": "Создаю современные и функциональные веб-приложения с фокусом на пользовательский опыт. Специализируюсь на React, TypeScript и современных технологиях фронтенда.",
    "url": "react-developer"
}
```

### Contact

Интерфейс для контактной информации.

```typescript
interface Contact {
    title: string;  // Название контакта (например, "GitHub")
    contact: string; // Ссылка или адрес контакта
    icon: string;   // Путь к иконке
}
```

**Обязательные поля:**
- `title` (string) - отображаемое название контакта
- `contact` (string) - ссылка или адрес
- `icon` (string) - путь к SVG иконке

**Пример:**
```json
{
    "github": {
        "title": "GitHub",
        "contact": "https://github.com/rev-cv",
        "icon": "/src/assets/github.svg"
    }
}
```

### TypePortfoliosGlob

Тип для динамической загрузки портфолио через `import.meta.glob`.

```typescript
type EagerGlobModule<T> = {
    default: T;
};

export type TypePortfoliosGlob = Record<string, EagerGlobModule<PortfolioItem>>;
```

**Использование:**
```typescript
const portfoliosJSON: TypePortfoliosGlob = import.meta.glob(
    "../data/portfolios/*.json",
    { eager: true }
);
```

## Загрузка данных

### Статическая загрузка

Для контактной информации используется прямая загрузка:

```astro
---
import contacts from "../data/contacts.json";

// Использование
const githubUrl = contacts.github.contact;
---
```

### Динамическая загрузка

Для портфолио используется `import.meta.glob` для автоматической загрузки всех JSON файлов:

```astro
---
import type { TypePortfoliosGlob } from "../types/TypePortfolio";

// Загрузка всех файлов портфолио
const portfoliosJSON: TypePortfoliosGlob = import.meta.glob(
    "../data/portfolios/*.json",
    { eager: true }
);

// Преобразование в массив
const portfolios = [];
for (const path in portfoliosJSON) {
    const portfolio = portfoliosJSON[path].default;
    portfolios.push({
        jobtitle: portfolio.jobtitle,
        url: portfolio.url,
    });
}
---
```

## Валидация данных

### TypeScript проверки

Все данные проверяются на этапе компиляции:

```typescript
// Если структура не соответствует интерфейсу, TypeScript выдаст ошибку
const portfolio: PortfolioItem = {
    jobtitle: "React Developer",
    description: "Описание",
    url: "react-developer"
    // missingField: "value" // ❌ Ошибка TypeScript
};
```

### Runtime валидация

Рекомендуется добавить runtime валидацию для критичных данных:

```typescript
/**
 * Валидирует объект PortfolioItem
 * @param data - объект для валидации
 * @returns true если данные валидны
 */
function validatePortfolioItem(data: any): data is PortfolioItem {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof data.jobtitle === 'string' &&
        typeof data.description === 'string' &&
        typeof data.url === 'string' &&
        data.jobtitle.length > 0 &&
        data.description.length > 0 &&
        data.url.length > 0
    );
}

/**
 * Валидирует объект Contact
 * @param data - объект для валидации
 * @returns true если данные валидны
 */
function validateContact(data: any): data is Contact {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof data.title === 'string' &&
        typeof data.contact === 'string' &&
        typeof data.icon === 'string' &&
        data.title.length > 0 &&
        data.contact.length > 0 &&
        data.icon.length > 0
    );
}
```

### Валидация URL

```typescript
/**
 * Валидирует URL slug
 * @param url - URL для валидации
 * @returns true если URL валиден
 */
function validateUrlSlug(url: string): boolean {
    // URL должен содержать только строчные буквы, цифры и дефисы
    const urlRegex = /^[a-z0-9-]+$/;
    return urlRegex.test(url) && url.length > 0;
}

/**
 * Проверяет уникальность URL в массиве портфолио
 * @param portfolios - массив портфолио
 * @returns true если все URL уникальны
 */
function validateUniqueUrls(portfolios: PortfolioItem[]): boolean {
    const urls = portfolios.map(p => p.url);
    const uniqueUrls = new Set(urls);
    return urls.length === uniqueUrls.size;
}
```

## Обработка ошибок

### Обработка ошибок загрузки

```typescript
/**
 * Безопасная загрузка портфолио с обработкой ошибок
 */
async function loadPortfoliosSafely(): Promise<PortfolioItem[]> {
    try {
        const portfoliosJSON: TypePortfoliosGlob = import.meta.glob(
            "../data/portfolios/*.json",
            { eager: true }
        );
        
        const portfolios: PortfolioItem[] = [];
        
        for (const path in portfoliosJSON) {
            try {
                const portfolio = portfoliosJSON[path].default;
                
                if (!validatePortfolioItem(portfolio)) {
                    console.warn(`Invalid portfolio data in ${path}`);
                    continue;
                }
                
                portfolios.push(portfolio);
            } catch (error) {
                console.error(`Error loading portfolio from ${path}:`, error);
            }
        }
        
        if (!validateUniqueUrls(portfolios)) {
            throw new Error('Duplicate URLs found in portfolios');
        }
        
        return portfolios;
    } catch (error) {
        console.error('Error loading portfolios:', error);
        return []; // Возвращаем пустой массив в случае ошибки
    }
}
```

### Fallback данные

```typescript
/**
 * Fallback данные для случая ошибки загрузки
 */
const FALLBACK_PORTFOLIO: PortfolioItem = {
    jobtitle: "Developer",
    description: "Разработчик с опытом создания веб-приложений",
    url: "developer"
};

const FALLBACK_CONTACTS = {
    github: {
        title: "GitHub",
        contact: "https://github.com",
        icon: "/src/assets/github.svg"
    }
};
```

## Расширение схем

### Добавление новых полей

1. Обновите TypeScript интерфейс:

```typescript
interface PortfolioItem {
    jobtitle: string;
    description: string;
    url: string;
    skills?: string[];        // Новое опциональное поле
    experience?: number;      // Новое опциональное поле
    location?: string;        // Новое опциональное поле
}
```

2. Обновите JSON файлы:

```json
{
    "jobtitle": "React Developer",
    "description": "Описание...",
    "url": "react-developer",
    "skills": ["React", "TypeScript", "CSS"],
    "experience": 3,
    "location": "Москва"
}
```

3. Обновите валидацию:

```typescript
function validatePortfolioItem(data: any): data is PortfolioItem {
    return (
        typeof data === 'object' &&
        data !== null &&
        typeof data.jobtitle === 'string' &&
        typeof data.description === 'string' &&
        typeof data.url === 'string' &&
        // Новые поля опциональны
        (data.skills === undefined || Array.isArray(data.skills)) &&
        (data.experience === undefined || typeof data.experience === 'number') &&
        (data.location === undefined || typeof data.location === 'string')
    );
}
```

### Добавление новых типов данных

```typescript
// Новый интерфейс для проектов
interface Project {
    title: string;
    description: string;
    technologies: string[];
    githubUrl: string;
    liveUrl?: string;
    imageUrl?: string;
}

// Новый интерфейс для навыков
interface Skill {
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    category: 'frontend' | 'backend' | 'mobile' | 'devops' | 'other';
}
```

## Миграция данных

### Изменение структуры

```typescript
/**
 * Миграция данных портфолио
 * @param oldData - старые данные
 * @returns новые данные с обновленной структурой
 */
function migratePortfolioData(oldData: any): PortfolioItem {
    return {
        jobtitle: oldData.jobtitle || oldData.title || 'Developer',
        description: oldData.description || oldData.desc || '',
        url: oldData.url || oldData.slug || 'developer'
    };
}
```

### Версионирование схем

```typescript
interface VersionedPortfolioItem extends PortfolioItem {
    _version: string;
    _migratedAt?: string;
}

const CURRENT_SCHEMA_VERSION = '1.0.0';
```

## Производительность

### Кэширование данных

```typescript
// Кэш для загруженных данных
let portfoliosCache: PortfolioItem[] | null = null;

/**
 * Получение портфолио с кэшированием
 */
function getPortfolios(): PortfolioItem[] {
    if (portfoliosCache === null) {
        portfoliosCache = loadPortfoliosSafely();
    }
    return portfoliosCache;
}
```

### Lazy loading

```typescript
/**
 * Ленивая загрузка портфолио
 */
async function loadPortfolioLazy(url: string): Promise<PortfolioItem | null> {
    try {
        const portfolio = await import(`../data/portfolios/${url}.json`);
        return portfolio.default;
    } catch (error) {
        console.error(`Error loading portfolio ${url}:`, error);
        return null;
    }
}
```

## Мониторинг

### Логирование загрузки

```typescript
/**
 * Загрузка с логированием
 */
async function loadPortfoliosWithLogging(): Promise<PortfolioItem[]> {
    const startTime = performance.now();
    
    try {
        const portfolios = await loadPortfoliosSafely();
        
        const endTime = performance.now();
        console.log(`Portfolios loaded in ${endTime - startTime}ms`);
        
        return portfolios;
    } catch (error) {
        console.error('Failed to load portfolios:', error);
        throw error;
    }
}
```

### Метрики

```typescript
/**
 * Сбор метрик загрузки данных
 */
interface DataMetrics {
    loadTime: number;
    portfolioCount: number;
    errorCount: number;
    cacheHitRate: number;
}

function collectDataMetrics(portfolios: PortfolioItem[]): DataMetrics {
    return {
        loadTime: performance.now(),
        portfolioCount: portfolios.length,
        errorCount: 0, // Подсчитывается отдельно
        cacheHitRate: portfoliosCache ? 1 : 0
    };
}
```

## Тестирование

### Unit тесты для валидации

```typescript
// Пример теста с Jest
describe('PortfolioItem validation', () => {
    test('validates correct portfolio item', () => {
        const validItem: PortfolioItem = {
            jobtitle: 'React Developer',
            description: 'Description',
            url: 'react-developer'
        };
        
        expect(validatePortfolioItem(validItem)).toBe(true);
    });
    
    test('rejects invalid portfolio item', () => {
        const invalidItem = {
            jobtitle: 'React Developer',
            // missing description and url
        };
        
        expect(validatePortfolioItem(invalidItem)).toBe(false);
    });
});
```

### Интеграционные тесты

```typescript
describe('Portfolio loading', () => {
    test('loads all portfolio files', async () => {
        const portfolios = await loadPortfoliosSafely();
        expect(portfolios.length).toBeGreaterThan(0);
    });
    
    test('validates unique URLs', async () => {
        const portfolios = await loadPortfoliosSafely();
        expect(validateUniqueUrls(portfolios)).toBe(true);
    });
});
```
