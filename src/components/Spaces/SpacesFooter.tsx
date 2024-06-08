import { Button, IconButton } from "@chakra-ui/button";
import { Icon, createIcon } from "@chakra-ui/icon";
import { AddIcon } from "@chakra-ui/icons";
import { Box, Circle, Divider, Flex, HStack, Kbd, Stack, VStack } from "@chakra-ui/layout";
import { Popover, PopoverArrow, PopoverBody, PopoverContent, PopoverTrigger } from "@chakra-ui/popover";
import { useState } from "react";
import { MdArrowBack, MdArrowForward, MdCircle, MdOutlineCreateNewFolder, MdOutlineSpaceDashboard, MdOutlineTab } from "react-icons/md";
import { SpacesData } from "./Types";
import { Tooltip } from "@chakra-ui/tooltip";

type PopoverProps = Readonly<{
    onNewSpace?: () => void,
    onNewFolder?: () => void,
    onNewWindow?: () => void,
    onNewTab?: () => void,
}>;


type SpacesProps = Readonly<{
    spaces: SpacesData[],
}> & PopoverProps;

const MDOutlineNewWindow = createIcon({
    displayName: "New Window",
    viewBox: "0 -960 960 960",
    path: (
        <path fill="currentColor" xmlns="http://www.w3.org/2000/svg" d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240v80H200v560h560v-240h80v240q0 33-23.5 56.5T760-120H200Zm440-400v-120H520v-80h120v-120h80v120h120v80H720v120h-80Z" ></path>
    ),
});

function AboutComponent() {
    return <div>About</div>
}

function SpacesCursorComponent(props: { spaces: SpacesData[] }) {
    const [selectedId, setSelectedId] = useState<number>(0);
    const [startIndex, setStartIndex] = useState<number>(0);

    const maxSpaces: number = 3;

    return <HStack maxWidth="80%" justifyContent="center" overflow="scroll" >
        <IconButton size="sm" aria-label="" icon={<MdArrowBack />} onClick={() => {
            setStartIndex(Math.max(0, startIndex - 1));
        }} isDisabled={startIndex === 0} />
        {props.spaces.slice(startIndex, startIndex + maxSpaces).map((space, index) => {
            return (
                <Tooltip borderRadius="10px" label={startIndex + index < 9 ? (<HStack><Box>{space.name}</Box> <Kbd color="black">^+shift+{startIndex + index}</Kbd></HStack>) : space.name}>
                    <IconButton aria-label="" size="sm" icon={<MdCircle size={10} />} onClick={() => {
                        setSelectedId(space.id);
                    }} variant="ghost" />
                </Tooltip>
            );
        })};
        <IconButton size="sm" aria-label="" icon={<MdArrowForward />} onClick={() => {
            setStartIndex(Math.min(startIndex + maxSpaces - 1, startIndex + 1));
        }} isDisabled={startIndex + maxSpaces >= props.spaces.length} />
    </HStack>
}

function PopoveChildButtonComponent(props: { iconType: any, label: string, onClick?: () => void }) {
    return (
        <Button variant="ghost" leftIcon={<Icon as={props.iconType} boxSize={5} />} justifyContent="left" fontSize={14} iconSpacing={3} onClick={props.onClick}>{props.label}</Button>
    );
}

function PopoverComponent(props: PopoverProps) {
    const [rotation, setRotation] = useState(0);

    const onChange = () => {
        setRotation((prevRotation) => {
            return prevRotation === 0 ? prevRotation + 45 : prevRotation - 45;
        })
    };

    return (
        <Popover size="xs" onOpen={onChange} onClose={onChange}>
            <PopoverTrigger>
                <IconButton aria-label={''} icon={<AddIcon />} variant="link" size='xl' sx={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.1s ease-in-out' }}></IconButton>
            </PopoverTrigger>
            <PopoverContent as={Stack}>
                <PopoverArrow />
                <PopoverBody>
                    <VStack justify="flex-start" align="stretch" spacing={1}>
                        <PopoveChildButtonComponent iconType={MdOutlineSpaceDashboard} label="New Space" onClick={props.onNewSpace} />
                        <PopoveChildButtonComponent iconType={MdOutlineCreateNewFolder} label="New Folder" onClick={props.onNewFolder} />
                        <Divider />
                        <PopoveChildButtonComponent iconType={MDOutlineNewWindow} label="New Window" onClick={props.onNewWindow} />
                        <PopoveChildButtonComponent iconType={MdOutlineTab} label="New Tab" onClick={props.onNewTab} />
                    </VStack>
                </PopoverBody>
            </PopoverContent>
        </Popover>
    );
}

function SpacesFooter(props: SpacesProps) {
    return (<Flex direction={"column"}>
        <HStack justifyContent={"space-between"}>
            <AboutComponent />
            <SpacesCursorComponent spaces={props.spaces} />
            <PopoverComponent onNewSpace={props.onNewSpace} onNewFolder={props.onNewFolder} onNewWindow={props.onNewWindow} onNewTab={props.onNewTab} />
        </HStack>
    </Flex>);
}

export default SpacesFooter;