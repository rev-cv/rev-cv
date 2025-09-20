# Структура данных

## Обзор

Проект использует JSON файлы для хранения данных портфолио и контактов. Все данные типизированы через TypeScript интерфейсы для обеспечения безопасности типов.

## Организация данных

```
src/data/
├── contacts.json           # Контактная информация
└── portfolios/             # Данные портфолио
    ├── react-developer.json
    ├── frontend-developer.json
    └── python-developer.json
```

## Типы данных

### PortfolioItem

Основной интерфейс для элементов портфолио:

```typescript
interface PortfolioItem {
    jobtitle: string;    // Название роли (например, "React Developer")
    description: string; // Описание роли и навыков
    url: string;        // URL slug для навигации
}
```

**Пример:**
```json
{
    "jobtitle": "React Developer",
    "description": "Создаю современные и функциональные веб-приложения с фокусом на пользовательский опыт. Специализируюсь на React, TypeScript и современных технологиях фронтенда.",
    "url": "react-developer"
}
```

### Contact

Интерфейс для контактной информации:

```typescript
interface Contact {
    title: string;  // Название контакта (например, "GitHub")
    contact: string; // Ссылка или адрес
    icon: string;   // Путь к иконке
}
```

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

Тип для динамической загрузки портфолио:

```typescript
type EagerGlobModule<T> = {
    default: T;
};

export type TypePortfoliosGlob = Record<string, EagerGlobModule<PortfolioItem>>;
```

## Загрузка данных

### Статическая загрузка

Для контактов используется прямая загрузка:

```astro
---
import contacts from "../data/contacts.json";
---
```

### Динамическая загрузка

Для портфолио используется `import.meta.glob`:

```astro
---
import type { TypePortfoliosGlob } from "../types/TypePortfolio";

const portfoliosJSON: TypePortfoliosGlob = import.meta.glob(
    "../data/portfolios/*.json",
    { eager: true }
);

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
    // missingField: "value" // Ошибка TypeScript
};
```

### Runtime валидация

Рекомендуется добавить runtime валидацию:

```typescript
function validatePortfolioItem(data: any): data is PortfolioItem {
    return (
        typeof data.jobtitle === 'string' &&
        typeof data.description === 'string' &&
        typeof data.url === 'string'
    );
}
```

## Расширение данных

### Добавление новых полей

1. Обновите TypeScript интерфейс:
```typescript
interface PortfolioItem {
    jobtitle: string;
    description: string;
    url: string;
    skills?: string[];        // Новое поле
    experience?: number;      // Новое поле
}
```

2. Обновите JSON файлы:
```json
{
    "jobtitle": "React Developer",
    "description": "Описание",
    "url": "react-developer",
    "skills": ["React", "TypeScript", "CSS"],
    "experience": 3
}
```

3. Обновите компоненты для использования новых полей

### Добавление новых типов данных

1. Создайте новый интерфейс в `types/`:
```typescript
interface Project {
    title: string;
    description: string;
    technologies: string[];
    githubUrl: string;
    liveUrl?: string;
}
```

2. Создайте JSON файлы в соответствующей папке:
```
src/data/
├── projects/
│   ├── project1.json
│   └── project2.json
```

3. Обновите компоненты для работы с новыми данными

## Лучшие практики

### Именование файлов
- Используйте kebab-case: `react-developer.json`
- Описательные имена: `frontend-developer.json`
- Избегайте пробелов и специальных символов

### Структура JSON
- Используйте отступы в 4 пробела
- Сортируйте поля логически
- Добавляйте комментарии в виде полей `_comment`

### Валидация
- Всегда проверяйте данные перед использованием
- Используйте TypeScript для compile-time проверок
- Добавляйте runtime валидацию для критичных данных

### Производительность
- Минимизируйте размер JSON файлов
- Используйте `eager: true` только для критичных данных
- Кэшируйте обработанные данные

## Миграция данных

### Изменение структуры

1. Создайте backup существующих данных
2. Обновите TypeScript интерфейсы
3. Обновите JSON файлы
4. Обновите компоненты
5. Протестируйте изменения

### Версионирование

Рекомендуется добавлять версию в JSON:

```json
{
    "_version": "1.0.0",
    "jobtitle": "React Developer",
    "description": "Описание",
    "url": "react-developer"
}
```

## Отладка данных

### Логирование

```typescript
console.log('Loaded portfolios:', portfolios);
console.log('Portfolio data:', portfoliosJSON);
```

### Валидация в браузере

```typescript
// В DevTools Console
console.log(window.portfolios); // Если экспортировано в window
```

### Проверка типов

```typescript
// TypeScript playground для проверки типов
type TestPortfolio = PortfolioItem;
```

## Безопасность

### Валидация входных данных
- Проверяйте все данные перед рендерингом
- Санитизируйте HTML контент
- Валидируйте URL перед использованием

### CORS и внешние ресурсы
- Используйте `rel="noopener noreferrer"` для внешних ссылок
- Проверяйте источники изображений
- Валидируйте email адреса

## Мониторинг

### Отслеживание ошибок
```typescript
try {
    const portfolio = portfoliosJSON[path].default;
    if (!validatePortfolioItem(portfolio)) {
        throw new Error(`Invalid portfolio data: ${path}`);
    }
} catch (error) {
    console.error('Portfolio loading error:', error);
}
```

### Метрики загрузки
```typescript
const startTime = performance.now();
// ... загрузка данных
const endTime = performance.now();
console.log(`Data loading took ${endTime - startTime} milliseconds`);
```
