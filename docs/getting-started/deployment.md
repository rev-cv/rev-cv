# Деплой

## Обзор

Этот документ описывает процесс развертывания проекта на различных платформах. Проект представляет собой статический сайт, который можно развернуть на любой платформе, поддерживающей статические сайты.

## Подготовка к деплою

### 1. Сборка проекта

```bash
# Убедитесь, что все зависимости установлены
npm install

# Соберите проект для продакшена
npm run build

# Проверьте сборку локально
npm run preview
```

### 2. Проверка сборки

```bash
# Проверьте, что папка dist создана
ls -la dist/

# Проверьте размер сборки
du -sh dist/

# Проверьте содержимое
ls -la dist/
```

### 3. Настройка окружения

Создайте файл `.env.production` для продакшена:

```bash
# .env.production
NODE_ENV=production
SITE_URL=https://your-domain.com
```

## Vercel (Рекомендуется)

### 1. Автоматический деплой через GitHub

1. Подключите репозиторий к Vercel:
    - Перейдите на [vercel.com](https://vercel.com)
    - Нажмите "New Project"
    - Выберите ваш GitHub репозиторий
    - Настройте параметры сборки

2. Настройки сборки:

    ```
    Framework Preset: Astro
    Build Command: npm run build
    Output Directory: dist
    Install Command: npm install
    ```

3. Деплой:
    - Vercel автоматически соберет и развернет проект
    - Каждый push в main ветку будет запускать новый деплой

### 2. Ручной деплой через CLI

```bash
# Установите Vercel CLI
npm install -g vercel

# Войдите в аккаунт
vercel login

# Деплой
vercel

# Деплой в продакшен
vercel --prod
```

### 3. Настройка домена

1. В панели Vercel перейдите в Settings → Domains
2. Добавьте ваш домен
3. Настройте DNS записи согласно инструкциям

### 4. Переменные окружения

В панели Vercel:

1. Перейдите в Settings → Environment Variables
2. Добавьте необходимые переменные:
    ```
    NODE_ENV=production
    SITE_URL=https://your-domain.com
    ```

## Netlify

### 1. Автоматический деплой

1. Подключите репозиторий к Netlify:
    - Перейдите на [netlify.com](https://netlify.com)
    - Нажмите "New site from Git"
    - Выберите ваш репозиторий

2. Настройки сборки:

    ```
    Build command: npm run build
    Publish directory: dist
    ```

3. Деплой:
    - Netlify автоматически соберет и развернет проект
    - Каждый push в main ветку будет запускать новый деплой

### 2. Ручной деплой через CLI

```bash
# Установите Netlify CLI
npm install -g netlify-cli

# Войдите в аккаунт
netlify login

# Деплой
netlify deploy --dir=dist

# Деплой в продакшен
netlify deploy --prod --dir=dist
```

### 3. Настройка домена

1. В панели Netlify перейдите в Site settings → Domain management
2. Добавьте ваш домен
3. Настройте DNS записи

## GitHub Pages

### 1. Настройка GitHub Actions

Создайте `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
    push:
        branches:
            - main

# Разрешения для GITHUB_TOKEN для развертывания на GitHub Pages
permissions:
    contents: read
    pages: write
    id-token: write

# Разрешаем только один одновременный деплой, отменяя предыдущие запуски
concurrency:
    group: "pages"
    cancel-in-progress: true

jobs:
    build:
        runs-on: ubuntu-latest
        steps:
            - name: Checkout
              uses: actions/checkout@v4

            - name: Setup Node.js
              uses: actions/setup-node@v4
              with:
                  node-version: "20"
                  cache: "npm"

            - name: Install dependencies
              run: npm ci

            - name: Build
              run: npm run build
              env:
                  BASE_URL: /${{ github.event.repository.name }}

            - name: Setup Pages
              uses: actions/configure-pages@v4

            - name: Upload artifact
              uses: actions/upload-pages-artifact@v3
              with:
                  path: ./dist

    deploy:
        needs: build
        runs-on: ubuntu-latest
        environment:
            name: github-pages
            url: ${{ steps.deployment.outputs.page_url }}
        steps:
            - name: Deploy to GitHub Pages
              id: deployment
              uses: actions/deploy-pages@v4
```

### 2. Настройка репозитория

1. Перейдите в Settings → Pages
2. Выберите "GitHub Actions" как источник
3. Деплой запустится автоматически при push в main

## Firebase Hosting

### 1. Настройка Firebase

```bash
# Установите Firebase CLI
npm install -g firebase-tools

# Войдите в аккаунт
firebase login

# Инициализируйте проект
firebase init hosting
```

### 2. Конфигурация

Создайте `firebase.json`:

```json
{
    "hosting": {
        "public": "dist",
        "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
        "rewrites": [
            {
                "source": "**",
                "destination": "/index.html"
            }
        ]
    }
}
```

### 3. Деплой

```bash
# Соберите проект
npm run build

# Деплой
firebase deploy
```

## AWS S3 + CloudFront

### 1. Настройка S3

```bash
# Установите AWS CLI
pip install awscli

# Настройте credentials
aws configure
```

### 2. Создание bucket

```bash
# Создайте bucket
aws s3 mb s3://your-bucket-name

# Настройте статический хостинг
aws s3 website s3://your-bucket-name --index-document index.html
```

### 3. Деплой

```bash
# Соберите проект
npm run build

# Загрузите файлы
aws s3 sync dist/ s3://your-bucket-name --delete

# Настройте права доступа
aws s3api put-bucket-policy --bucket your-bucket-name --policy file://policy.json
```

## Docker

### 1. Создание Dockerfile

```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Сборка и запуск

```bash
# Соберите образ
docker build -t revin-portfolio .

# Запустите контейнер
docker run -p 80:80 revin-portfolio
```

## Мониторинг и аналитика

### 1. Google Analytics

Добавьте в `Layout.astro`:

```html
<!-- Google Analytics -->
<script
    async
    src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag() {
        dataLayer.push(arguments);
    }
    gtag("js", new Date());
    gtag("config", "GA_MEASUREMENT_ID");
</script>
```

### 2. Мониторинг производительности

```html
<!-- Web Vitals -->
<script>
    function sendToAnalytics(metric) {
        gtag("event", metric.name, {
            value: Math.round(metric.value),
            event_label: metric.id,
            non_interaction: true,
        });
    }
</script>
```

### 3. Обработка ошибок

```javascript
// Отслеживание ошибок
window.addEventListener("error", (event) => {
    console.error("Error:", event.error);
    // Отправка в сервис мониторинга
});
```

## Оптимизация для продакшена

### 1. Сжатие файлов

```javascript
// astro.config.mjs
import { defineConfig } from "astro/config";

export default defineConfig({
    build: {
        assets: "assets",
        inlineStylesheets: "auto",
    },
    compressHTML: true,
    vite: {
        build: {
            minify: "terser",
            rollupOptions: {
                output: {
                    manualChunks: {
                        vendor: ["react", "react-dom"],
                    },
                },
            },
        },
    },
});
```

### 2. Кэширование

Настройте заголовки кэширования:

```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 3. CDN

Используйте CDN для статических ресурсов:

```html
<!-- Замените локальные пути на CDN -->
<link rel="stylesheet" href="https://cdn.example.com/styles.css" />
<script src="https://cdn.example.com/script.js"></script>
```

## Безопасность

### 1. HTTPS

Убедитесь, что сайт работает по HTTPS:

```javascript
// Проверка HTTPS
if (location.protocol !== "https:" && location.hostname !== "localhost") {
    location.replace(
        "https:" +
            window.location.href.substring(window.location.protocol.length),
    );
}
```

### 2. Заголовки безопасности

```javascript
// vercel.json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 3. CSP (Content Security Policy)

```html
<meta
    http-equiv="Content-Security-Policy"
    content="default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
/>
```

## Troubleshooting

### 1. Ошибки сборки

```bash
# Очистите кэш
npm run clean
rm -rf node_modules package-lock.json
npm install

# Пересоберите
npm run build
```

### 2. Проблемы с путями

```javascript
// Убедитесь, что base URL настроен правильно
// astro.config.mjs
export default defineConfig({
    base: "/your-repo-name/", // для GitHub Pages
    // или
    base: "/", // для корневого домена
});
```

### 3. Проблемы с роутингом

```javascript
// Настройте redirects для SPA
// vercel.json
{
  "redirects": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Автоматизация

### 1. GitHub Actions

Создайте `.github/workflows/deploy.yml` для автоматического деплоя:

```yaml
name: Deploy

on:
    push:
        branches: [main]

jobs:
    deploy:
        runs-on: ubuntu-latest
        steps:
            - uses: actions/checkout@v3
            - uses: actions/setup-node@v3
              with:
                  node-version: "18"
            - run: npm ci
            - run: npm run build
            - run: npm run deploy
```

### 2. Скрипты деплоя

Добавьте в `package.json`:

```json
{
    "scripts": {
        "deploy": "npm run build && vercel --prod",
        "deploy:netlify": "npm run build && netlify deploy --prod --dir=dist"
    }
}
```

## Мониторинг деплоя

### 1. Проверка статуса

```bash
# Проверьте статус деплоя
curl -I https://your-domain.com

# Проверьте время ответа
curl -w "@curl-format.txt" -o /dev/null -s https://your-domain.com
```

### 2. Логи

```bash
# Vercel
vercel logs

# Netlify
netlify logs
```

### 3. Алерты

Настройте алерты для:

- Время отклика > 2 секунд
- Ошибки 5xx > 1%
- Доступность < 99.9%
