declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';
  export interface IconProps extends SVGProps<SVGSVGElement> {
    size?: string | number;
    absoluteStrokeWidth?: boolean;
  }
  export type Icon = FC<IconProps>;
  export const Search: Icon;
  export const Menu: Icon;
  export const X: Icon;
  export const ShoppingCart: Icon;
  export const Gift: Icon;
  export const LogOut: Icon;
  export const User: Icon;
  export const Settings: Icon;
  export const ChevronLeft: Icon;
}

declare module 'react-router-dom' {
  import { ComponentType, ReactNode } from 'react';
  
  export interface RouteProps {
    path?: string;
    element?: ReactNode;
    children?: ReactNode;
  }

  export interface LinkProps {
    to: string;
    className?: string;
    children?: ReactNode;
  }

  export interface NavigateFunction {
    (to: string, options?: { replace?: boolean; state?: any }): void;
  }

  export interface Location {
    pathname: string;
    search: string;
    hash: string;
    state: any;
  }

  export function useNavigate(): NavigateFunction;
  export function useLocation(): Location;
  export const Link: ComponentType<LinkProps>;
  export const Route: ComponentType<RouteProps>;
  export const Routes: ComponentType<{ children?: ReactNode }>;
  export const BrowserRouter: ComponentType<{ children?: ReactNode }>;
} 