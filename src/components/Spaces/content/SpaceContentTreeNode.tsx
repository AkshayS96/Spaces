import { AiFillFolder, AiFillFile } from "react-icons/ai";
import { MdArrowRight, MdArrowDropDown, MdEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { DataType, FolderData, LeafData } from "../Types";
import { NodeApi, NodeRendererProps } from "react-arborist";
import { Dropdown, Flex, Typography } from "antd";
import { FileOutlined } from "@ant-design/icons";
import { FolderClose, FolderOpen } from "../../common/Icons";
import { useCallback, useMemo } from "react";
import { ItemType } from "antd/es/menu/interface";

const { Text } = Typography;

type Props = NodeRendererProps<DataType>;

export default function SpaceContentTreeNode({ node, style, dragHandle }: Props) {

    const treeNodeDropdownMenuItems = useMemo((): ItemType[] => {
        const menuItems: ItemType[] = [];

        const selectedNodesValues = Object.values(node.tree.selectedNodes);
        const isContextMenuNodeInSelectedNodes = selectedNodesValues.some((selectedNode) => selectedNode.id.toString() === node.id.toString());
        const isLeaf = isContextMenuNodeInSelectedNodes ? false : node.isLeaf;
        const isFolder = isContextMenuNodeInSelectedNodes ? false : !node?.isLeaf;
        const isMultileaf = (!isLeaf && !isFolder && selectedNodesValues.every((node) => node.isLeaf));

        if (isLeaf) {
            // Single leaf node
            menuItems.push(...[{
                label: "Copy Link",
                key: "context_menu_single_leaf_copy_link",
                // onClick: () => { onCopyLinks([contextMenuNode?.key.toString() ?? '']) }
            }, {
                label: "Rename...",
                key: "context_menu_single_leaf_rename",
                // onClick: () => { onRenameFolder(contextMenuNode?.key.toString() ?? '') }
            }, {
                label: "Delete",
                key: "context_menu_single_leaf_delete",
                // onClick: () => { onFolderDelete(contextMenuNode?.key.toString()) }
            }, {
                label: "Duplicate",
                key: "context_menu_single_leaf_duplicate",
            }]);
        } else if (isFolder) {
            //TODO: Hide nested folder after 5 child folders
            menuItems.push(...[{
                label: "New Nested Folder",
                key: "context_menu_single_folder_new_nested_folder",
                // onClick: () => { onNestedFolderCreate(contextMenuNode?.key.toString()) }
            }, {
                label: "Rename...",
                key: "context_menu_single_folder_rename",
                // onClick: () => { onRenameFolder(contextMenuNode?.key.toString() ?? '') }
            },
            {
                label: "Duplicate",
                key: "context_menu_single_folder_duplicate",
            },
            {
                label: "Delete",
                key: "context_menu_single_folder_delete",
                // onClick: () => { onFolderDelete(contextMenuNode?.key.toString()) }
            }]);
        } else if (isMultileaf) {
            menuItems.push(...[
                {
                    label: "Copy Links",
                    key: "context_menu_multiple_leaf_copy_links",
                    // Fix contextMenuNode copy as well
                    // onClick: () => { onCopyLinks((selectedNodesValues.map((node) => node.key.toString()))) }
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
    }, [node]);


    return (
        <Flex ref={dragHandle} style={style} onClick={(event) => {
            if (event.metaKey) {
                node.selectMulti();
                event.stopPropagation();
                return;
            }

            if (node.isInternal) {
                node.toggle();
                node.deselect();
                event.stopPropagation();
            }
        }}>
            <Dropdown placement='bottom' trigger={["contextMenu"]} arrow={true} menu={{
                items: treeNodeDropdownMenuItems
            }}>
                <Flex
                    gap={5}
                    align='center'
                    style={{ width: '100%', padding: 8, backgroundColor: (node.isSelected ? 'rgba(0, 0, 0, 0.04)' : 'transparent') }} className='space-content-component-tree-node-title'
                >
                    {
                        node.isLeaf ? (
                            <>
                                <FileOutlined height='2em' width='2em' /> <Typography>{(node.data as LeafData).name?.toString()}</Typography>
                            </>
                        ) : (<>
                            {
                                node.isOpen ? <FolderOpen height='2em' width='2em' /> : <FolderClose height='2em' width='2em' />
                            }
                            <Text strong editable={{
                                editing: node.isEditing,
                                enterIcon: null,
                                maxLength: 30,
                                triggerType: ['text'],
                                onChange: (newName: string) => {
                                    if (newName.length > 0) {
                                        node.submit(newName);
                                    }
                                },
                            }}
                            >
                                {node.data.name.toString()}
                            </Text>
                        </>)
                    }
                </Flex >
            </Dropdown >
        </Flex >
    )
};