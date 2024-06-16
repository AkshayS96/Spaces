import { SpaceData } from './Types';
import { Button, ConfigProvider, Dropdown, Flex, Input, Space, Typography } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { Utils } from '../utils/Utils';
import { useMemo, useState } from 'react';

import './SpaceHeaderComponent.css';

type Props = Readonly<{
    space: SpaceData,
    onSpaceNameChange: (spaceId: number, newName: string) => void
}>;

function SpaceHeaderComponent(props: Props) {
    const [isRenameSpace, setIsRenameSpace] = useState<boolean>(false);

    const menuItems = useMemo(() => {
        return [{
            label: 'Rename Space...',
            key: '0',
            onClick: () => setIsRenameSpace(true)
        },
        {
            label: 'New Folder',
            key: '1',
        }, {
            label: 'Delete Space',
            key: '2',
        }];
    }, []);

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
            <Flex justify="space-between">
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
                                        props.onSpaceNameChange(props.space.id, newName);
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