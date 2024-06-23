import { useRef } from "react"
import { NodeApi, Tree } from "react-arborist";
import { NodeType, ChildDataNodeType } from "../Types";
import SpaceContentTreeNode from "./SpaceContentTreeNode";

import { IdObj } from "react-arborist/dist/module/types/utils";

type Props = {
    data: ChildDataNodeType[],
    onMove: (dragIds: string[], dragNodeData: ChildDataNodeType[], parentId: string | null, index: number) => void
    onRename: (nodeId: string, newName: string) => void,
    onDelete: (nodeIds: string[]) => void,
    onCreate: (parentId: string | null, index: number) => string
};

export default function SpaceContentTree(props: Props) {
    const treeRef = useRef(null);

    const onTreeNodeRename = (args: {
        id: string;
        name: string;
        node: NodeApi<ChildDataNodeType>;
    }) => {
        props.onRename(args.id, args.name);
    };

    const onTreeNodeDelete = (
        args: {
            ids: string[];
            nodes: NodeApi<ChildDataNodeType>[];
        }) => {
        props.onDelete(args.ids)
    };
    // const onCreate = (args: any) => { console.log(args); return {} };

    const onTreeNodeMove = (args: {
        dragIds: string[];
        dragNodes: NodeApi<ChildDataNodeType>[];
        parentId: string | null;
        parentNode: NodeApi<ChildDataNodeType> | null;
        index: number;
    }) => {
        const filteredDragIds: string[] = [];
        const filteredDragNodeData: ChildDataNodeType[] = [];
        args.dragNodes.forEach((dragNode) => {
            filteredDragIds.push(dragNode.id);
            filteredDragNodeData.push(dragNode.data);
        });
        if (filteredDragIds.length && (args.parentNode?.data.type === NodeType.Folder || args.parentNode === null)) {
            props.onMove(filteredDragIds, filteredDragNodeData, args.parentId, args.index);
        }
    }

    const onTreeNodeCreate = (args: {
        parentId: string | null,
        parentNode: NodeApi<ChildDataNodeType> | null,
        index: number,
        type: "internal" | "leaf"
    }): (IdObj | null) => {
        console.log(args);
        return { id: props.onCreate(args.parentId, args.index) };
    }

    return <Tree
        className="space-content-tree"
        ref={treeRef}
        width="100%"
        indent={20}
        rowHeight={50}
        data={props.data}
        onMove={onTreeNodeMove}
        onRename={onTreeNodeRename}
        onDelete={onTreeNodeDelete}
        onCreate={onTreeNodeCreate}
    >
        {SpaceContentTreeNode}
    </Tree>
}

