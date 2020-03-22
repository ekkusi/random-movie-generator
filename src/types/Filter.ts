export default interface Filter {
  type: FilterType;
  value: number | number[] | null;
}

export enum FilterType {
  START_YEAR = 'START_YEAR',
  END_YEAR = 'END_YEAR',
  GENRE = 'GENRE',
  PAGE = 'PAGE',
}
