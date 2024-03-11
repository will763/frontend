export interface ICategory {
  categoria: string
}

export interface ICategoryResponse {
  tableCategoriesResult: ICategory[]
}

export interface ICategorySelectOptions {
  label: string;
  value: string;
}