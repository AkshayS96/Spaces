export enum ChildrenType {
    Leaf,
    Folder
};

export type LeafData = {
    key: string,
    dataType: ChildrenType,
    tabId: number,
    url: URL,
    name: string,
}

export type FolderData = {
    key: string,
    name: string,
    dataType: ChildrenType,
    expanded: boolean,
    children: Array<FolderData | LeafData>
}
export type SpaceData = {
    id: number,
    name: string,
    isDefault: boolean,
    children: Array<FolderData | LeafData>
};