import { createContext, useContext, useEffect, useState } from 'react';
import { ChildDataNodeType, FolderDataNode, LeafDataNode, NodeType, SpaceDataNode } from './Types';
import { Utils } from './Utils';

export const useSpaceData = (spaceId: string, onSpaceDeleteParent: (spaceId: string) => void, onNewSpaceParent: () => void) => {
    const [spaceData, setSpaceData] = useState<SpaceDataNode>();
    const [spaceLoading, setSpaceLoading] = useState<boolean>(true);
    const [searchStr, setSearchStr] = useState<string>("");

    useEffect(() => {

        const onData = (storedSpaceData: any) => {
            if (storedSpaceData) {
                if (!storedSpaceData.themeColor) {
                    storedSpaceData.themeColor = "#fdf4f1";
                }
                setSpaceData(storedSpaceData);
                setSpaceLoading(false);
            }
        };



        const listener = (changes: { [key: string]: chrome.storage.StorageChange }) => {
            const spaceData = changes[`spaces-extension-space-${spaceId}`];
            if (spaceData) {
                onData(spaceData.newValue);
            }
        };

        chrome.storage.local.get(`spaces-extension-space-${spaceId}`, (items) => onData(items[`spaces-extension-space-${spaceId}`]));
        chrome.storage.local.onChanged.addListener(listener);
        return () => {
            chrome.storage.local.onChanged.removeListener(listener);
        }
    }, []);

    const onSpaceDataChange = (newSpaceData: SpaceDataNode) => {
        setSpaceData(newSpaceData);
        chrome.storage.local.set({ [`spaces-extension-space-${spaceData?.id}`]: newSpaceData });
    }

    const onSpaceNameChange = (newName: string) => {
        onSpaceDataChange({ ...spaceData!, name: newName });
    };

    const onSpaceDelete = () => {
        if (spaceData) {
            onSpaceDeleteParent(spaceData?.id)
        }
    }

    const onNewSpace = () => {
        onNewSpaceParent();
    }

    const onChildNodeMove = (dragNodeIds: string[], dragNodesData: ChildDataNodeType[], parentId: string | null, index: number) => {
        const removeDragNodes = (node: ChildDataNodeType): ChildDataNodeType | null => {
            if (dragNodeIds.find((dragNodeId) => dragNodeId === node.id)) {
                return null;
            }

            if (node.type === NodeType.Leaf) {
                return node;
            }

            const folderData = node as FolderDataNode;

            let newChildren: ChildDataNodeType[] = [];

            folderData.children.forEach((child) => {
                const updatedChild = removeDragNodes(child);
                if (updatedChild) {
                    newChildren.push(updatedChild);
                }
            });

            if (folderData.id === parentId) {
                newChildren = [...newChildren]
                newChildren.splice(index, 0, ...dragNodesData);
            }

            return {
                ...node,
                children: newChildren
            }
        }
        let newChildren: ChildDataNodeType[] = [];
        spaceData?.children.forEach((child: ChildDataNodeType) => {
            const updatedChild = removeDragNodes(child);
            if (updatedChild) {
                newChildren.push(updatedChild);
            }
        });

        if (!parentId) {
            newChildren.splice(index, 0, ...dragNodesData);
        }
        onSpaceDataChange({ ...spaceData!, children: newChildren });
    }

    const onChildNodeRename = (nodeId: string, newName: string) => {
        const renameNode = (node: ChildDataNodeType): ChildDataNodeType => {
            if (node.id === nodeId) {
                return {
                    ...node,
                    name: newName
                };
            }
            return node.type === NodeType.Leaf ? { ...node } : { ...node, children: (node as FolderDataNode).children.map((child) => renameNode(child)) };
        }

        const newSpaceData: SpaceDataNode = { ...spaceData!, children: spaceData!.children.map((child: ChildDataNodeType) => renameNode(child)) };
        onSpaceDataChange(newSpaceData);
    };

    const onChildNodeDelete = (ids: string[]) => {
        const removeDragNodes = (node: ChildDataNodeType): ChildDataNodeType | null => {
            if (ids.find((dragNodeId) => dragNodeId === node.id)) {
                return null;
            }

            if (node.type === NodeType.Leaf) {
                return node;
            }

            const folderData = node as FolderDataNode;
            let newChildren: ChildDataNodeType[] = [];
            folderData.children.forEach((child) => {
                const updatedChild = removeDragNodes(child);
                if (updatedChild) {
                    newChildren.push(updatedChild);
                }
            });

            return {
                ...node,
                children: newChildren
            }
        }
        let newChildren: ChildDataNodeType[] = [];
        spaceData?.children.forEach((child: ChildDataNodeType) => {
            const updatedChild = removeDragNodes(child);
            if (updatedChild) {
                newChildren.push(updatedChild);
            }
        });
        onSpaceDataChange({ ...spaceData!, children: newChildren });
    }

    const onChildFolderNodeCreate = (newChild: ChildDataNodeType, parentNodeId?: string, index?: number) => {
        const recurseTreeAndAdd = (node: (FolderDataNode | SpaceDataNode), index?: number): (FolderDataNode | SpaceDataNode) => {
            if (!parentNodeId || node.id === parentNodeId) {
                const newChildren = [...node.children]

                newChildren.splice(index ?? newChildren.length, 0, newChild);
                return {
                    ...node,
                    children: newChildren
                };
            }

            return {
                ...node,
                children: node.children.map((child) => {
                    if (child.type === NodeType.Leaf) {
                        return { ...child as LeafDataNode };
                    } else if (child.type === NodeType.Folder) {
                        return recurseTreeAndAdd(child as FolderDataNode, index);
                    }
                    return recurseTreeAndAdd(child as SpaceDataNode, index);
                })
            }
        }

        onSpaceDataChange({ ...recurseTreeAndAdd(spaceData!, index) });
        return newChild.id;
    }

    const addCurrentTab = (parentId: string) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs?: chrome.tabs.Tab[]) => {
            if (tabs?.length) {
                const tab = tabs[0];
                onChildFolderNodeCreate(Utils.Leaf(tabs[0].title ?? "New Tab", tabs[0].url, tabs[0].favIconUrl), parentId);
            }
        });
    }

    const onSetThemeColor = (newColor: string) => {
        onSpaceDataChange({ ...spaceData!, themeColor: newColor });
    }

    const onSearchChange = (searchStr: string) => {
        setSearchStr(searchStr);
    }

    const onSpaceEmojiChange = (nativeEmoji: string) => {
        onSpaceDataChange({ ...spaceData!, emoji: nativeEmoji });
    }

    return {
        spaceData,
        spaceLoading,
        searchStr,
        onSetThemeColor,
        onSpaceNameChange,
        onSpaceEmojiChange,
        onSpaceDelete,
        onNewSpace,
        onSearchChange,
        onChildNodeMove,
        onChildNodeRename,
        onChildFolderNodeCreate,
        onChildNodeDelete,
        addCurrentTab,
    }
}

export const SpaceContext = createContext<{
    spaceData?: SpaceDataNode,
    searchStr?: string,
    onSetThemeColor: (newColor: string) => void,
    onSpaceNameChange: (newName: string) => void,
    onSpaceEmojiChange: (nativeEmoji: string) => void,
    onSpaceDelete: () => void,
    onNewSpace: () => void,
    onSearchChange: (searchStr: string) => void,
    onChildNodeMove: (dragNodeIds: string[], dragNodesData: ChildDataNodeType[], parentId: string | null, index: number) => void,
    onChildNodeRename: (nodeId: string, newName: string) => void,
    onChildFolderNodeCreate: (newChild: ChildDataNodeType, parentNodeId?: string, index?: number) => string,
    onChildNodeDelete: (ids: string[]) => void,
    addCurrentTab: (parentId: string) => void,
}>(
    {
        onSetThemeColor: (_newColor: string) => { },
        onSpaceNameChange: (_newName: string) => { },
        onSpaceEmojiChange: (nativeEmoji: string) => { },
        onSpaceDelete: () => { },
        onNewSpace: () => { },
        onSearchChange: (_searchStr: string) => { },
        onChildNodeMove: (_dragNodeIds: string[], _dragNodesData: ChildDataNodeType[], _parentId: string | null, _index: number) => { },
        onChildNodeRename: (_nodeId: string, _newName: string) => { },
        onChildFolderNodeCreate: (_newChild: ChildDataNodeType, _parentNodeId?: string, _index?: number) => { return "" },
        onChildNodeDelete: (_ids: string[]) => { },
        addCurrentTab: (parentId: string) => { },
    }
);


