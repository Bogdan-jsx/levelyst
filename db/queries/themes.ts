import db from "../db";

interface Theme {
    name: string,
    title: string,
    primary: string,
    secondary: string,
    surface: string,
    onSurface: string,
    background: string,
    price: number,
}

export const addTheme = async (theme: Theme) => {
    try {
        await db.runAsync(`
            INSERT INTO themes 
            (name, title, primary_color, secondary_color, surface_color, on_surface_color, background_color, price)
            VALUES ($name, $title, $primary_color, $secondary_color, $surface_color, $on_surface_color, $background_color, $price)`,
        {$name: theme.name, $title: theme.title, $primary_color: theme.primary, $secondary_color: theme.secondary, $surface_color: theme.surface, $on_surface_color: theme.onSurface, $background_color: theme.background, $price: theme.price})
    } catch (error) {
        console.log(error);
    }
}

export const getThemes = async () => {
    try {
        const result = await db.getAllAsync("SELECT * FROM themes;");
        return result;
    } catch (error) {
        console.log(error)
    }
}

export const buyTheme = async (id: number, price: number) => {
    try {
        await db.runAsync("UPDATE themes SET is_owned = 1 WHERE id = $id", {$id: id})
        await db.runAsync("UPDATE profile SET coins = coins - $price;", {$price: price})
    } catch (error) {
        console.log(error);
    }
}