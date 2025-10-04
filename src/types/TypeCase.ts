export interface TypeCase {
    title: string;
    url: string;
    tech: string[];
    video: string;
    pictures: string[];
    code_url: string;
    demo_url: string;
    descr: string;
}

export interface TypeProjectCase {
    metadate: TypeCase;
    htmlContent: string;
}
