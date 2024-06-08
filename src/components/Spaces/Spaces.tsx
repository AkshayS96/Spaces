/* global chrome */

import { useEffect, useState } from 'react';
import AppSpaceComponent from './SpaceComponent';
import { Box, Divider, Flex } from '@chakra-ui/layout';
import AppSpacesFooter from './SpacesFooter';

type SpacesData = Array<{
    id: string,
    name: string,
    folders: Array<{
        name: string,
        tabs: Array<{
            tabId: number,
            url: URL,
            title: string
        }>
    }>
}>;

function Spaces() {
    const [spaces, setSpaces] = useState<SpacesData>([]);

    useEffect(() => {
        const setupSpaces = async () => {
            // Load up saved spaces
            const result = await chrome.storage.local.get("spaces");
            let spacesArray = [];
            if (result && result.spaces) {
                spacesArray = result.spaces
            } else {
                // Create a new space with current tabs
                spacesArray = []
            }

            setSpaces(spacesArray);
        }

        setupSpaces();
    }, [])

    const onClick = () => {
        console.log("soemthing");
    };

    return (
        <Box height="100%" padding={5}>
            <Flex direction={"column"} alignContent={"space-between"} height={"100%"}>
                <AppSpaceComponent spaceId={"add"} />
                <Divider />
                <AppSpacesFooter onNewFolder={onClick} onNewSpace={onClick} onNewTab={onClick} onNewWindow={onClick} />
            </Flex>
        </Box >
    );
}


export default Spaces;
