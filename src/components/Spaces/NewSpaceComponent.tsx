import { Button } from '@chakra-ui/button';
import { Checkbox } from '@chakra-ui/checkbox';
import { Input, } from '@chakra-ui/input';
import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/layout';
import { useEffect, useState } from 'react';

function SpacesLogo() {
    return (
        <Box border={1} borderColor="black" padding="5px">
            <Flex borderColor="black" justifyContent="center" data-group>
                <Box letterSpacing="0.2em"><Heading marginLeft="2px" marginRight="2px" sx={{
                    backgroundColor: 'black',
                    color: 'white',
                    letterSpacing: '0.2em',
                    _groupHover: {
                        backgroundColor: 'white',
                        color: 'black',
                        transition: 'background-color 100ms linear',
                    }
                }}>SPA</Heading></Box>
                <Box color="black" letterSpacing="0.2em" sx={{
                    backgroundColor: 'white',
                    color: 'black',
                    letterSpacing: '0.2em',
                    _groupHover: {
                        backgroundColor: 'black',
                        color: 'white',
                        transition: 'background-color 100ms linear',
                    }
                }}><Heading marginLeft="2px" marginRight="2px">CES</Heading></Box>
            </Flex>
        </Box>
    );
}


function NewSpaceComponent() {
    const [name, setName] = useState<string>();
    const [tabs, setTabs] = useState<chrome.tabs.Tab[]>([]);
    const [copyTabs, setCopyTabs] = useState(false);

    useEffect(() => {
        chrome.tabs.query({ currentWindow: true }, (tabs) => {
            setTabs(tabs);
        });
    }, [])

    return (
        <Flex height="100%" grow={1} direction="column" justifyContent="space-between" alignContent={"center"} alignItems={"center"}>
            <Flex gap={10} width={"100%"} direction="column">
                <VStack justifyContent="center">
                    <SpacesLogo />
                    <Heading as="h3" size="md">Create a Space</Heading>
                    <Text size="sm">Separate spaces for different things</Text>
                </VStack>
                <VStack direction="column" alignItems="left">
                    <Input placeholder="Space name...." onChange={(event) => {
                        setName(event.target.value);
                    }} />
                    {tabs.length > 0 ? <Checkbox size="sm" onChange={(event) => {
                        setCopyTabs(event.target.checked);
                    }}>Copy tabs from current window</Checkbox> : null}
                </VStack>
            </Flex>
            <Flex direction="column" justifySelf="flex-end" justifyContent="space-around" width="100%">
                <Button variant="solid" size="md" width="100%">Create Space</Button>
                <Button variant="ghost" size="md" width="100%" _hover={{}}>Cancel</Button>
            </Flex>
        </Flex>
    );
}

export default NewSpaceComponent;