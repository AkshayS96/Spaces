import Icon, { CustomIconComponentProps } from "@ant-design/icons/lib/components/Icon"

export function NewSpaceIcon(props: Partial<CustomIconComponentProps>) {
    return <Icon component={() => (
        <svg xmlns="http://www.w3.org/2000/svg" height={props.height} viewBox="0 -960 960 960" width={props.width} fill={props.fill}>
            <path d="M760-760H599h5-4 160Zm-240 0q0-33 23.5-56.5T600-840h160q33 0 56.5 23.5T840-760v400h-80v-400H600v640q-33 0-56.5-23.5T520-200v-560ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h160q33 0 56.5 23.5T440-760v560q0 33-23.5 56.5T360-120H200Zm160-640H200v560h160v-560Zm0 0H200h160ZM760-40v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
        </svg>
    )} {...props} />
}

export function NewTabIcon(props: Partial<CustomIconComponentProps>) {
    return <Icon component={() => (
        <svg xmlns="http://www.w3.org/2000/svg" height={props.height} viewBox="0 -960 960 960" width={props.width} fill={props.fill}><path d="M160-240h640v-320H520v-160H160v480Zm0 80q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm0-80v-480 480Z" /></svg>
    )} {...props} />
}


export function NewWindowIcon(props: Partial<CustomIconComponentProps>) {
    return <Icon component={() => (
        <svg xmlns="http://www.w3.org/2000/svg" height={props.height} viewBox="0 -960 960 960" width={props.width} fill={props.fill}><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h240v80H200v560h560v-240h80v240q0 33-23.5 56.5T760-120H200Zm440-400v-120H520v-80h120v-120h80v120h120v80H720v120h-80Z" /></svg>
    )} {...props} />
}

export function FolderOpen(props: Partial<CustomIconComponentProps>) {
    return <Icon component={() => (
        <svg xmlns="http://www.w3.org/2000/svg" height={props.height} viewBox="0 -960 960 960" width={props.width} fill={props.fill}><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H447l-80-80H160v480l96-320h684L837-217q-8 26-29.5 41.5T760-160H160Zm84-80h516l72-240H316l-72 240Zm0 0 72-240-72 240Zm-84-400v-80 80Z" /></svg>
    )
    } {...props} />
}

export function FolderClose(props: Partial<CustomIconComponentProps>) {
    return <Icon component={() => (
        <svg xmlns="http://www.w3.org/2000/svg" height={props.height} viewBox="0 -960 960 960" width={props.width} fill={props.fill}><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h207q16 0 30.5 6t25.5 17l57 57h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z" /></svg>
    )} {...props} />
}

export function FolderFullClose(props: Partial<CustomIconComponentProps>) {
    return <Icon component={() => (
        <svg xmlns="http://www.w3.org/2000/svg" height={props.height} viewBox="0 -960 960 960" width={props.width} fill={props.fill}><path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h207q16 0 30.5 6t25.5 17l57 57h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Zm120-80h240q17 0 28.5-11.5T560-360q0-17-11.5-28.5T520-400H280q-17 0-28.5 11.5T240-360q0 17 11.5 28.5T280-320Zm0-160h400q17 0 28.5-11.5T720-520q0-17-11.5-28.5T680-560H280q-17 0-28.5 11.5T240-520q0 17 11.5 28.5T280-480Z" /></svg>
    )} {...props} />
}

export function WebsiteIcon(props: Partial<CustomIconComponentProps> & { src: string }) {
    const { src, ...iconProps } = props;
    return <Icon component={() => {
        return <img src={props.src} height={props.height} width={props.width} />
    }} {...iconProps} />
}