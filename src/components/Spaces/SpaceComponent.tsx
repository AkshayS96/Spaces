import React, { useEffect, useState } from 'react';

import SpaceHeaderComponent from './SpaceHeaderComponent';
import SpaceSearchComponent from './SpaceSearchComponent';
import SpaceContentComponent from './SpaceContentComponent';
import { ChildrenType, SpaceData } from './Types';
import { Flex, Space } from 'antd';
import SpacesFooterComponent from './SpaceFooterComponent';

type Props = Readonly<{
    space: SpaceData,
    onNewSpace: () => void
    onNameChange: (spaceId: number, newName: string) => void
    onDelete: (spaceId: number) => void
    onDataChange: (spaceId: number, newSpaceData: SpaceData) => void
}>;

function SpaceComponent(props: Props) {
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

    console.log(props.space);

    const onNewFolder = () => {
        const newSpaceData = props.space
        newSpaceData.children.push({
            key: props.space.children.length.toString(),
            name: "Untitled",
            dataType: ChildrenType.Folder,
            children: [],
        })
        props.onDataChange(props.space.id, newSpaceData);
    }

    const onNewTab = () => {
        console.log("new tab");
    }

    return (
        <Flex vertical justify='space-between' align='space-between' style={{ height: '100%' }} gap={16}>
            <SpaceSearchComponent />
            <SpaceHeaderComponent space={props.space} onNameChange={(newName) => props.onNameChange(props.space.id, newName)} onDelete={() => props.onDelete(props.space.id)} onNewFolder={onNewFolder} />
            <SpaceContentComponent space={props.space} onDataChange={props.onDataChange} onNewTab={onNewTab} />
            <SpacesFooterComponent onNewFolder={onNewFolder} onNewSpace={props.onNewSpace} onNewTab={onNewTab} />
        </Flex >
    );
}

export default SpaceComponent;