export const convertToList = (value?: string): string[] => {
    if (!value) return [];
    return value
        .split(",")
        .map((item: string) => item.trim().toLowerCase())
        .filter((item: string) => item.length > 0);
};