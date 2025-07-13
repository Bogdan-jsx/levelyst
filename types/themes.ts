export interface AddTheme {
    name: string,
    title: string,
    primary: string,
    secondary: string,
    surface: string,
    onSurface: string,
    background: string,
    price: number,
}

export interface ThemeItem {
    id: number;
    title: string;
    primary_color: string;
    secondary_color: string;
    surface_color: string;
    on_surface_color: string;
    background_color: string;
    price: number;
    is_owned: 1 | 0;
    name: string;
}