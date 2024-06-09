export type SpaceData = {
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