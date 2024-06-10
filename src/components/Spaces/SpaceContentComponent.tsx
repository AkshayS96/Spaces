
import React, { ReactNode, useEffect, useState } from 'react';
import { SpaceData } from './Types';
import type { GetProps, TreeDataNode } from 'antd';
import { Flex, Tree } from 'antd';
import { AntTreeNodeProps } from 'antd/es/tree';
import { FolderOpenOutlined, FolderOutlined } from '@ant-design/icons';
import { FolderClose, FolderOpen } from '../common/Icons';

type DirectoryTreeProps = GetProps<typeof Tree.DirectoryTree>;


const { DirectoryTree } = Tree

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
        ],
    },
];


type Props = Readonly<{
    space: SpaceData
}>;

function SpaceContentComponent(props: Props) {
    const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
        console.log('Trigger Select', keys, info);
    };

    const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
        console.log('Trigger Expand', keys, info);
    };

    return <Flex vertical style={{ height: '100%' }}>
        <DirectoryTree multiple defaultExpandAll onSelect={onSelect}
            onExpand={onExpand}
            treeData={treeData}
            showIcon={false}
            onRightClick={() => { console.log("right click") }}
            switcherIcon={(props: AntTreeNodeProps) => {
                return props.expanded ? <FolderOpen height='2em' width='2em' /> : <FolderClose height='2em' width='2em' style={{
                    transform: 'rotate(90deg)',
                }} />
            }}
        />
    </Flex>
}

export default SpaceContentComponent;