export enum ChildrenType {
    Leaf,
    Folder
};

export type LeafData = {
    id: string,
    dataType: ChildrenType,
    tabId: number,
    url: URL,
    name: string,
}

export type FolderData = {
    id: string,
    name: string,
    dataType: ChildrenType,
    expanded: boolean,
    children: Array<DataType>
}

export type DataType = LeafData | FolderData

export type SpaceData = {
    id: string,
    name: string,
    children: Array<DataType>
};