export const getStorageItem = (key: string): string | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        return window.localStorage.getItem(key);
    } catch (error) {
        console.error('Failed to read localStorage item:', error);
        return null;
    }
};

export const setStorageItem = (key: string, value: string): void => {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        window.localStorage.setItem(key, value);
    } catch (error) {
        console.error('Failed to write localStorage item:', error);
    }
};

export const removeStorageItem = (key: string): void => {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        window.localStorage.removeItem(key);
    } catch (error) {
        console.error('Failed to remove localStorage item:', error);
    }
};