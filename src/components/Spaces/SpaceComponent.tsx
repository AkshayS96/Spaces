import React, { useEffect, useState } from 'react';

import SpaceHeaderComponent from './SpaceHeaderComponent';
import SpaceSearchComponent from './SpaceSearchComponent';
import SpaceContentComponent from './SpaceContentComponent';
import { SpaceData } from './Types';
import { Flex, Space } from 'antd';
import SpacesFooterComponent from './SpaceFooterComponent';

type Props = Readonly<{
    space: SpaceData,
    onNewSpace: () => void
    onSpaceNameChange: (spaceId: number, newName: string) => void
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

    return (
        <Flex vertical justify='space-between' align='space-between' style={{ height: '100%' }} gap={20}>
            <SpaceSearchComponent />
            <SpaceHeaderComponent space={props.space} onSpaceNameChange={props.onSpaceNameChange} />
            <SpaceContentComponent space={props.space} />
            <SpacesFooterComponent onNewFolder={() => console.log("new folder")} onNewSpace={props.onNewSpace} onNewTab={() => console.log("new tab")} />
        </Flex >
    );
}

export default SpaceComponent;