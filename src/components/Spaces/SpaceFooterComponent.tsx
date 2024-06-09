import { FloatButton } from "antd";
import Icon, { FolderAddOutlined, PlusOutlined } from "@ant-design/icons";
import { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon";


type SpacesProps = Readonly<{
    onNewSpace?: () => void,
    onNewFolder?: () => void,
    onNewTab?: () => void,
}>


const NewSpaceIcon = (props: Partial<CustomIconComponentProps>) => {
    return <Icon component={() => (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="currentColor" height='1em' width='1em'>
            <path d="M760-760H599h5-4 160Zm-240 0q0-33 23.5-56.5T600-840h160q33 0 56.5 23.5T840-760v400h-80v-400H600v640q-33 0-56.5-23.5T520-200v-560ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h160q33 0 56.5 23.5T440-760v560q0 33-23.5 56.5T360-120H200Zm160-640H200v560h160v-560Zm0 0H200h160ZM760-40v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
        </svg>
    )} {...props} />
}

const NewTabIcon = (props: Partial<CustomIconComponentProps>) => {
    return <Icon component={() => (
        <svg xmlns="http://www.w3.org/2000/svg" height="1em" width='1em' viewBox="0 -960 960 960" fill="currentColor"><path d="M160-240h640v-320H520v-160H160v480Zm0 80q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80v-480 480Z" /></svg>
    )} {...props} />
}

// const NewWindowIcon = (props: Partial<CustomIconComponentProps>) => {
//     return <Icon component={() => (
//         <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 -960 960 960" width="1em" fill="currentColor"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240v80H200v560h560v-240h80v240q0 33-23.5 56.5T760-120H200Zm440-400v-120H520v-80h120v-120h80v120h120v80H720v120h-80Z" /></svg>
//     )} {...props} />
// }

function SpacesFooterComponent(props: SpacesProps) {
    return <FloatButton.Group trigger="click" style={{ right: 24 }} icon={<PlusOutlined />} >
        <FloatButton icon={<NewSpaceIcon />} tooltip={<div>New Space</div>} onClick={props.onNewSpace} />
        <FloatButton icon={<FolderAddOutlined />} tooltip={<div>New Folder</div>} onClick={props.onNewFolder} />
        <FloatButton icon={<NewTabIcon />} tooltip={<div>New Tab</div>} onClick={props.onNewTab} />
        {/* <FloatButton icon={<NewWindowIcon />} tooltip={<div>New Window</div>} /> */}
    </FloatButton.Group>
}

export default SpacesFooterComponent;