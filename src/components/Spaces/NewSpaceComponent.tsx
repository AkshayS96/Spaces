import { Button } from '@chakra-ui/button';
import { Checkbox } from '@chakra-ui/checkbox';
import { Input, } from '@chakra-ui/input';
import { Box, Flex, Heading, Text, VStack } from '@chakra-ui/layout';
import { useEffect, useState } from 'react';

type NewSpaceComponentProps = Readonly<{
    onCreateSpace: (name: string) => void
    onCancel: () => void
}>;

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


function NewSpaceComponent(props: NewSpaceComponentProps) {
    const [name, setName] = useState<string>("");

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
                </VStack>
            </Flex>
            <Flex direction="column" justifySelf="flex-end" justifyContent="space-around" width="100%">
                <Button variant="solid" size="md" width="100%" onClick={() => {
                    props.onCreateSpace(name);
                }} isDisabled={name?.length === 0 || name?.length > 20}>Create Space</Button>
                <Button variant="ghost" size="md" width="100%" _hover={{}} onClick={() => { props.onCancel(); }} sx={{
                    _active: {
                        color: 'transparent'
                    }
                }}>Cancel</Button>
            </Flex>
        </Flex>
    );
}

export default NewSpaceComponent;