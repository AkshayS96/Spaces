import React, { useEffect, useState } from 'react';

import { Box, Divider, Drawer, Flex, Grid, Spacer, StackDivider, VStack } from '@chakra-ui/react'
import AppSpaceHeaderComponent from './AppSpaceHeaderComponent';
import AppSpaceSearchComponent from './AppSpaceSearchComponent';
import AppSpaceContentComponent from './AppSpaceContentComponent';

type Props = Readonly<{
    spaceId: string
}>;

function AppSpaceComponent(props: Props) {
    return (
        <Flex flexDirection='column' height="100%" justifyContent={"space-between"}>
            <VStack alignItems="start">
                <AppSpaceSearchComponent />
                <AppSpaceHeaderComponent />
            </VStack>
            <AppSpaceContentComponent />
        </Flex>
    );
}

export default AppSpaceComponent;