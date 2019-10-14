export interface Links {
    name: string;
    link: string;
    isActive: (pathname: string) => any;
}
export declare const normalLinks: Links[];
