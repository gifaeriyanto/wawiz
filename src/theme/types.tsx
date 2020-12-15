import { SystemStyleObject, Theme } from '@chakra-ui/react';

export interface StyleOptions {
  theme: Theme;
  colorMode: 'light' | 'dark';
  colorScheme: string;
}

export type StyleInterpolation =
  | SystemStyleObject
  | ((options: StyleOptions) => SystemStyleObject);

export interface StyleConfig {
  parts?: string[];
  baseStyle: StyleInterpolation;
  sizes: { [size: string]: StyleInterpolation };
  variants: { [variant: string]: StyleInterpolation };
  defaultProps?: {
    [key: string]: string;
  };
}
