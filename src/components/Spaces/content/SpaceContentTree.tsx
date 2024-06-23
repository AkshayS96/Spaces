import { ForwardedRef, useRef } from "react"
import { MoveHandler, NodeApi, Tree, TreeApi } from "react-arborist";
import { ChildrenType, DataType, FolderData, LeafData, SpaceData } from "../Types";
import { TreeProps } from "react-arborist/dist/module/types/tree-props";
import SpaceContentTreeNode from "./SpaceContentTreeNode";
import { Dropdown } from "antd";

type Props = {
    data: DataType[],
    onMove: (dragIds: string[], dragNodeData: DataType[], parentId: string | null, index: number) => void
};

export default function SpaceContentTree(props: Props) {
    const treeRef = useRef(null);

    const onTreeNodeRename = ({ id, name }: any) => { console.log(id, name); };
    const onTreeNodeDelete = ({ ids }: any) => { console.log(ids); };
    // const onCreate = (args: any) => { console.log(args); return {} };

    const onTreeNodeMove = (args: {
        dragIds: string[];
        dragNodes: NodeApi<DataType>[];
        parentId: string | null;
        parentNode: NodeApi<DataType> | null;
        index: number;
    }) => {
        const filteredDragIds: string[] = [];
        const filteredDragNodeData: DataType[] = [];
        args.dragNodes.forEach((dragNode) => {
            // Add check for position change within same parent
            // if (dragNode.parent?.id !== args.parentId || args.parentId === null) {
            filteredDragIds.push(dragNode.id);
            filteredDragNodeData.push(dragNode.data);
            // }
        });
        if (filteredDragIds.length && (args.parentNode?.data.dataType === ChildrenType.Folder || args.parentNode === null)) {
            props.onMove(filteredDragIds, filteredDragNodeData, args.parentId, args.index);
        }
    }

    return <Tree
        ref={treeRef}
        width="100%"
        indent={20}
        rowHeight={50}
        data={props.data}
        onMove={onTreeNodeMove}
        onRename={onTreeNodeRename}
        onDelete={onTreeNodeDelete}
    // onCreate={props.onCreate}
    >
        {SpaceContentTreeNode}
    </Tree>
}

