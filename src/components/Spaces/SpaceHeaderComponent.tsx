import React, { useEffect, useState } from 'react';
import { SpaceData } from './Types';
import { Flex, HStack, Heading, Text } from '@chakra-ui/layout';
import { Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/menu';
import { IconButton } from '@chakra-ui/button';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Utils } from '../utils/Utils';
import { MdOutlineMoreHoriz } from 'react-icons/md';

type Props = Readonly<{
    space: SpaceData
}>;

function SpaceHeaderComponent(props: Props) {
    return <HStack direction="row" justifyContent="space-between" padding={2}>
        <Heading as="h3" size="md">{Utils.capitalize(props.space.name)}</Heading>
        <Menu>
            <MenuButton as={IconButton} aria-label="" size="sm" icon={<MdOutlineMoreHoriz size={20} />} variant="ghost">
            </MenuButton>
            <MenuList>
                <MenuItem>Rename Space...</MenuItem>
                <MenuItem>New Folder</MenuItem>
                <MenuItem>Delete Space</MenuItem>
            </MenuList>
        </Menu>
    </HStack>
}

export default SpaceHeaderComponent;