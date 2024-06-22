
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { ChildrenType, FolderData, LeafData, SpaceData } from './Types';
import type { GetProps, TreeDataNode } from 'antd';
import { Button, ConfigProvider, Dropdown, Flex, notification, Tree, Typography } from 'antd';
import { FolderClose, FolderFullClose, FolderOpen } from '../common/Icons';
import type { NotificationArgsProps } from 'antd';

import "./SpaceContentComponent.css"
import { BasicDataNode, EventDataNode } from 'antd/es/tree';
import { ItemType } from 'antd/es/menu/interface';
import { NotificationPlacements } from 'antd/es/notification/interface';
import { PlusOutlined } from '@ant-design/icons';
import { Utils } from '../utils/Utils';

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;


const { DirectoryTree } = Tree;
const { Text } = Typography;

type NotificationPlacement = NotificationArgsProps['placement'];

type Props = Readonly<{
    space: SpaceData
    onDataChange: (newSpaceData: SpaceData) => void,
    onNewTab: () => void,
}>;

function SpaceContentComponent(props: Props) {

    const [expandState, setExpandState] = useState<{ [key: string]: boolean }>({});
    const [selectedNodes, setSelectedNodes] = useState<{ [key: string]: EventDataNode<BasicDataNode | TreeDataNode> }>({});
    const [contextMenuNode, setContextMenuNode] = useState<TreeDataNode>();
    const [isEditClickedForTreeNode, setIsEditClickedForTreeNode] = useState<{ [key: string]: boolean }>({});

    const [notificationApi, contextHolder] = notification.useNotification();
    const parsedTreeData = ((space: SpaceData): TreeDataNode[] => {

        const recurseChild = (child: FolderData | LeafData): TreeDataNode => {
            if (child.dataType === ChildrenType.Leaf) {
                const leafData = child as LeafData;
                return {
                    title: leafData.name,
                    key: leafData.key,
                    isLeaf: true,
                };
            }

            const folderData = child as FolderData;

            const folderTreeNodeData: TreeDataNode = {
                title: folderData.name,
                key: folderData.key,
                children: []
            }

            for (const child of folderData.children) {
                const data = recurseChild(child);
                folderTreeNodeData.children?.push(recurseChild(child));
            }

            return folderTreeNodeData;
        }

        return space.children.map((child) => recurseChild(child));
    })(props.space);

    const onTreeNodeSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
        if (info.nativeEvent.metaKey) {
            const tempSelectedNodes = selectedNodes;
            if (!keys.includes(info.node.key)) {
                delete tempSelectedNodes[info.node.key.toString()];
            } else {
                tempSelectedNodes[info.node.key.toString()] = info.node
            }
            setSelectedNodes({ ...tempSelectedNodes });
        } else {
            setSelectedNodes({});
        }
    };

    const onTreeNodeExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
        if (info.expanded) {
            setExpandState({ ...expandState, [info.node.key.toString()]: true });
        } else {
            setExpandState({ ...expandState, [info.node.key.toString()]: false });
        }
    };

    const onCopyLinks = (items: string[]) => {
        items = (items ?? []).filter((value) => value.length > 0)
        if (items.length > 0) {
            // Change this to copy urls instead of item keys
            navigator.clipboard.writeText(items.join("\n"));
            notificationApi.success({
                message: `Copied ${items.length} items`,
                placement: "top"
            });
        }
    };

    const onRenameFolder = (key: React.Key) => {
        setIsEditClickedForTreeNode({ ...isEditClickedForTreeNode, [key.toString()]: true });
    }

    const onFolderNameChange = (key: string, newName: string) => {
        const recurseChild = (child: FolderData | LeafData): (FolderData | LeafData) => {
            if (child.key === key) {
                return {
                    ...child,
                    name: newName
                }
            } else if (child.dataType === ChildrenType.Leaf) {
                return { ...child };
            }
            return {
                ...child,
                children: (child as FolderData).children.map((child) => recurseChild(child))
            }
        }

        const newSpaceChildren = props.space.children.map((child) => {
            return recurseChild(child);
        });

        props.onDataChange({ ...props.space, children: newSpaceChildren });
        setContextMenuNode(undefined);
    }

    const onNestedFolderCreate = (key: string | undefined) => {
        if (!key) {
            return;
        }
        const recurseChild = (child: FolderData | LeafData): (FolderData | LeafData) => {
            if (child.dataType === ChildrenType.Leaf) {
                return { ...child };
            }

            if (child.key === key) {
                const folderData = child as FolderData;
                return {
                    ...child,
                    children: [...folderData.children, {
                        key: Utils.getUniqueId(),
                        name: "Untitled",
                        dataType: ChildrenType.Folder,
                        expanded: true,
                        children: [],
                    }]
                }
            }
            return {
                ...child,
                children: (child as FolderData).children.map((child) => recurseChild(child))
            }
        }

        const newSpaceChildren = props.space.children.map((child) => {
            return recurseChild(child);
        });

        props.onDataChange({ ...props.space, children: newSpaceChildren });
        setContextMenuNode(undefined);
    }

    const onFolderDelete = (key: string | undefined) => {
        if (!key) {
            return;
        }
        const recurseChild = (child: FolderData | LeafData): (FolderData | LeafData | undefined) => {
            if (child.key === key) {
                return undefined
            }
            if (child.dataType === ChildrenType.Leaf) {
                return { ...child };
            }
            return {
                ...child,
                children: (child as FolderData).children.map((child) => recurseChild(child)).filter((newChild) => !!newChild) as (FolderData | LeafData)[]
            }
        }

        const newSpaceChildren = props.space.children.map((child) => {
            return recurseChild(child);
        }).filter((newChild) => !!newChild);
        props.onDataChange({ ...props.space, children: newSpaceChildren as (FolderData | LeafData)[] });
        setContextMenuNode(undefined);
    }


    const getTreeNodeDropdownMenuItems = useCallback((): ItemType[] => {
        const menuItems: ItemType[] = [];

        const selectedNodesValues = Object.values(selectedNodes);
        const isContextMenuNodeInSelectedNodes = selectedNodesValues.some((node) => node.key.toString() === contextMenuNode?.key.toString());
        const isLeaf = isContextMenuNodeInSelectedNodes ? false : contextMenuNode?.isLeaf;
        const isFolder = isContextMenuNodeInSelectedNodes ? false : !contextMenuNode?.isLeaf;
        const isMultileaf = (!isLeaf && !isFolder && selectedNodesValues.every((node) => node.isLeaf));

        if (isLeaf) {
            // Single leaf node
            menuItems.push(...[{
                label: "Copy Link",
                key: "context_menu_single_leaf_copy_link",
                onClick: () => { onCopyLinks([contextMenuNode?.key.toString() ?? '']) }
            }, {
                label: "Rename...",
                key: "context_menu_single_leaf_rename",
                onClick: () => { onRenameFolder(contextMenuNode?.key.toString() ?? '') }
            }, {
                label: "Delete",
                key: "context_menu_single_leaf_delete",
                onClick: () => { onFolderDelete(contextMenuNode?.key.toString()) }
            }, {
                label: "Duplicate",
                key: "context_menu_single_leaf_duplicate",
            }]);
        } else if (isFolder) {
            menuItems.push(...[{
                label: "New Nested Folder",
                key: "context_menu_single_folder_new_nested_folder",
                onClick: () => { onNestedFolderCreate(contextMenuNode?.key.toString()) }
            }, {
                label: "Rename...",
                key: "context_menu_single_folder_rename",
                onClick: () => { onRenameFolder(contextMenuNode?.key.toString() ?? '') }
            },
            {
                label: "Duplicate",
                key: "context_menu_single_folder_duplicate",
            },
            {
                label: "Delete",
                key: "context_menu_single_folder_delete",
                onClick: () => { onFolderDelete(contextMenuNode?.key.toString()) }
            }]);
        } else if (isMultileaf) {
            menuItems.push(...[
                {
                    label: "Copy Links",
                    key: "context_menu_multiple_leaf_copy_links",
                    // Fix contextMenuNode copy as well
                    onClick: () => { onCopyLinks((selectedNodesValues.map((node) => node.key.toString()))) }
                },
                {
                    label: `New Folder with ${selectedNodesValues.length} Items`,
                    key: "context_menu_multiple_leaf_new_folder_with_items"
                },
                {
                    label: "Delete",
                    key: "context_menu_multiple_leaf_delete",
                    // onClick: () => { onFolderDelete(contextMenuNode?.key.toString())}
                }]);
        } else {
            menuItems.push(...[
                {
                    label: "Delete",
                    key: "context_menu_multiple_leaf_and_folder_delete"
                }]);
        }

        return menuItems;
    }, [selectedNodes, contextMenuNode]);

    return (
        <>
            {contextHolder}
            <Flex vertical style={{ height: '100%', width: '100%' }}>
                <DirectoryTree
                    expandAction="click"
                    multiple
                    onSelect={onTreeNodeSelect}
                    onExpand={onTreeNodeExpand}
                    treeData={parsedTreeData}
                    showIcon={false}
                    switcherIcon={null}
                    titleRender={(node: TreeDataNode): ReactNode => {
                        let titleNode: ReactNode = null;
                        if (node.isLeaf) {
                            titleNode = <Typography>{node.title?.toString()}</Typography>
                        } else {
                            const isMultilevelDirectory = node?.children?.some((child) => !child.isLeaf);
                            const folderIcon = (expandState[node.key.toString()]) ? <FolderOpen height='2em' width='2em' /> : (isMultilevelDirectory ? <FolderFullClose height='2em' width='2em' /> : <FolderClose height='2em' width='2em' />)
                            titleNode = <>{folderIcon}
                                {
                                    <ConfigProvider theme={{
                                        components: {
                                            Input: {
                                                activeShadow: '',
                                                padding: 0,
                                                margin: 0,
                                                borderRadius: 0
                                            },
                                        }
                                    }}>
                                        <Text strong editable={{
                                            editing: isEditClickedForTreeNode[node.key.toString()] ?? false,
                                            enterIcon: null,
                                            maxLength: 30,
                                            triggerType: ['text'],
                                            onChange: (newName: string) => {
                                                if (newName.length > 0) {
                                                    onFolderNameChange(node.key.toString(), newName);
                                                }
                                                setIsEditClickedForTreeNode({ ...isEditClickedForTreeNode, [node.key.toString()]: false });
                                            },
                                            onCancel: () => {
                                                setIsEditClickedForTreeNode({ ...isEditClickedForTreeNode, [node.key.toString()]: false });
                                            },
                                        }}>{node.title?.toString()}
                                        </Text>
                                    </ConfigProvider>
                                }</>
                        }
                        return (
                            <Dropdown placement='bottom' trigger={["contextMenu"]} arrow={true} menu={{
                                items: getTreeNodeDropdownMenuItems(),
                            }}>
                                <Flex
                                    onContextMenu={(event) => {
                                        event?.stopPropagation();
                                        setContextMenuNode(node)
                                    }}
                                    gap={5}
                                    align='center'
                                    style={{ padding: 8, backgroundColor: (selectedNodes[node.key.toString()] ? 'rgba(0, 0, 0, 0.04)' : 'transparent') }} className='space-content-component-tree-node-title'>
                                    {titleNode}
                                </Flex >
                            </Dropdown >
                        );
                    }}
                />
                <Flex align='center' justify='flex-start' gap={12} style={{ marginLeft: 6, padding: 12, cursor: 'pointer' }} className='space-content-component-new-tab-button-holder' onClick={props.onNewTab}>
                    <PlusOutlined /> <Typography>New Tab</Typography>
                </Flex>
            </Flex >

        </>
    );
}

export default SpaceContentComponent;


// Things to fix in this
// 1. Dropdrop not closing when clicking outside
// 2. Selection is not clearing when clicking outside the div