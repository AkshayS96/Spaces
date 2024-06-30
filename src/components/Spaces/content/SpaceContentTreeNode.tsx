import { ChildDataNodeType, LeafDataNode } from '../Types';
import { NodeRendererProps } from 'react-arborist';
import { Button, Dropdown, Flex, Typography, notification } from 'antd';
import { FileOutlined } from '@ant-design/icons';
import { FolderClose, FolderOpen, WebsiteIcon } from '../../common/Icons';
import { useCallback, useContext } from 'react';
import { ItemType } from 'antd/es/menu/interface';
import { SpaceContext } from '../SpaceContextUtils';
import { Utils } from '../Utils';
import Icon from '@ant-design/icons/lib/components/Icon';

const { Text } = Typography;

type Props = NodeRendererProps<ChildDataNodeType>;

export default function SpaceContentTreeNode({ node: currentNode, style, dragHandle }: Props) {
    const [notificationApi, contextHolder] = notification.useNotification();

    const spaceContext = useContext(SpaceContext);

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
            ]);
        } else if (currentNode.isInternal && (selectedNodesValues.length === 0) || selectedNodesValues.every((selectedNode) => selectedNode.id === currentNode.id)) {
            menuItems.push(...[
                {
                    label: 'Add Current Tab',
                    key: 'context_menu_single_folder_add_current_tab',
                    onClick: (event: any) => {
                        if (currentNode.isClosed) {
                            currentNode.open();
                        }
                        spaceContext.addCurrentTab(currentNode.id);
                        event.domEvent.stopPropagation();
                    }
                },
                {
                    label: 'New Nested Folder',
                    key: 'context_menu_single_folder_new_nested_folder',
                    disabled: currentNode.level > 3,
                    onClick: (event: any) => {
                        if (currentNode.isClosed) {
                            currentNode.open();
                        }
                        spaceContext.onChildFolderNodeCreate(Utils.NewFolder(), currentNode.id);
                        event.domEvent.stopPropagation();
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
                        gap={8}
                        align='center'
                        style={{ width: '100%', padding: 8, backgroundColor: (currentNode.isSelected ? 'rgba(0, 0, 0, 0.04)' : 'transparent') }} className='space-content-component-tree-node-title'
                    >
                        {<>
                            {
                                currentNode.isLeaf ? (
                                    <>
                                        {
                                            (currentNode.data as LeafDataNode).iconSrc ?
                                                <WebsiteIcon height="16px" width="16px" src={(currentNode.data as LeafDataNode).iconSrc ?? ''} /> :
                                                <FileOutlined height='2em' width='2em' />
                                        }
                                    </>
                                ) : (
                                    <>
                                        {
                                            currentNode.isOpen ? <FolderOpen height='2em' width='2em' /> : <FolderClose height='2em' width='2em' />
                                        }
                                    </>
                                )
                            }
                            <Text
                                strong
                                ellipsis={{
                                    tooltip: {
                                        title: currentNode.data.name
                                    },
                                }}
                                style={
                                    {
                                        textOverflow: 'ellipsis',
                                    }
                                }
                                editable={{
                                    editing: currentNode.isEditing,
                                    enterIcon: null,
                                    tooltip: true,
                                    triggerType: ['text'],
                                    onChange: (newName: string) => {
                                        if (newName.length > 0) {
                                            currentNode.submit(newName);
                                        }
                                    },
                                }}
                                onClick={(event) => {
                                    if (currentNode.isSelected) {
                                        currentNode.edit();
                                    } else {
                                        currentNode.select();
                                    }
                                    event.stopPropagation();
                                }}
                            >
                                {currentNode.data.name?.toString()}
                            </Text>
                            {/* Add a close button here */}
                        </>
                        }
                    </Flex >
                </Dropdown >
            </Flex >
        </>
    )
};