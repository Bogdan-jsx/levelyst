import db from "../db";

interface Theme {
    name: string,
    title: string,
    main_color_to_display: string,
    secondary_color_to_display: string,
    last_color_to_display: string,
    price: number,
}

export const addTheme = async (theme: Theme) => {
    try {
        await db.runAsync(`
            INSERT INTO themes 
            (name, title, main_color_to_display, secondary_color_to_display, last_color_to_display, price)
            VALUES ($name, $title, $main_color_to_display, $secondary_color_to_display, $last_color_to_display, $price)`,
        {$name: theme.name, $title: theme.title, $main_color_to_display: theme.main_color_to_display, $secondary_color_to_display: theme.secondary_color_to_display, $last_color_to_display: theme.last_color_to_display, $price: theme.price})
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