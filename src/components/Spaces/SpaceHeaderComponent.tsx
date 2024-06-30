import { SpaceDataNode } from './Types';
import { Button, ConfigProvider, Dropdown, Flex, Input, Space, Typography } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { Utils } from './Utils';
import { useContext, useMemo, useState } from 'react';

import './SpaceHeaderComponent.css';
import { SpaceContext } from './SpaceContextUtils';


function SpaceHeaderComponent() {
    const [isRenameSpace, setIsRenameSpace] = useState<boolean>(false);

    const spaceContext = useContext(SpaceContext);

    const menuItems = [{
        label: 'Rename Space...',
        key: '0',
        onClick: () => setIsRenameSpace(true)
    },
    {
        label: 'New Folder',
        key: '1',
        onClick: () => { spaceContext.onChildFolderNodeCreate(Utils.NewFolder()); },
    }, {
        label: 'Delete Space',
        key: '2',
        onClick: () => {
            spaceContext.onSpaceDelete();
        },
    }];

    return (
        <ConfigProvider theme={{
            components: {
                Input: {
                    activeShadow: '',
                    padding: 0,
                    margin: 0,
                }
            }
        }}>
            <Flex justify="space-between" style={{ paddingLeft: 12 }} >
                <Flex>
                    <Typography.Title
                        onClick={() => setIsRenameSpace(true)}
                        editable={
                            {
                                maxLength: 30,
                                triggerType: ['text'],
                                editing: isRenameSpace,
                                onChange: (newName: string) => {
                                    if (newName.length > 0) {
                                        spaceContext.onSpaceNameChange(newName);
                                        setIsRenameSpace(false);
                                    }
                                },
                                onCancel: () => {
                                    setIsRenameSpace(false);
                                },
                            }
                        } level={4} style={{ margin: 0, border: '0px' }}>
                        {Utils.capitalize(spaceContext.spaceData?.name ?? "")}
                    </Typography.Title>
                </Flex>
                <Flex>
                    <Dropdown menu={{ items: menuItems }} arrow>
                        <Button icon={<EllipsisOutlined size={20} />} />
                    </Dropdown>
                </Flex>
            </Flex>
        </ConfigProvider>);
}

export default SpaceHeaderComponent;