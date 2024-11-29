
export interface AdvancedSearchQuery{
    query?:string,
    page?:number,
    perPage?:number,
    type?:string,
    genres?: string[],
    format?:string,
    status?:string,
    year?:number,
    season?:string
}