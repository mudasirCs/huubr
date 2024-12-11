// src/types/react-email.d.ts

declare module '@react-email/components' {
    import { ReactNode } from 'react';
  
    interface BaseProps {
      children?: ReactNode;
      style?: React.CSSProperties;
    }
  
    export function Body(props: BaseProps): JSX.Element;
    export function Button(props: BaseProps & { href?: string; pX?: number; pY?: number }): JSX.Element;
    export function Container(props: BaseProps): JSX.Element;
    export function Head(props: BaseProps): JSX.Element;
    export function Hr(props: BaseProps): JSX.Element;
    export function Html(props: BaseProps): JSX.Element;
    export function Preview(props: BaseProps): JSX.Element;
    export function Section(props: BaseProps): JSX.Element;
    export function Text(props: BaseProps): JSX.Element;
  }
  
  declare module '@react-email/render' {
    import { ReactElement } from 'react';
    export function render(component: ReactElement): Promise<string>;
  }