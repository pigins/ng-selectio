export type Item = string | number | Object;
export type SelectionMode = 'single'|'multiple';
export type Template<T extends Function> = null | string | T | {template: T, bypassSecurityTrustHtml: boolean};
