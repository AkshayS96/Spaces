import SpaceHeaderComponent from './SpaceHeaderComponent';
import SpaceSearchComponent from './SpaceSearchComponent';
import { Flex, Spin } from 'antd';
import SpacesFooterComponent from './SpaceFooterComponent';
import { LoadingOutlined } from '@ant-design/icons';
import { SpaceContext, useSpaceData } from './SpaceContextUtils';
import SpaceContentTree from './content/SpaceContentTree';

import './SpaceComponent.css';
import { useEffect } from 'react';

type Props = Readonly<{
    spaceId: string,
    currentSpaceId: string,
    onNewSpace: () => void
    onDelete: (spaceId: string) => void
}>;

function SpaceComponent(props: Props) {
    const {
        spaceData,
        spaceLoading,
        searchStr,
        onSetThemeColor,
        onSpaceNameChange,
        onSpaceEmojiChange,
        onSpaceDelete,
        onNewSpace,
        onSearchChange,
        onChildNodeMove,
        onChildNodeRename,
        onChildFolderNodeCreate,
        onChildNodeDelete,
        addCurrentTab,
    } = useSpaceData(props.spaceId, props.onDelete, props.onNewSpace);

    useEffect(() => {
        if (props.currentSpaceId === spaceData?.id) {
            document.body.style.transition = 'background-color 300ms linear';
            document.body.style.background = spaceData?.themeColor ?? '';  // This is just a hack as it is really hard to set color on body
        }
    }, [spaceData, props.currentSpaceId]);

    console.log(spaceData?.id, props.currentSpaceId);

    return (
        <SpaceContext.Provider value={{
            spaceData,
            searchStr,
            onSetThemeColor,
            onSpaceNameChange,
            onSpaceEmojiChange,
            onSpaceDelete,
            onNewSpace,
            onSearchChange,
            onChildNodeMove,
            onChildNodeRename,
            onChildFolderNodeCreate,
            onChildNodeDelete,
            addCurrentTab
        }}>
            {spaceLoading ? <Flex vertical style={{ height: '100%' }} justify='center' align='center'>
                <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
            </Flex> :
                <Flex vertical justify='space-between' align='space-between' style={{ height: '100%' }} gap={16}>
                    <SpaceSearchComponent onSearchChange={onSearchChange} />
                    <SpaceHeaderComponent />
                    <Flex vertical style={{ height: '100%', width: '100%', overflowY: 'scroll' }}>
                        <SpaceContentTree />
                    </Flex>
                    <SpacesFooterComponent />
                </Flex >}
        </SpaceContext.Provider>


    );
}

export default SpaceComponent;