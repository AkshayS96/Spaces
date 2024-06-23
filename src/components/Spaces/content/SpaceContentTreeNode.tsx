import { AiFillFolder, AiFillFile } from "react-icons/ai";
import { MdArrowRight, MdArrowDropDown, MdEdit } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { DataType, FolderData, LeafData } from "../Types";
import { NodeApi, NodeRendererProps } from "react-arborist";
import { Dropdown, Flex, Typography } from "antd";
import { FileOutlined } from "@ant-design/icons";
import { FolderClose, FolderOpen } from "../../common/Icons";

const { Text } = Typography;

type Props = NodeRendererProps<DataType>;

export default function SpaceContentTreeNode({ node, style, dragHandle }: Props) {
    return (
        <Flex ref={dragHandle} style={style}>
            <Dropdown placement='bottom' trigger={["contextMenu"]} arrow={true} menu={{
                items: [
                    {
                        key: "1",
                        label: "adad"
                    }
                ],
            }}>
                <Flex
                    // onContextMenu={(event) => {
                    //     event?.stopPropagation();
                    //     // setContextMenuNode(node)
                    // }}
                    gap={5}
                    align='center'
                    onClick={() => node.isInternal && node.toggle()}
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
                            <>
                                <Text strong editable={{
                                    editing: node.isEditing,
                                    enterIcon: null,
                                    maxLength: 30,
                                    triggerType: ['text'],
                                    onChange: (newName: string) => {
                                        if (newName.length > 0) {
                                            console.log(newName);
                                            // onFolderNameChange(node.key.toString(), newName);
                                        }
                                        // setIsEditClickedForTreeNode({ ...isEditClickedForTreeNode, [node.key.toString()]: false });
                                    },
                                    onCancel: () => {
                                        // setIsEditClickedForTreeNode({ ...isEditClickedForTreeNode, [node.key.toString()]: false });
                                    },
                                }}
                                >
                                    {node.data.id.toString()}
                                </Text>
                            </>
                        </>)
                    }
                </Flex >
            </Dropdown >
        </Flex >
    )
};