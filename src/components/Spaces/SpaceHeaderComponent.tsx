import { SpaceDataNode } from './Types';
import { Button, ConfigProvider, Dropdown, Flex, Input, Space, Typography } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { Utils } from '../utils/Utils';
import { useMemo, useState } from 'react';

import './SpaceHeaderComponent.css';

type Props = Readonly<{
    space: SpaceDataNode,
    onNameChange: (newName: string) => void,
    onNewFolder: () => void,
    onDelete: () => void,
}>;

function SpaceHeaderComponent(props: Props) {
    const [isRenameSpace, setIsRenameSpace] = useState<boolean>(false);

    const menuItems = [{
        label: 'Rename Space...',
        key: '0',
        onClick: () => setIsRenameSpace(true)
    },
    {
        label: 'New Folder',
        key: '1',
        onClick: props.onNewFolder,
    }, {
        label: 'Delete Space',
        key: '2',
        onClick: props.onDelete,
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
                                        props.onNameChange(newName);
                                    }
                                    setIsRenameSpace(false);
                                },
                                onCancel: () => {
                                    setIsRenameSpace(false);
                                },
                            }
                        } level={4} style={{ margin: 0, border: '0px' }}>
                        {Utils.capitalize(props.space.name)}
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