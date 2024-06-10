import { FloatButton } from "antd";
import Icon, { FolderAddOutlined, PlusOutlined } from "@ant-design/icons";
import { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";
import { NewSpaceIcon, NewTabIcon } from "../common/Icons";


type SpacesProps = Readonly<{
    onNewSpace?: () => void,
    onNewFolder?: () => void,
    onNewTab?: () => void,
}>

function SpacesFooterComponent(props: SpacesProps) {
    return <FloatButton.Group trigger="click" icon={<PlusOutlined />} >
        <FloatButton icon={<NewSpaceIcon height='1em' width='1em' fill="currentColor" />} tooltip={<div>New Space</div>} onClick={props.onNewSpace} />
        <FloatButton icon={<FolderAddOutlined />} tooltip={<div>New Folder</div>} onClick={props.onNewFolder} />
        <FloatButton icon={<NewTabIcon height='1em' width='1em' fill="currentColor" />} tooltip={<div>New Tab</div>} onClick={props.onNewTab} />
        {/* <FloatButton icon={<NewWindowIcon />} tooltip={<div>New Window</div>} /> */}
    </FloatButton.Group>
}

export default SpacesFooterComponent;