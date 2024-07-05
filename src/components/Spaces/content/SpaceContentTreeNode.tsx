import { ChildDataNodeType, LeafDataNode, NodeType } from '../Types';
import { NodeRendererProps } from 'react-arborist';
import { Button, Dropdown, Flex, Typography, notification } from 'antd';
import { CloseOutlined, FileOutlined } from '@ant-design/icons';
import { FolderClose, FolderOpen, WebsiteIcon } from '../../common/Icons';
import { useCallback, useContext, useState } from 'react';
import { ItemType } from 'antd/es/menu/interface';
import { SpaceContext } from '../SpaceContextUtils';
import { Utils } from '../Utils';
import Icon from '@ant-design/icons/lib/components/Icon';

const { Text } = Typography;

type Props = NodeRendererProps<ChildDataNodeType>;

export default function SpaceContentTreeNode({ node: currentNode, style, dragHandle }: Props) {
    const [notificationApi, contextHolder] = notification.useNotification();

    const [hovered, setHovered] = useState<boolean>(false);

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
            menuItems.push(...[
                {
                    label: 'Open in a New Tab',
                    key: 'context_menu_single_leaf_open_in_a_new_tab',
                    onClick: (event: any) => {
                        chrome.tabs.create({
                            url: (currentNode.data as LeafDataNode).url,
                        });
                        event.domEvent.stopPropagation();
                    }
                },
                {
                    label: 'Copy Link',
                    key: 'context_menu_single_leaf_copy_link',
                    onClick: (event: any) => { onCopyLinks([(currentNode.data as LeafDataNode).url ?? '']); event.stopPropagation() }
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
            <Flex
                ref={dragHandle}
                justify='space-between'
                align='center'
                style={{ ...style }}
                onClick={(event) => {
                    if (currentNode.isEditing) {
                        return;
                    }
                    if (currentNode.data.type === NodeType.Leaf) {
                        chrome.tabs.query({ currentWindow: true }, (tabs: chrome.tabs.Tab[]) => {
                            const existingTab = tabs.filter((tab) => {
                                return tab.url === (currentNode.data as LeafDataNode).url;
                            });

                            if (existingTab.length) {
                                chrome.tabs.update(existingTab[0].id!, {
                                    active: true,
                                });
                            } else {
                                chrome.tabs.create({
                                    url: (currentNode.data as LeafDataNode).url,
                                });
                            }
                        });
                    }

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
                onMouseEnter={() => {
                    setHovered(true);
                }
                }
                onMouseLeave={() => {
                    setHovered(false);
                }}
            >
                <Dropdown placement='bottom' trigger={['contextMenu']} arrow={true} menu={{
                    items: treeNodeDropdownMenuItems()
                }}>
                    <Flex
                        gap={8}
                        align='center'
                        justify='space-between'
                        style={{
                            width: '100%',
                            padding: 8,
                            paddingLeft: 8,
                            backgroundColor: (currentNode.isSelected ? (currentNode.isInternal ? 'rgba(0, 0, 0, 0.04)' : 'white') : 'transparent'),
                            boxShadow: (currentNode.isSelected && currentNode.isLeaf) ? '1px 1px 1px rgba(0, 0, 0, 0.1)' : '0px 0px 0px rgba(0, 0, 0, 0.1)',
                            borderRadius: '10px'
                        }}
                        className='space-content-component-tree-node-title'
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
                                        title: currentNode.data.name,
                                        showArrow: false,
                                    },
                                }}
                                style={{
                                    textOverflow: 'ellipsis',
                                    width: '100%',
                                    whiteSpace: 'wrap',
                                }}
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
                                    if (currentNode.isSelected && currentNode.tree.selectedNodes.length === 1) {
                                        currentNode.edit();
                                    }
                                }}
                            >
                                {currentNode.data.name?.toString()}
                            </Text>
                        </>
                        }
                        {currentNode.isLeaf ?
                            <Button type='text' size="small" icon={<CloseOutlined />} style={{
                                alignSelf: 'flex-end',
                                visibility: hovered ? undefined : 'hidden',
                            }} onClick={() => {
                                spaceContext.onChildNodeDelete([currentNode.id]);
                            }}></Button> : null
                        }
                    </Flex >
                </Dropdown >
            </Flex >
        </>
    )
};