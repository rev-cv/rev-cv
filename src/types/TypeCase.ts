export interface TypeCase {
    title: string;
    url: string;
    tech: string[];
    cover: string;
    media: string[];
    code_url: string;
    demo_url: string;
    descr: string;
}

export interface TypeProjectCase {
    metadata: TypeCase;
    htmlContent: string;
}
