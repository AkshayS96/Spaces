import { FloatButton } from "antd";
import Icon, { FolderAddOutlined, PlusOutlined } from "@ant-design/icons";
import { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";
import { NewSpaceIcon, NewTabIcon } from "../common/Icons";
import { useContext } from "react";
import { SpaceContext } from "./SpaceContextUtils";
import { Utils } from "./Utils";


function SpacesFooterComponent() {
    const spaceContext = useContext(SpaceContext);

    return <FloatButton.Group
        trigger="click" icon={<PlusOutlined />} style={{ backgroundColor: spaceContext.spaceData?.themeColor }}>
        <FloatButton
            style={{
                backgroundColor: spaceContext.spaceData?.themeColor
            }}
            icon={<NewSpaceIcon height='1em' width='1em' />}
            tooltip={<div>New Space</div>}
            onClick={() => spaceContext.onNewSpace()}
        />
        <FloatButton
            style={{
                backgroundColor: spaceContext.spaceData?.themeColor
            }}
            icon={<FolderAddOutlined />}
            tooltip={<div>New Folder</div>}
            onClick={() => spaceContext.onChildFolderNodeCreate(Utils.NewFolder())}
        />
    </FloatButton.Group>
}

export default SpacesFooterComponent;