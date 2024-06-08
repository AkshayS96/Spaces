export type SpacesData = {
    id: number,
    name: string,
    isDefault: boolean,
    folders: Array<{
        name: string,
        tabs: Array<{
            tabId: number,
            url: URL,
            title: string
        }>
    }>
};