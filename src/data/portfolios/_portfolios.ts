import type {
    TypePortfoliosGlob,
    PortfolioItem,
} from "../../types/TypePortfolio";

// возвращает все портфолио из JSON-файлов
export function loadAllPortfolios(): PortfolioItem[] {
    const portfoliosJSON: TypePortfoliosGlob = import.meta.glob("./*.json", {
        eager: true,
    });

    const allPortfolios: PortfolioItem[] = [];
    for (const path in portfoliosJSON) {
        const portfolio = portfoliosJSON[path].default;
        allPortfolios.push(portfolio);
    }
    return allPortfolios;
}
