
import { ChildDataNodeType, FolderDataNode, LeafDataNode, NodeType, SpaceDataNode } from '../Types';
import { Divider, Flex, Typography } from 'antd';
import type { NotificationArgsProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Utils } from '../../utils/Utils';
import SpaceContentTree from './SpaceContentTree';

import "./SpaceContentComponent.css"

type Props = Readonly<{
    space: SpaceDataNode,
    onDataChange: (newSpaceData: SpaceDataNode) => void,
}>;

function SpaceContentComponent(props: Props) {

    const onMove = (dragNodeIds: string[], dragNodesData: ChildDataNodeType[], parentId: string | null, index: number) => {
        console.log(dragNodeIds, dragNodesData, parentId, index);

        const removeDragNodes = (node: ChildDataNodeType): ChildDataNodeType | null => {
            if (dragNodeIds.find((dragNodeId) => dragNodeId === node.id)) {
                return null;
            }

            if (node.type === NodeType.Leaf || node.type === NodeType.NewTab) {
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
        props.space.children.forEach((child: ChildDataNodeType) => {
            const updatedChild = removeDragNodes(child);
            if (updatedChild) {
                newChildren.push(updatedChild);
            }
        });

        if (!parentId) {
            newChildren.splice(index, 0, ...dragNodesData);
        }
        props.onDataChange({ ...props.space, children: newChildren });
    }

    const onRename = (nodeId: string, newName: string) => {
        const renameNode = (node: ChildDataNodeType): ChildDataNodeType => {
            if (node.id === nodeId) {
                return {
                    ...node,
                    name: newName
                };
            }
            return node.type === NodeType.Leaf ? { ...node } : { ...node, children: (node as FolderDataNode).children.map((child) => renameNode(child)) };
        }

        const newSpaceData: SpaceDataNode = { ...props.space, children: props.space.children.map((child: ChildDataNodeType) => renameNode(child)) };
        props.onDataChange(newSpaceData);
    };

    const onDelete = (ids: string[]) => {
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
        props.space.children.forEach((child: ChildDataNodeType) => {
            const updatedChild = removeDragNodes(child);
            if (updatedChild) {
                newChildren.push(updatedChild);
            }
        });
        props.onDataChange({ ...props.space, children: newChildren });
    }

    const onCreate = (parentNodeId: string | null, index: number) => {
        const newChild: FolderDataNode = {
            id: Utils.getUniqueId(),
            name: "Untitled",
            type: NodeType.Folder,
            children: [],
        };

        const recurseTreeAndAdd = (node: (FolderDataNode | SpaceDataNode), index: number): (FolderDataNode | SpaceDataNode) => {
            if (node.id === parentNodeId || parentNodeId === null) {
                const newChildren = [...node.children]
                newChildren.splice(index, 0, newChild);
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

        props.onDataChange({ ...recurseTreeAndAdd(props.space, index) });
        return newChild.id;
    }

    return (
        <Flex vertical style={{ height: '100%', width: '100%', overflowY: 'scroll' }}>
            <SpaceContentTree data={[...props.space.children]} onMove={onMove} onRename={onRename} onDelete={onDelete} onCreate={onCreate} />
        </Flex>
    )

}

export default SpaceContentComponent;