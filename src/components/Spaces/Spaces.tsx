/* global chrome */

import { useEffect, useState } from 'react';
import AppSpaceComponent from './SpaceComponent';
import { Box, Divider, Flex } from '@chakra-ui/layout';
import AppSpacesFooter from './SpacesFooter';
import NewSpaceComponent from './NewSpaceComponent';
import { SpacesData } from './Types';


function Spaces() {
    const [spaces, setSpaces] = useState<SpacesData[]>([]);
    const [currentSpace, setCurrentSpace] = useState<number>(0);
    const [isCreateSpace, setIsCreateSpace] = useState(false);

    useEffect(() => {
        const setupSpaces = async () => {
            // Load up saved spaces
            const result = await chrome.storage.local.get("spaces");
            let spacesLocal = []
            if (result && result.spaces) {
                spacesLocal = result.spaces;
            }
            spacesLocal.push({
                id: 0,
                isDefault: true,
                name: "Default",
                folders: [],
            });
            setSpaces(spacesLocal);
        }
        setupSpaces();
    }, []);

    const onCreateSpace = (name: string) => {
        setSpaces([...spaces, {
            id: spaces.length,
            name,
            folders: [],
            isDefault: false
        } as any]);
        setIsCreateSpace(false);
        setCurrentSpace(spaces.length);
    }

    const onCreateSpaceCancel = () => {
        setIsCreateSpace(false);
    }

    // We have spaces data so populate that
    return (
        <Box height="100%" padding={5}>
            {isCreateSpace ?
                (
                    <NewSpaceComponent onCreateSpace={onCreateSpace} onCancel={onCreateSpaceCancel} />
                ) :
                (
                    <Flex direction={"column"} alignContent={"space-between"} height={"100%"}>
                        <AppSpaceComponent spaceId={"add"} />
                        <Divider />
                        <AppSpacesFooter spaces={spaces} onNewSpace={() => { setIsCreateSpace(true); }} onNewFolder={() => { }} onNewTab={() => { }} onNewWindow={() => { }} />
                    </Flex>
                )
            }
        </Box >
    );
}


export default Spaces;
