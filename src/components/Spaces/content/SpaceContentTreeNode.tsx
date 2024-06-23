import { ChildDataNodeType, LeafDataNode } from '../Types';
import { NodeRendererProps } from 'react-arborist';
import { Dropdown, Flex, Typography, notification } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import { FolderClose, FolderOpen } from '../../common/Icons';
import { useCallback } from 'react';
import { ItemType } from 'antd/es/menu/interface';

const { Text } = Typography;

type Props = NodeRendererProps<ChildDataNodeType>;

export default function SpaceContentTreeNode({ node: currentNode, style, dragHandle }: Props) {
    const [notificationApi, contextHolder] = notification.useNotification();

    const onCopyLinks = (items: string[]) => {
        items = (items ?? []).filter((value) => value.length > 0)
        if (items.length > 0) {
            // Change this to copy urls instead of item keys
            navigator.clipboard.writeText(items.join('\n'));
            notificationApi.success({
                message: `Copied ${items.length} items`,
                placement: 'top'
            });
        }
    };

    const treeNodeDropdownMenuItems = useCallback((): ItemType[] => {
        const menuItems: ItemType[] = [];

        const selectedNodesValues = Object.values(currentNode.tree.selectedNodes);
        const isContextMenuNodeInSelectedNodes = selectedNodesValues.some((selectedNode) => selectedNode.id.toString() === currentNode.id.toString());
        const isLeaf = isContextMenuNodeInSelectedNodes ? false : currentNode.isLeaf;
        const isFolder = isContextMenuNodeInSelectedNodes ? false : !currentNode?.isLeaf;
        const isMultileaf = (!isLeaf && !isFolder && selectedNodesValues.every((node) => node.isLeaf));

        if (currentNode.isLeaf && (selectedNodesValues.length === 0 || selectedNodesValues.every((selectedNode) => selectedNode.id === currentNode.id))) {
            // Single leaf node
            menuItems.push(...[{
                label: 'Copy Link',
                key: 'context_menu_single_leaf_copy_link',
                onClick: () => { onCopyLinks([(currentNode.data as LeafDataNode).url ?? '']) }
            }, {
                label: 'Rename...',
                key: 'context_menu_single_leaf_rename',
                onClick: (event: any) => {
                    currentNode.edit();
                    event.domEvent.stopPropagation();
                }
            }, {
                label: 'Delete',
                key: 'context_menu_single_leaf_delete',
                onClick: (event: any) => {
                    currentNode.tree.delete(currentNode.id);
                    event.domEvent.stopPropagation();
                }
            },
                // {
                //     label: 'Duplicate',
                //     key: 'context_menu_single_leaf_duplicate',
                // }
            ]);
        } else if (currentNode.isInternal && selectedNodesValues.length === 0) {
            //TODO: Hide nested folder after 5 child folders
            menuItems.push(...[{
                label: 'New Nested Folder',
                key: 'context_menu_single_folder_new_nested_folder',
                disabled: currentNode.level > 5,
                onClick: () => {
                    currentNode.tree.create({
                        type: 'internal',
                        parentId: currentNode.id
                    });
                }
            }, {
                label: 'Rename...',
                key: 'context_menu_single_folder_rename',
                onClick: (event: any) => {
                    currentNode.edit();
                    event.domEvent.stopPropagation();
                }
            },
            {
                label: 'Delete',
                key: 'context_menu_single_folder_delete',
                onClick: (event: any) => {
                    currentNode.tree.delete(currentNode.id);
                    event.domEvent.stopPropagation();
                }
            }]);
        } else if (currentNode.isLeaf && selectedNodesValues.every((selectedNode) => selectedNode.isLeaf)) {
            menuItems.push(...[
                {
                    label: 'Copy Links',
                    key: 'context_menu_multiple_leaf_copy_links',
                    // Fix contextMenuNode copy as well
                    onClick: () => {
                        console.log(selectedNodesValues);
                        onCopyLinks([(currentNode.data as LeafDataNode).url ?? '', ...selectedNodesValues
                            .filter((node) => node.data.id !== currentNode.id)
                            .map((node) => {
                                return (node.data as LeafDataNode).url ?? '';
                            })])
                    }
                },
                // {
                //     label: `New Folder with ${selectedNodesValues.length} Items`,
                //     key: 'context_menu_multiple_leaf_new_folder_with_items'
                // },
                {
                    label: 'Delete',
                    key: 'context_menu_multiple_leaf_delete',
                    onClick: (event: any) => {
                        currentNode.tree.delete([...currentNode.tree.selectedIds]);
                        event.domEvent.stopPropagation();
                    }
                }]);
        } else {
            menuItems.push(
                {
                    label: 'Delete',
                    key: 'context_menu_multiple_leaf_and_folder_delete',
                    onClick: (event: any) => {
                        console.log(currentNode.tree.selectedIds);
                        currentNode.tree.delete([...currentNode.tree.selectedIds]);
                        event.domEvent.stopPropagation();
                    }
                });
        }

        return menuItems;
    }, [currentNode, onCopyLinks]);


    return (
        <>
            {contextHolder}
            <Flex ref={dragHandle} style={style} onClick={(event) => {
                if (event.metaKey) {
                    currentNode.selectMulti();
                    event.stopPropagation();
                    return;
                }

                if (currentNode.isInternal) {
                    currentNode.toggle();
                    currentNode.deselect();
                    currentNode.tree.deselectAll();
                    event.stopPropagation();
                }
            }}
            >
                <Dropdown placement='bottom' trigger={['contextMenu']} arrow={true} menu={{
                    items: treeNodeDropdownMenuItems()
                }}>
                    <Flex
                        gap={5}
                        align='center'
                        style={{ width: '100%', padding: 8, backgroundColor: (currentNode.isSelected ? 'rgba(0, 0, 0, 0.04)' : 'transparent') }} className='space-content-component-tree-node-title'
                    >
                        {<>
                            {
                                currentNode.isLeaf ? (
                                    <>
                                        <FileOutlined height='2em' width='2em' />
                                    </>
                                ) : (
                                    <>
                                        {
                                            currentNode.isOpen ? <FolderOpen height='2em' width='2em' /> : <FolderClose height='2em' width='2em' />
                                        }
                                    </>
                                )
                            }
                            <Text strong editable={{
                                editing: currentNode.isEditing,
                                enterIcon: null,
                                maxLength: 30,
                                triggerType: ['text'],
                                onChange: (newName: string) => {
                                    if (newName.length > 0) {
                                        currentNode.submit(newName);
                                    }
                                },
                            }}
                                onClick={(event) => {
                                    currentNode.edit();
                                    event.stopPropagation();
                                }}
                            >
                                {currentNode.data.name.toString()}
                            </Text>
                        </>
                        }
                    </Flex >
                </Dropdown >
            </Flex >
        </>
    )
};