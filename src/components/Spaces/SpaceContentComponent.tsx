
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { SpaceData } from './Types';
import type { GetProps, TreeDataNode } from 'antd';
import { Dropdown, Flex, Popover, Tree, Typography } from 'antd';
import { FolderClose, FolderFullClose, FolderOpen } from '../common/Icons';

import "./SpaceContentComponent.css"
import { BasicDataNode, EventDataNode } from 'antd/es/tree';
import { ItemType } from 'antd/es/menu/interface';

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;


const { DirectoryTree } = Tree;
const { Text } = Typography;

const treeData: TreeDataNode[] = [
    {
        title: 'parent 0',
        key: '0-0',
        children: [
            { title: 'leaf 0-0', key: '0-0-0', isLeaf: true },
            { title: 'leaf 0-1', key: '0-0-1', isLeaf: true },
        ],
    },
    {
        title: 'parent 1',
        key: '0-1',
        children: [
            { title: 'leaf 1-0', key: '0-1-0', isLeaf: true },
            { title: 'leaf 1-1', key: '0-1-1', isLeaf: true },
            {
                title: "Parent 1-1",
                key: "0-1-11",
                // children: [
                //     { title: 'leaf 1-0', key: '0-1-11-0', isLeaf: true },
                //     { title: 'leaf 1-1', key: '0-1-11-1', isLeaf: true }],
            }
        ],
    },
];


type Props = Readonly<{
    space: SpaceData
}>;

function SpaceContentComponent(props: Props) {
    const [expandState, setExpandState] = useState<{ [key: string]: boolean }>({});
    const [selectedNodes, setSelectedNodes] = useState<{ [key: string]: EventDataNode<BasicDataNode | TreeDataNode> }>({});
    const [contextMenuNode, setContextMenuNode] = useState<TreeDataNode>();

    console.log(selectedNodes);

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
        if (!items) {
            return
        }
        console.log(items);
    };

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
                label: "Share",
                key: "context_menu_single_leaf_share"
            }, {
                label: "Rename...",
                key: "context_menu_single_leaf_rename"
            }, {
                label: "Delete",
                key: "context_menu_single_leaf_delete"
            }, {
                label: "Duplicate",
                key: "context_menu_single_leaf_duplicate",
            }]);
        } else if (isFolder) {
            menuItems.push(...[{
                label: "New Nested Folder",
                key: "context_menu_single_folder_new_nested_folder"
            }, {
                label: "Rename...",
                key: "context_menu_single_folder_rename"
            },
            {
                label: "Duplicate",
                key: "context_menu_single_folder_duplicate",
            },
            {
                label: "Delete",
                key: "context_menu_single_folder_delete"
            }]);
        } else if (isMultileaf) {
            menuItems.push(...[
                {
                    label: "Copy Links",
                    key: "context_menu_multiple_leaf_copy_links",
                    onClick: () => { onCopyLinks(selectedNodesValues.map((node) => node.key.toString())) }
                },
                {
                    label: `New Folder with ${selectedNodesValues.length} Items`,
                    key: "context_menu_multiple_leaf_new_folder_with_items"
                },
                {
                    label: "Delete",
                    key: "context_menu_multiple_leaf_delete"
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
        <Dropdown placement='bottom' trigger={["contextMenu"]} arrow={true} menu={{
            items: getTreeNodeDropdownMenuItems(),
        }}>
            <Flex vertical style={{ height: '100%' }}>
                <DirectoryTree
                    expandAction="click"
                    multiple
                    onSelect={onTreeNodeSelect}
                    onExpand={onTreeNodeExpand}
                    treeData={treeData}
                    showIcon={false}
                    // onRightClick={(info) => { info.event.stopPropagation(); setPopoverParent(info.node.key.toString()); }}
                    switcherIcon={null}
                    titleRender={(node: TreeDataNode): ReactNode => {
                        let titleNode: ReactNode = null;
                        if (node.isLeaf) {
                            titleNode = <Typography>{node.title?.toString()}</Typography>
                        } else {
                            const isMultilevelDirectory = node?.children?.some((child) => !child.isLeaf);
                            const folderIcon = (expandState[node.key.toString()]) ? <FolderOpen height='2em' width='2em' /> : (isMultilevelDirectory ? <FolderFullClose height='2em' width='2em' /> : <FolderClose height='2em' width='2em' />)
                            titleNode = <>{folderIcon}{<Text strong>{node.title?.toString()}</Text>}</>
                        }
                        return (
                            <Flex
                                onContextMenu={(_) => {
                                    setContextMenuNode(node)
                                }}
                                gap={5}
                                align='center'
                                style={{ padding: 8, backgroundColor: (selectedNodes[node.key.toString()] ? 'rgba(0, 0, 0, 0.04)' : 'transparent') }} className='space-content-component-tree-node-title'>
                                {titleNode}
                            </Flex >
                        );
                    }}
                />
            </Flex >
        </Dropdown>
    );
}

export default SpaceContentComponent;