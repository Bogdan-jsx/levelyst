export const getDiffToMonday = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();

    return (dayOfWeek + 6) % 7;
}

export const getFirstDayOfWeek = () => {
    const today = new Date();

    const diffToMonday = getDiffToMonday();

    const monday = new Date(today);
    monday.setDate(today.getDate() - diffToMonday);

    return monday;
}