import { SpaceData } from './Types';
import { Button, Dropdown, Flex, Space, Typography } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { Utils } from '../utils/Utils';


type Props = Readonly<{
    space: SpaceData
}>;

const MENU_ITEMS = [{
    label: 'Rename Space...',
    key: '0',
},
{
    label: 'New Folder',
    key: '1',
}, {
    label: 'Delete Space',
    key: '2',
},
];

function SpaceHeaderComponent(props: Props) {
    return <Flex justify="space-between">
        <Typography.Title level={3} style={{ margin: 0 }}>
            {Utils.capitalize(props.space.name)}
        </Typography.Title>
        <Dropdown menu={{ items: MENU_ITEMS }}>
            <Button icon={<EllipsisOutlined size={20} />} />
        </Dropdown>
    </Flex>
}

export default SpaceHeaderComponent;