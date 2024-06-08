import React, { useEffect, useState } from 'react';
import AppSpaceComponent from './AppSpace/AppSpaceComponent';
import { Box, Divider, Flex, HStack, Stack, VStack, Text } from '@chakra-ui/layout';
import { AddIcon } from '@chakra-ui/icons'
import { MdOutlineSpaceDashboard, MdOutlineFolderOpen, MdOutlineTab, MdCreateNewFolder, MdOutlineCreateNewFolder } from "react-icons/md";
import { BsWindowPlus } from 'react-icons/bs'



import { Button, Icon, IconButton, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, createIcon } from '@chakra-ui/react'
import AppSpacesFooter from './AppSpacesFooter';

type MapType = {
    [id: number]: chrome.tabs.Tab;
};


type Props = Readonly<{
    spaceIds: string[]
}>;



function AppSpace(props: Props) {
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
        <Box height="100%" padding={5}>
            <Flex direction={"column"} alignContent={"space-between"} height={"100%"}>
                <AppSpaceComponent spaceId={"add"} />
                <Divider />
                <AppSpacesFooter />
            </Flex>
        </Box >
    );

    // return <div className="AppSpace">
    //     {Object.values(tabs).sort((a, b) => {
    //         return a.index - b.index;
    //     }).map((tab: chrome.tabs.Tab) => {
    //         return <div>{tab.active ? <b>{tab.title}</b> : tab.title}</div>
    //     })}
    // </div>
}


export default AppSpace;
