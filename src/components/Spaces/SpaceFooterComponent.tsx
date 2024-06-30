import { FloatButton } from "antd";
import Icon, { FolderAddOutlined, PlusOutlined } from "@ant-design/icons";
import { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";
import { NewSpaceIcon, NewTabIcon } from "../common/Icons";
import { useContext } from "react";
import { SpaceContext } from "./SpaceContextUtils";
import { Utils } from "./Utils";


function SpacesFooterComponent() {
    const spaceContext = useContext(SpaceContext);

    return <FloatButton.Group trigger="click" icon={<PlusOutlined />} >
        <FloatButton icon={<NewSpaceIcon height='1em' width='1em' fill="currentColor" />} tooltip={<div>New Space</div>} onClick={() => spaceContext.onNewSpace()} />
        <FloatButton icon={<FolderAddOutlined />} tooltip={<div>New Folder</div>} onClick={() => spaceContext.onChildFolderNodeCreate(Utils.NewFolder())} />
    </FloatButton.Group>
}

export default SpacesFooterComponent;