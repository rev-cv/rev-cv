export interface TypeCase {
    title: string;
    portfolio_url: string;
    tech: string[];
    video: string;
    pictures: string[];
    code_url: string;
    demo_url: string;
    descr: string;
    order: number;
}

export interface TypeProjectCase {
    frontmatter: TypeCase;
    Content: any | null;
}
