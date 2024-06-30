import React, { useCallback, useEffect, useState } from 'react';

import SpaceHeaderComponent from './SpaceHeaderComponent';
import SpaceSearchComponent from './SpaceSearchComponent';
import SpaceContentComponent from './content/SpaceContentComponent';
import { NodeType, SpaceDataNode } from './Types';
import { Flex, Space, Spin } from 'antd';
import SpacesFooterComponent from './SpaceFooterComponent';
import { Utils } from '../utils/Utils';
import { LoadingOutlined } from '@ant-design/icons';

type Props = Readonly<{
    spaceId: string,
    onNewSpace: () => void
    onDelete: (spaceId: string) => void
}>;

function SpaceComponent(props: Props) {
    const [spaceData, setSpaceData] = useState<SpaceDataNode>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        chrome.storage.local.get(`spaces-extension-space-${props.spaceId}`, (items: { [key: string]: any }) => {
            const storedSpaceData = items[`spaces-extension-space-${props.spaceId}`]
            if (storedSpaceData) {
                setSpaceData(storedSpaceData);
                setLoading(false);
            }
        });
    }, []);

    const onDataChange = (newSpaceData: SpaceDataNode) => {
        setSpaceData(newSpaceData);
        chrome.storage.local.set({ [`spaces-extension-space-${spaceData?.id}`]: newSpaceData });
    }

    const onNameChange = (newName: string) => {
        onDataChange({ ...spaceData!, name: newName });
    };


    const onNewFolder = () => {
        const newSpaceData = { ...spaceData! };
        newSpaceData.children!.push({
            id: Utils.getUniqueId(),
            name: "Untitled",
            type: NodeType.Folder,
            children: [],
        });

        onDataChange(newSpaceData);
    }

    return (
        loading ? <Flex vertical style={{ height: '100%' }} justify='center' align='center'>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </Flex> :
            <Flex vertical justify='space-between' align='space-between' style={{ height: '100%' }} gap={16}>
                <SpaceSearchComponent />
                <SpaceHeaderComponent space={spaceData!} onNameChange={onNameChange} onDelete={() => props.onDelete(spaceData!.id)} onNewFolder={onNewFolder} />
                <SpaceContentComponent space={spaceData!} onDataChange={onDataChange} />
                <SpacesFooterComponent onNewFolder={onNewFolder} onNewSpace={props.onNewSpace} />
            </Flex >
    );
}

export default SpaceComponent;