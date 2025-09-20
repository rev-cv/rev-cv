# Добавление новых ролей

## Обзор

Система ролей позволяет легко добавлять новые специализации разработчика без изменения кода. Каждая роль представлена отдельным JSON файлом и автоматически интегрируется в интерфейс.

## Быстрый старт

### 1. Создание файла роли

Создайте новый JSON файл в `src/data/portfolios/`:

```bash
# Пример: добавление роли "Vue Developer"
touch src/data/portfolios/vue-developer.json
```

### 2. Заполнение данных

```json
{
    "jobtitle": "Vue Developer",
    "description": "Создаю современные веб-приложения на Vue.js с использованием Composition API, Pinia для управления состоянием и Nuxt.js для SSR. Специализируюсь на TypeScript, Vite и современных инструментах разработки.",
    "url": "vue-developer"
}
```

### 3. Проверка результата

```bash
npm run dev
```

Новая роль автоматически появится в интерфейсе!

## Детальное руководство

### Структура файла роли

Каждый файл роли должен содержать три обязательных поля:

```typescript
interface PortfolioItem {
    jobtitle: string;    // Отображаемое название роли
    description: string; // Подробное описание
    url: string;        // URL slug для навигации
}
```

### Поле `jobtitle`

**Назначение:** Отображается как заголовок роли в интерфейсе

**Рекомендации:**
- Используйте заглавные буквы: "Vue Developer"
- Будьте конкретными: "Senior React Developer"
- Избегайте слишком длинных названий

**Примеры:**
```json
"jobtitle": "Vue Developer"           // ✅ Хорошо
"jobtitle": "Senior React Developer"  // ✅ Хорошо
"jobtitle": "Dev"                     // ❌ Слишком короткое
"jobtitle": "Full-Stack Web Developer with 5+ Years Experience" // ❌ Слишком длинное
```

### Поле `description`

**Назначение:** Подробное описание роли, навыков и опыта

**Структура описания:**
1. **Основная деятельность** - что вы делаете
2. **Технологии** - конкретные инструменты и фреймворки
3. **Опыт** - уровень экспертизы или достижения
4. **Специализация** - уникальные навыки

**Пример хорошего описания:**
```json
{
    "description": "Создаю высокопроизводительные веб-приложения на Vue.js с использованием Composition API, Pinia для управления состоянием и Nuxt.js для SSR. Специализируюсь на TypeScript, Vite и современных инструментах разработки. Имею опыт работы с Docker, AWS и CI/CD. Создал 20+ проектов для клиентов из e-commerce и fintech сфер."
}
```

**Пример плохого описания:**
```json
{
    "description": "Делаю сайты на Vue" // ❌ Слишком общее и короткое
}
```

### Поле `url`

**Назначение:** URL slug для навигации и идентификации роли

**Правила именования:**
- Только строчные буквы
- Дефисы вместо пробелов
- Без специальных символов
- Уникальное значение

**Примеры:**
```json
"url": "vue-developer"           // ✅ Хорошо
"url": "senior-react-developer"  // ✅ Хорошо
"url": "fullstack-developer"     // ✅ Хорошо
"url": "Vue Developer"           // ❌ Заглавные буквы
"url": "vue_developer"           // ❌ Подчеркивания
"url": "vue.developer"           // ❌ Точки
"url": "vue developer"           // ❌ Пробелы
```

## Примеры ролей

### Frontend Developer
```json
{
    "jobtitle": "Frontend Developer",
    "description": "Создаю современные и функциональные веб-интерфейсы с фокусом на пользовательский опыт. Специализируюсь на HTML5, CSS3, JavaScript (ES6+), React, Vue.js и современных инструментах сборки. Обеспечиваю кроссбраузерную совместимость, адаптивность и производительность.",
    "url": "frontend-developer"
}
```

### Backend Developer
```json
{
    "jobtitle": "Backend Developer",
    "description": "Разрабатываю серверную логику и API для веб-приложений. Специализируюсь на Node.js, Python (Django/Flask), PostgreSQL, MongoDB и микросервисной архитектуре. Имею опыт работы с Docker, Kubernetes и облачными платформами (AWS, GCP).",
    "url": "backend-developer"
}
```

### Mobile Developer
```json
{
    "jobtitle": "Mobile Developer",
    "description": "Создаю нативные и кроссплатформенные мобильные приложения. Специализируюсь на React Native, Flutter, Swift (iOS) и Kotlin (Android). Имею опыт работы с Firebase, App Store и Google Play. Создал 15+ приложений с общим количеством загрузок 100K+.",
    "url": "mobile-developer"
}
```

### DevOps Engineer
```json
{
    "jobtitle": "DevOps Engineer",
    "description": "Автоматизирую процессы разработки и развертывания приложений. Специализируюсь на Docker, Kubernetes, CI/CD (GitHub Actions, GitLab CI), мониторинге (Prometheus, Grafana) и инфраструктуре как код (Terraform). Обеспечиваю высокую доступность и безопасность систем.",
    "url": "devops-engineer"
}
```

### Data Scientist
```json
{
    "jobtitle": "Data Scientist",
    "description": "Анализирую данные и создаю модели машинного обучения для решения бизнес-задач. Специализируюсь на Python (pandas, scikit-learn, TensorFlow), SQL, статистическом анализе и визуализации данных. Имею опыт работы с большими данными и облачными платформами для ML.",
    "url": "data-scientist"
}
```

## Валидация и тестирование

### Проверка JSON синтаксиса

```bash
# Проверка конкретного файла
cat src/data/portfolios/vue-developer.json | jq .

# Проверка всех файлов портфолио
find src/data/portfolios -name "*.json" -exec jq . {} \;
```

### Проверка TypeScript типов

```bash
# Проверка типов при сборке
npm run build

# Проверка типов без сборки
npm run astro check
```

### Тестирование в браузере

1. Запустите проект: `npm run dev`
2. Откройте браузер и перейдите на сайт
3. Проверьте, что новая роль отображается
4. Убедитесь, что переключение работает
5. Проверьте консоль на ошибки

## Отладка проблем

### Роль не отображается

**Возможные причины:**
1. Неправильное имя файла
2. Невалидный JSON
3. Неправильная структура данных
4. Ошибки TypeScript

**Решение:**
```bash
# 1. Проверьте имя файла
ls src/data/portfolios/

# 2. Проверьте JSON
cat src/data/portfolios/your-role.json | jq .

# 3. Проверьте TypeScript
npm run astro check

# 4. Посмотрите в консоль браузера
```

### Ошибки TypeScript

**Частые ошибки:**
- Отсутствующие обязательные поля
- Неправильные типы данных
- Синтаксические ошибки в JSON

**Решение:**
```typescript
// Убедитесь, что структура соответствует интерфейсу
interface PortfolioItem {
    jobtitle: string;    // Обязательно
    description: string; // Обязательно
    url: string;        // Обязательно
}
```

### Проблемы с переключением

**Возможные причины:**
1. Дублирующиеся URL
2. Ошибки в JavaScript
3. Проблемы с загрузкой данных

**Решение:**
```javascript
// Проверьте уникальность URL
const urls = portfolios.map(p => p.url);
const uniqueUrls = new Set(urls);
if (urls.length !== uniqueUrls.size) {
    console.error('Duplicate URLs found');
}
```

## Автоматизация

### Скрипт создания роли

Создайте `scripts/create-role.js`:

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function createRole() {
    const roleName = await question('Введите название роли: ');
    const description = await question('Введите описание роли: ');
    
    const url = roleName.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
    
    const template = {
        jobtitle: roleName,
        description: description,
        url: url
    };
    
    const fileName = `${url}.json`;
    const filePath = path.join(__dirname, '../src/data/portfolios', fileName);
    
    fs.writeFileSync(filePath, JSON.stringify(template, null, 4));
    console.log(`✅ Создан файл: ${fileName}`);
    console.log(`📝 URL: ${url}`);
    
    rl.close();
}

function question(prompt) {
    return new Promise(resolve => {
        rl.question(prompt, resolve);
    });
}

createRole().catch(console.error);
```

Использование:
```bash
node scripts/create-role.js
```

### Валидация всех ролей

Создайте `scripts/validate-roles.js`:

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const portfoliosDir = path.join(__dirname, '../src/data/portfolios');
const files = glob.sync('*.json', { cwd: portfoliosDir });

let hasErrors = false;
const urls = new Set();

console.log('🔍 Проверка ролей портфолио...\n');

files.forEach(file => {
    const filePath = path.join(portfoliosDir, file);
    
    try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        // Проверка обязательных полей
        const required = ['jobtitle', 'description', 'url'];
        const missing = required.filter(field => !content[field]);
        
        if (missing.length > 0) {
            console.error(`❌ ${file}: Отсутствуют поля: ${missing.join(', ')}`);
            hasErrors = true;
        }
        
        // Проверка уникальности URL
        if (urls.has(content.url)) {
            console.error(`❌ ${file}: Дублирующийся URL: ${content.url}`);
            hasErrors = true;
        } else {
            urls.add(content.url);
        }
        
        // Проверка длины описания
        if (content.description && content.description.length < 50) {
            console.warn(`⚠️  ${file}: Описание слишком короткое (${content.description.length} символов)`);
        }
        
        if (!hasErrors) {
            console.log(`✅ ${file}: OK`);
        }
        
    } catch (error) {
        console.error(`❌ ${file}: Невалидный JSON - ${error.message}`);
        hasErrors = true;
    }
});

if (hasErrors) {
    console.log('\n❌ Найдены ошибки!');
    process.exit(1);
} else {
    console.log('\n✅ Все роли валидны!');
}
```

## Лучшие практики

### Именование файлов
- Используйте kebab-case: `vue-developer.json`
- Избегайте пробелов и специальных символов
- Делайте имена описательными

### Структура описания
- Начинайте с глагола действия
- Указывайте конкретные технологии
- Добавляйте количественные показатели
- Заканчивайте специализацией

### URL slugs
- Используйте только строчные буквы
- Заменяйте пробелы дефисами
- Избегайте специальных символов
- Делайте URL читаемыми

### Тестирование
- Всегда проверяйте JSON валидность
- Тестируйте в браузере
- Проверяйте TypeScript ошибки
- Валидируйте уникальность URL

## Миграция существующих ролей

### Изменение структуры

Если нужно добавить новые поля:

1. Обновите интерфейс `PortfolioItem`
2. Обновите все JSON файлы
3. Обновите компоненты

### Массовое обновление

```bash
# Добавление нового поля во все файлы
find src/data/portfolios -name "*.json" -exec sed -i 's/"url": "\(.*\)"/"url": "\1",\n    "skills": []/g' {} \;
```

### Резервное копирование

```bash
# Создание backup перед изменениями
cp -r src/data/portfolios src/data/portfolios.backup
```
