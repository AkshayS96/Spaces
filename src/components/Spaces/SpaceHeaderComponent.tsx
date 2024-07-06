import { SpaceDataNode } from './Types';
import { Button, ColorPicker, ConfigProvider, Dropdown, Flex, Input, Popover, Space, Typography } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { Utils } from './Utils';
import { useContext, useMemo, useState } from 'react';
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { SpaceContext } from './SpaceContextUtils';
import { Color } from 'antd/es/color-picker';

import './SpaceHeaderComponent.css';
import { Emoji } from 'emoji-mart';

function SpaceHeaderComponent() {
    const [isRenameSpace, setIsRenameSpace] = useState<boolean>(false);
    const [hovered, setHovered] = useState<boolean>(false);
    const spaceContext = useContext(SpaceContext);

    const menuItems = [
        {
            label: (
                <ColorPicker
                    defaultValue={spaceContext.spaceData?.themeColor}
                    showText={(color) => <span>Select theme color</span>}
                    onChange={(value: Color) => spaceContext.onSetThemeColor(value.toHexString())} />
            ),
            key: 'edit_theme_color',
        },
        {
            label: 'Rename Space...',
            key: 'rename_space',
            onClick: () => setIsRenameSpace(true)
        },
        {
            label: 'New Folder',
            key: 'new_folder',
            onClick: () => { spaceContext.onChildFolderNodeCreate(Utils.NewFolder()); },
        }, {
            label: 'Delete Space',
            key: 'delete_space',
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
            <Flex justify="space-between" style={{ paddingLeft: 6 }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
                <Flex align='center' gap={8}>
                    <Popover trigger={["click"]} content={<Picker data={data} onEmojiSelect={(emoji: any) => spaceContext.onSpaceEmojiChange(emoji.native)} />}>
                        <Typography.Title level={4} style={{ margin: 0, border: '0px' }}>
                            {spaceContext.spaceData?.emoji ?? '😍'}
                        </Typography.Title>
                    </Popover>

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
                        <Button
                            type='text'
                            style={{
                                backgroundColor: spaceContext.spaceData?.themeColor,
                                visibility: hovered ? undefined : 'hidden',
                            }} icon={<EllipsisOutlined color={spaceContext.spaceData?.themeColor} type='strong' size={40} />} />
                    </Dropdown>
                </Flex>
            </Flex>
        </ConfigProvider>);
}

export default SpaceHeaderComponent;