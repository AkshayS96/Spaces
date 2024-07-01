export enum NodeType {
    Leaf,
    Folder,
    Space,
};

export type LeafDataNode = {
    id: string,
    type: NodeType,
    url?: string,
    iconSrc?: string,
    name: string,
}

export type FolderDataNode = {
    id: string,
    name: string,
    type: NodeType,
    children: Array<ChildDataNodeType>
}

export type SpaceDataNode = {
    id: string,
    name: string,
    type: NodeType
    children: Array<ChildDataNodeType>
    themeColor?: string,
};

export type ChildDataNodeType = LeafDataNode | FolderDataNode
export type AllDataNodeType = ChildDataNodeType | SpaceDataNode