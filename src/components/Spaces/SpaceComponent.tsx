import React, { useCallback, useEffect, useState } from 'react';

import SpaceHeaderComponent from './SpaceHeaderComponent';
import SpaceSearchComponent from './SpaceSearchComponent';
import SpaceContentComponent from './SpaceContentComponent';
import { ChildrenType, SpaceData } from './Types';
import { Flex, Space, Spin } from 'antd';
import SpacesFooterComponent from './SpaceFooterComponent';
import { Utils } from '../utils/Utils';
import { LoadingOutlined } from '@ant-design/icons';

type Props = Readonly<{
    spaceId: number,
    onNewSpace: () => void
    onDelete: (spaceId: number) => void
}>;

function SpaceComponent(props: Props) {
    const [spaceData, setSpaceData] = useState<SpaceData>();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const spaceDataLocal = window.localStorage.getItem(`spaces-extension-space-${props.spaceId}`);
        if (spaceDataLocal) {
            setSpaceData(JSON.parse(spaceDataLocal));
            setLoading(false);
        }
    }, []);

    // const [tabs, setTabs] = useState<MapType>({});

    // useEffect(() => {
    //     const resetTabsListener = (...args: any[]) => {
    //         chrome.tabs.query({ currentWindow: true }, (result) => {
    //             const newTabs: MapType = {};
    //             result.forEach((tab) => {
    //                 if (tab.id) {
    //                     newTabs[tab.id] = tab;
    //                 }
    //             })
    //             setTabs(newTabs);
    //         });
    //     }

    //     // Initial reset
    //     resetTabsListener();
    //     chrome.tabs.onHighlighted.addListener(resetTabsListener);
    //     chrome.tabs.onRemoved.addListener(resetTabsListener);
    //     chrome.tabs.onUpdated.addListener(resetTabsListener);
    //     chrome.tabs.onAttached.addListener(resetTabsListener);
    //     chrome.tabs.onMoved.addListener(resetTabsListener);
    //     chrome.tabs.onDetached.addListener(resetTabsListener);
    //     chrome.tabs.onCreated.addListener(resetTabsListener);
    //     chrome.tabs.onActivated.addListener(resetTabsListener);
    //     chrome.tabs.onReplaced.addListener(resetTabsListener);
    //     return () => {
    //         chrome.tabs.onHighlighted.removeListener(resetTabsListener);
    //         chrome.tabs.onRemoved.removeListener(resetTabsListener);
    //         chrome.tabs.onUpdated.removeListener(resetTabsListener);
    //         chrome.tabs.onAttached.removeListener(resetTabsListener);
    //         chrome.tabs.onMoved.removeListener(resetTabsListener);
    //         chrome.tabs.onDetached.removeListener(resetTabsListener);
    //         chrome.tabs.onCreated.removeListener(resetTabsListener);
    //         chrome.tabs.onActivated.removeListener(resetTabsListener);
    //         chrome.tabs.onReplaced.removeListener(resetTabsListener);
    //     }
    // }, []);



    const onDataChange = (newSpaceData: SpaceData) => {
        setSpaceData(newSpaceData);
        window.localStorage.setItem(`spaces-extension-space-${spaceData?.id}`, JSON.stringify(newSpaceData));
    }

    const onNameChange = (newName: string) => {
        onDataChange({ ...spaceData!, name: newName });
    };


    const onNewFolder = () => {
        const newSpaceData = { ...spaceData! };
        newSpaceData.children!.push({
            key: Utils.getUniqueId(),
            name: "Untitled",
            dataType: ChildrenType.Folder,
            expanded: true,
            children: [],
        });

        onDataChange(newSpaceData);
    }

    const onNewTab = () => {
        console.log("new tab");
    }

    return (
        loading ? <Flex vertical style={{ height: '100%' }} justify='center' align='center'>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </Flex> :
            <Flex vertical justify='space-between' align='space-between' style={{ height: '100%' }} gap={16}>
                <SpaceSearchComponent />
                <SpaceHeaderComponent space={spaceData!} onNameChange={onNameChange} onDelete={() => props.onDelete(spaceData!.id)} onNewFolder={onNewFolder} />
                <SpaceContentComponent space={spaceData!} onDataChange={onDataChange} onNewTab={onNewTab} />
                <SpacesFooterComponent onNewFolder={onNewFolder} onNewSpace={props.onNewSpace} onNewTab={onNewTab} />
            </Flex >
    );
}

export default SpaceComponent;