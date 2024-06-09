import { Box, Flex, Heading } from '@chakra-ui/layout';
import React, { useEffect, useState } from 'react';
import { SpaceData } from './Types';
import { Accordion, AccordionButton, AccordionItem, AccordionPanel } from '@chakra-ui/accordion';

type Props = Readonly<{
    space: SpaceData
}>;

function SpaceContentComponent(props: Props) {
    return (
        <Flex grow={1} height={'100%'}>
        </Flex>)
        ;
}

export default SpaceContentComponent;