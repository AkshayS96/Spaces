import { useContext, useRef } from "react"
import { NodeApi, Tree } from "react-arborist";
import { NodeType, ChildDataNodeType } from "../Types";
import SpaceContentTreeNode from "./SpaceContentTreeNode";

import { IdObj } from "react-arborist/dist/module/types/utils";

import './SpaceContentTree.css';
import { SpaceContext } from "../SpaceContextUtils";
import { Utils } from "../Utils";

export default function SpaceContentTree() {
    const treeRef = useRef(null);

    const spaceContext = useContext(SpaceContext);

    const onTreeNodeRename = (args: {
        id: string;
        name: string;
        node: NodeApi<ChildDataNodeType>;
    }) => {
        spaceContext.onChildNodeRename(args.id, args.name);
    };

    const onTreeNodeDelete = (
        args: {
            ids: string[];
            nodes: NodeApi<ChildDataNodeType>[];
        }) => {
        spaceContext.onChildNodeDelete(args.ids)
    };

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
            spaceContext.onChildNodeMove(filteredDragIds, filteredDragNodeData, args.parentId, args.index);
        }
    }

    return <Tree
        className="space-content-tree"
        ref={treeRef}
        width="100%"
        indent={20}
        rowHeight={50}
        data={spaceContext.spaceData?.children}
        onMove={onTreeNodeMove}
        onRename={onTreeNodeRename}
        onDelete={onTreeNodeDelete}
    >
        {SpaceContentTreeNode}
    </Tree>
}

