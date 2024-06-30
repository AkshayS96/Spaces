import SpaceHeaderComponent from './SpaceHeaderComponent';
import SpaceSearchComponent from './SpaceSearchComponent';
import { Flex, Spin } from 'antd';
import SpacesFooterComponent from './SpaceFooterComponent';
import { LoadingOutlined } from '@ant-design/icons';
import { SpaceContext, useSpaceData } from './SpaceContextUtils';
import SpaceContentTree from './content/SpaceContentTree';

import './SpaceComponent.css';

type Props = Readonly<{
    spaceId: string,
    onNewSpace: () => void
    onDelete: (spaceId: string) => void
}>;

function SpaceComponent(props: Props) {
    const { spaceData,
        spaceLoading,
        onSpaceNameChange,
        onSpaceDelete,
        onNewSpace,
        onChildNodeMove,
        onChildNodeRename,
        onChildFolderNodeCreate,
        onChildNodeDelete,
        addCurrentTab,
    } = useSpaceData(props.spaceId, props.onDelete, props.onNewSpace);

    return (
        <SpaceContext.Provider value={{
            spaceData,
            onSpaceNameChange,
            onSpaceDelete,
            onNewSpace,
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
                    <SpaceSearchComponent />
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