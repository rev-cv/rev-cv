interface PortfolioItem {
    jobtitle: string;
    description: string;
    url: string;
}

type EagerGlobModule<T> = {
    default: T;
};

export type TypePortfoliosGlob = Record<string, EagerGlobModule<PortfolioItem>>;
