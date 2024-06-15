
import React, { ReactNode, useCallback, useEffect, useState } from 'react';
import { SpaceData } from './Types';
import type { GetProps, TreeDataNode } from 'antd';
import { Flex, Tree, Typography } from 'antd';
import { FolderClose, FolderFullClose, FolderOpen } from '../common/Icons';

import "./SpaceContentComponent.css"

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
    const [selectedKeys, setSelectedKeys] = useState<{ [key: string]: boolean }>({});

    const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
        if (info.nativeEvent.metaKey) {
            setSelectedKeys({ ...selectedKeys, [info.node.key.toString()]: true });
        } else {
            setSelectedKeys({});
        }
    };

    const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
        if (info.expanded) {
            setExpandState({ ...expandState, [info.node.key.toString()]: true });
        } else {
            setExpandState({ ...expandState, [info.node.key.toString()]: false });
        }
    };

    const getTitle = useCallback((node: TreeDataNode): ReactNode => {
        if (node.isLeaf) {
            return <Typography style={{ padding: 8, backgroundColor: (selectedKeys[node.key.toString()] ? 'rgba(0, 0, 0, 0.04)' : 'transparent') }} className='space-content-component-tree-node-title'>{node.title?.toString()}</Typography>
        }
        const isMultilevelDirectory = node?.children?.some((child) => child.children?.length);
        const folderIcon = (expandState[node.key.toString()]) ? <FolderOpen height='2em' width='2em' /> : (isMultilevelDirectory ? <FolderFullClose height='2em' width='2em' /> : <FolderClose height='2em' width='2em' />)
        return (<Flex gap={5} align='center' style={{ padding: 8, backgroundColor: (selectedKeys[node.key.toString()] ? 'rgba(0, 0, 0, 0.04)' : 'transparent') }} className='space-content-component-tree-node-title' > {folderIcon}{<Text strong>{node.title?.toString()}</Text>}</Flex >);
    }, [expandState, selectedKeys])

    return <Flex vertical style={{ height: '100%' }}>
        <DirectoryTree
            expandAction="click"
            multiple
            onSelect={onSelect}
            onExpand={onExpand}
            treeData={treeData}
            showIcon={false}
            onRightClick={() => { console.log("right click") }}
            switcherIcon={null}
            titleRender={getTitle}
        />
    </Flex>
}

export default SpaceContentComponent;