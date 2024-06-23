
export class Utils {
    static capitalize(str: string) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    static getUniqueIdNumber(): number {
        return Date.now();
    }

    static getUniqueId(): string {
        return Date.now().toString();
    }
}