import React, { useEffect, useState } from 'react';
import AppSpaceComponent from './AppSpace/AppSpaceComponent';
import { Box, Divider, Flex, HStack, Stack, VStack, Text } from '@chakra-ui/layout';
import { AddIcon } from '@chakra-ui/icons'
import { MdOutlineSpaceDashboard, MdOutlineFolderOpen, MdOutlineTab, MdCreateNewFolder, MdOutlineCreateNewFolder } from "react-icons/md";
import { BsWindowPlus } from 'react-icons/bs'



import { Button, Icon, IconButton, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverHeader, PopoverTrigger, createIcon } from '@chakra-ui/react'

type MapType = {
    [id: number]: chrome.tabs.Tab;
};


type Props = Readonly<{
    spaceIds: string[]
}>;

const MDOutlineNewWindow = createIcon({
    displayName: "New Window",
    viewBox: "0 -960 960 960",
    path: (
        <path fill="currentColor" xmlns="http://www.w3.org/2000/svg" d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240v80H200v560h560v-240h80v240q0 33-23.5 56.5T760-120H200Zm440-400v-120H520v-80h120v-120h80v120h120v80H720v120h-80Z" ></path>
    ),
});

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
                <Flex direction={"column"}>
                    <HStack justifyContent={"space-between"}>
                        <div>About</div>
                        <div>spaces cursor</div>
                        <Popover size="xs">
                            <PopoverTrigger>
                                <IconButton aria-label={''} icon={<AddIcon />} variant="link" size='xl'></IconButton>
                            </PopoverTrigger>
                            <PopoverContent as={Stack}>
                                <PopoverArrow />
                                <PopoverBody>
                                    <VStack justify="flex-start" align="stretch" spacing={1}>
                                        <Button variant="ghost" leftIcon={<Icon as={MdOutlineSpaceDashboard} boxSize={5} />} justifyContent="left" fontSize={14} iconSpacing={3}>New Space</Button>
                                        <Button variant="ghost" leftIcon={<Icon as={MdOutlineCreateNewFolder} boxSize={5} />} justifyContent="left" fontSize={14} iconSpacing={3}>New Folder</Button>
                                        <Divider />
                                        <Button variant="ghost" leftIcon={<Icon as={MDOutlineNewWindow} boxSize={5} />} justifyContent="left" fontSize={14} iconSpacing={3} >New Window</Button>
                                        <Button variant="ghost" leftIcon={<Icon as={MdOutlineTab} boxSize={5} />} justifyContent="left" fontSize={14} iconSpacing={3}>New Tab</Button>
                                    </VStack>
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                    </HStack>
                </Flex>
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
