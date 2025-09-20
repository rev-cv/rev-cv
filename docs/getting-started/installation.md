# Установка и настройка

## Требования

Перед началом работы убедитесь, что у вас установлены:

- **Node.js** версии 18.0.0 или выше
- **npm** версии 8.0.0 или выше (или **yarn**, **pnpm**)
- **Git** для работы с репозиторием

### Проверка версий

```bash
node --version  # Должно быть >= 18.0.0
npm --version   # Должно быть >= 8.0.0
git --version   # Любая современная версия
```

## Установка

### 1. Клонирование репозитория

```bash
# Клонируйте репозиторий
git clone https://github.com/rev-cv/revin.git
cd revin

# Или если вы работаете с форком
git clone https://github.com/YOUR_USERNAME/revin.git
cd revin
```

### 2. Установка зависимостей

```bash
# Установка через npm
npm install

# Или через yarn
yarn install

# Или через pnpm
pnpm install
```

### 3. Проверка установки

```bash
# Проверьте, что все зависимости установлены
npm list

# Проверьте доступные скрипты
npm run
```

## Настройка окружения

### 1. Переменные окружения

Создайте файл `.env` в корне проекта:

```bash
# .env
NODE_ENV=development
PORT=4321
```

### 2. Конфигурация TypeScript

Проект уже настроен с TypeScript. Проверьте `tsconfig.json`:

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "**/*"],
  "exclude": ["dist"]
}
```

### 3. Конфигурация Astro

Основная конфигурация в `astro.config.mjs`:

```javascript
import { defineConfig } from 'astro/config';

export default defineConfig({
  // Ваши настройки
});
```

## Запуск проекта

### Режим разработки

```bash
# Запуск dev сервера
npm run dev

# Или с указанием порта
npm run dev -- --port 3000

# Или с host
npm run dev -- --host 0.0.0.0
```

Проект будет доступен по адресу: `http://localhost:4321`

### Сборка для продакшена

```bash
# Сборка проекта
npm run build

# Предварительный просмотр сборки
npm run preview
```

### Проверка кода

```bash
# Проверка TypeScript
npm run astro check

# Проверка стилей (если настроен stylelint)
npm run stylelint

# Форматирование кода (если настроен prettier)
npm run format
```

## Структура проекта

После установки структура проекта выглядит так:

```
revin/
├── docs/                    # Документация
├── public/                  # Статические файлы
├── src/
│   ├── assets/             # Ресурсы (SVG, изображения)
│   ├── components/         # Astro компоненты
│   ├── data/               # JSON данные
│   ├── layouts/            # Шаблоны страниц
│   ├── pages/              # Страницы сайта
│   ├── styles/             # Стили (CSS, SCSS)
│   └── types/              # TypeScript типы
├── astro.config.mjs        # Конфигурация Astro
├── package.json            # Зависимости и скрипты
├── tsconfig.json           # Конфигурация TypeScript
└── README.md               # Основная документация
```

## Первые шаги

### 1. Запуск проекта

```bash
npm run dev
```

Откройте браузер и перейдите на `http://localhost:4321`

### 2. Изучение кода

Начните с изучения основных файлов:

- `src/pages/index.astro` - главная страница
- `src/components/HeroBanner.astro` - главный баннер
- `src/data/portfolios/` - данные портфолио
- `src/types/TypePortfolio.ts` - TypeScript типы

### 3. Внесение изменений

Попробуйте внести небольшое изменение:

1. Откройте `src/data/portfolios/react-developer.json`
2. Измените `jobtitle` или `description`
3. Сохраните файл
4. Посмотрите, как изменения отображаются в браузере

## Решение проблем

### Ошибки установки

**Проблема:** `npm install` завершается с ошибкой

**Решение:**
```bash
# Очистите кэш npm
npm cache clean --force

# Удалите node_modules и package-lock.json
rm -rf node_modules package-lock.json

# Переустановите зависимости
npm install
```

**Проблема:** Ошибки TypeScript при сборке

**Решение:**
```bash
# Проверьте TypeScript конфигурацию
npm run astro check

# Перезапустите TypeScript сервер в IDE
# В VS Code: Ctrl+Shift+P -> "TypeScript: Restart TS Server"
```

### Проблемы с портами

**Проблема:** Порт 4321 уже занят

**Решение:**
```bash
# Используйте другой порт
npm run dev -- --port 3000

# Или найдите и остановите процесс на порту 4321
lsof -ti:4321 | xargs kill -9
```

### Проблемы с зависимостями

**Проблема:** Конфликты версий зависимостей

**Решение:**
```bash
# Проверьте версии Node.js и npm
node --version
npm --version

# Обновите npm до последней версии
npm install -g npm@latest

# Переустановите зависимости
rm -rf node_modules package-lock.json
npm install
```

## Дополнительные инструменты

### VS Code расширения

Рекомендуемые расширения для разработки:

- **Astro** - поддержка Astro файлов
- **TypeScript Importer** - автоимпорт TypeScript
- **SCSS IntelliSense** - поддержка SCSS
- **Prettier** - форматирование кода
- **ESLint** - линтинг JavaScript/TypeScript

### Настройка VS Code

Создайте `.vscode/settings.json`:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "files.associations": {
    "*.astro": "astro"
  }
}
```

### Git hooks

Настройте pre-commit hook для проверки кода:

```bash
# Установите husky
npm install --save-dev husky

# Настройте pre-commit hook
npx husky add .husky/pre-commit "npm run astro check"
```

## Следующие шаги

После успешной установки:

1. Изучите [архитектуру проекта](architecture/overview.md)
2. Прочитайте [руководство по стилю кода](contributing/code-style.md)
3. Изучите [управление портфолио](content/portfolio-management.md)
4. Начните разработку!

## Получение помощи

Если у вас возникли проблемы:

1. Проверьте [FAQ](faq.md)
2. Изучите [документацию Astro](https://docs.astro.build/)
3. Создайте [Issue](https://github.com/rev-cv/revin/issues)
4. Обратитесь к [сообществу](https://astro.build/chat)
