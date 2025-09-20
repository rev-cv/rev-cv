# Управление портфолио

## Обзор

Система управления портфолио позволяет легко добавлять, редактировать и удалять роли разработчика без изменения кода. Все данные хранятся в JSON файлах и автоматически подхватываются интерфейсом.

## Структура портфолио

### Расположение файлов
```
src/data/portfolios/
├── react-developer.json
├── frontend-developer.json
├── python-developer.json
└── [новая-роль].json
```

### Формат данных
Каждый файл портфолио должен содержать:

```json
{
    "jobtitle": "Название роли",
    "description": "Подробное описание роли и навыков",
    "url": "url-slug"
}
```

## Добавление новой роли

### Шаг 1: Создание JSON файла

1. Создайте новый файл в `src/data/portfolios/`
2. Используйте kebab-case для имени файла: `vue-developer.json`
3. Заполните данные по шаблону:

```json
{
    "jobtitle": "Vue Developer",
    "description": "Создаю современные веб-приложения на Vue.js с использованием Composition API, Pinia для управления состоянием и Nuxt.js для SSR. Специализируюсь на TypeScript, Vite и современных инструментах разработки.",
    "url": "vue-developer"
}
```

### Шаг 2: Проверка типов

TypeScript автоматически проверит соответствие структуре `PortfolioItem`:

```typescript
interface PortfolioItem {
    jobtitle: string;    // Обязательное поле
    description: string; // Обязательное поле  
    url: string;        // Обязательное поле
}
```

### Шаг 3: Тестирование

1. Запустите проект: `npm run dev`
2. Проверьте, что новая роль появилась в интерфейсе
3. Убедитесь, что переключение работает корректно

## Редактирование существующих ролей

### Изменение названия роли

```json
{
    "jobtitle": "Senior React Developer", // Изменено
    "description": "Описание...",
    "url": "react-developer" // URL остается тот же
}
```

### Обновление описания

```json
{
    "jobtitle": "React Developer",
    "description": "Новое описание с дополнительными навыками...", // Обновлено
    "url": "react-developer"
}
```

### Изменение URL slug

```json
{
    "jobtitle": "React Developer",
    "description": "Описание...",
    "url": "senior-react-developer" // Новый URL
}
```

## Удаление роли

### Временное отключение

Переименуйте файл, добавив префикс `_`:
```
react-developer.json → _react-developer.json
```

### Полное удаление

1. Удалите JSON файл из `src/data/portfolios/`
2. Проверьте, что сайт работает корректно
3. Зафиксируйте изменения в git

## Лучшие практики

### Написание описаний

**Хорошее описание:**
- Конкретные технологии и инструменты
- Уровень экспертизы
- Типы проектов
- Ключевые достижения

```json
{
    "jobtitle": "Full-Stack Developer",
    "description": "Разрабатываю полнофункциональные веб-приложения с использованием React, Node.js и PostgreSQL. Имею опыт работы с Docker, AWS и CI/CD. Создал 15+ проектов для клиентов из различных отраслей.",
    "url": "fullstack-developer"
}
```

**Плохое описание:**
```json
{
    "jobtitle": "Developer",
    "description": "Делаю сайты", // Слишком общее
    "url": "developer"
}
```

### Именование файлов

**Рекомендуется:**
- `react-developer.json`
- `frontend-developer.json`
- `python-developer.json`
- `mobile-developer.json`

**Избегайте:**
- `React Developer.json` (пробелы)
- `react_developer.json` (подчеркивания)
- `reactdeveloper.json` (слишком длинное)

### URL slugs

**Хорошие URL:**
- `react-developer`
- `frontend-developer`
- `python-developer`
- `mobile-developer`

**Плохие URL:**
- `react` (слишком короткий)
- `react-developer-senior-with-5-years-experience` (слишком длинный)
- `React Developer` (пробелы)

## Валидация данных

### Проверка структуры

Убедитесь, что JSON файл валиден:

```bash
# Проверка синтаксиса JSON
cat src/data/portfolios/new-role.json | jq .
```

### Проверка типов

TypeScript проверит типы при сборке:

```bash
npm run build
```

### Проверка в браузере

Откройте DevTools и проверьте консоль на ошибки.

## Отладка проблем

### Роль не отображается

1. Проверьте имя файла (должно быть в `portfolios/`)
2. Убедитесь, что JSON валиден
3. Проверьте структуру данных
4. Посмотрите в консоль браузера

### Ошибки TypeScript

1. Проверьте соответствие интерфейсу `PortfolioItem`
2. Убедитесь, что все обязательные поля присутствуют
3. Проверьте типы данных

### Проблемы с переключением

1. Убедитесь, что `url` уникален
2. Проверьте, что файл загружается корректно
3. Посмотрите на JavaScript ошибки в консоли

## Автоматизация

### Скрипт для создания новой роли

Создайте скрипт `scripts/create-role.js`:

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const roleName = process.argv[2];
if (!roleName) {
    console.error('Usage: node create-role.js <role-name>');
    process.exit(1);
}

const template = {
    jobtitle: roleName.charAt(0).toUpperCase() + roleName.slice(1) + ' Developer',
    description: `Описание для роли ${roleName}`,
    url: roleName.toLowerCase().replace(/\s+/g, '-')
};

const fileName = `${roleName.toLowerCase().replace(/\s+/g, '-')}.json`;
const filePath = path.join(__dirname, '../src/data/portfolios', fileName);

fs.writeFileSync(filePath, JSON.stringify(template, null, 4));
console.log(`Created portfolio file: ${fileName}`);
```

Использование:
```bash
node scripts/create-role.js "Vue Developer"
```

### Валидация всех файлов

Создайте скрипт `scripts/validate-portfolios.js`:

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const portfoliosDir = path.join(__dirname, '../src/data/portfolios');
const files = glob.sync('*.json', { cwd: portfoliosDir });

let hasErrors = false;

files.forEach(file => {
    const filePath = path.join(portfoliosDir, file);
    try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Проверка обязательных полей
        const required = ['jobtitle', 'description', 'url'];
        const missing = required.filter(field => !content[field]);
        
        if (missing.length > 0) {
            console.error(`❌ ${file}: Missing fields: ${missing.join(', ')}`);
            hasErrors = true;
        } else {
            console.log(`✅ ${file}: Valid`);
        }
    } catch (error) {
        console.error(`❌ ${file}: Invalid JSON - ${error.message}`);
        hasErrors = true;
    }
});

if (hasErrors) {
    process.exit(1);
} else {
    console.log('All portfolio files are valid!');
}
```

## Миграция данных

### Изменение структуры

Если нужно добавить новые поля:

1. Обновите интерфейс `PortfolioItem`
2. Обновите все JSON файлы
3. Обновите компоненты для использования новых полей

### Массовое обновление

Используйте поиск и замену для обновления всех файлов:

```bash
# Добавление нового поля во все файлы
find src/data/portfolios -name "*.json" -exec sed -i 's/"url": "\(.*\)"/"url": "\1",\n    "skills": []/g' {} \;
```

## Мониторинг

### Отслеживание изменений

Используйте git для отслеживания изменений:

```bash
git log --oneline -- src/data/portfolios/
```

### Анализ использования

Добавьте аналитику для отслеживания популярных ролей:

```javascript
// В HeroBanner.astro
<script>
    function trackRoleSwitch(role) {
        // Отправка аналитики
        gtag('event', 'role_switch', {
            'role_name': role
        });
    }
</script>
```
