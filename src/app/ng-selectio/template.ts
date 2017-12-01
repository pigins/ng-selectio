export type Template<T extends Function> = null | string | T | {template: T, bypassSecurityTrustHtml: boolean};

