/**
 * Интерфейс для блока "О себе"
 * @interface AboutMe
 */
export interface AboutMe {
    /** Уникальный идентификатор блока */
    id: string;
    /** Заголовок блока */
    title: string;
    /** Описание блока */
    descr: string;
}
/**
 * Интерфейс для навыка
 * @interface Skill
 */
export interface Skill {
    /** Название навыка */
    name: string;
    /** Уровень владения (0-100) */
    level: number;
    /** Описание навыка */
    description: string;
}

/**
 * Интерфейс для инструмента
 * @interface Tool
 */
export interface Tool {
    /** Название инструмента */
    name: string;
    /** Описание применения инструмента */
    description: string;
}

/**
 * Интерфейс для качества/компетенции
 * @interface Quality
 */
export interface Quality {
    /** Название качества */
    name: string;
    /** Описание качества */
    description: string;
}

/**
 * Интерфейс для элементов портфолио
 * @interface PortfolioItem
 */
export interface PortfolioItem {
    /** Название роли разработчика */
    jobtitle: string;
    /** Подробное описание роли и навыков */
    description: string;
    /** URL slug для навигации */
    url: string;
    /** О себе (опционально) */
    aboutme: AboutMe[];
    /** Навыки (опционально) */
    skills: Skill[];
    /** Инструменты (опционально) */
    tools: Tool[];
    /** Качества и компетенции (опционально) */
    quality: Quality[];
}

/**
 * Тип для модулей, загруженных через import.meta.glob с eager: true
 * @template T - тип данных модуля
 */
type EagerGlobModule<T> = {
    /** Экспортируемые по умолчанию данные */
    default: T;
};

/**
 * Тип для динамической загрузки портфолио через import.meta.glob
 * Ключ - путь к файлу, значение - модуль с данными портфолио
 */
export type TypePortfoliosGlob = Record<string, EagerGlobModule<PortfolioItem>>;
