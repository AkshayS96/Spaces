export enum NodeType {
    Leaf,
    Folder,
    NewTab,
    Space,
};

export type LeafDataNode = {
    id: string,
    type: NodeType,
    tabId: number,
    url: string | undefined,
    name: string,
}

export type FolderDataNode = {
    id: string,
    name: string,
    type: NodeType,
    children: Array<ChildDataNodeType>
}


export type NewTabNode = {
    id: string,
    type: NodeType,
    name?: string,
    onClicked: () => void
}

export type SpaceDataNode = {
    id: string,
    name: string,
    type: NodeType
    children: Array<ChildDataNodeType>
};

export type ChildDataNodeType = LeafDataNode | FolderDataNode | NewTabNode
export type AllDataNodeType = ChildDataNodeType | SpaceDataNode