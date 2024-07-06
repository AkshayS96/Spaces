import { Button, ConfigProvider, Flex, Input } from 'antd';
import { Typography } from 'antd';
import { useEffect, useState } from 'react';

const { Title, Text } = Typography

type NewSpaceComponentProps = Readonly<{
    onCreateSpace: (name: string) => void
    onCancel: () => void
    disableCancel: boolean
}>;

function SpacesLogo() {
    const [hovered, setHovered] = useState<boolean>(false);

    return (
        <Flex justify="center" align='center' onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            <Flex>
                <Title style={{
                    padding: 2,
                    backgroundColor: 'black',
                    color: hovered ? 'black' : 'white',
                    background: hovered ? 'white' : 'black',
                    transition: 'background-color 300ms ease-out, color 300ms ease-out',
                    letterSpacing: '0.2em',
                }} level={3}>SPA</Title>
            </Flex>
            <Flex>
                <Title style={{
                    padding: 2,
                    backgroundColor: 'black',
                    letterSpacing: '0.2em',
                    color: hovered ? 'white' : 'black',
                    background: hovered ? 'black' : 'white',
                    transition: 'background-color 300ms ease-in, color 300ms ease-in',
                }} level={3}>CES</Title>
            </Flex>
        </Flex>
    );
}


function NewSpaceComponent(props: NewSpaceComponentProps) {
    const [name, setName] = useState<string>("");

    useEffect(() => {
        const listener = (event: KeyboardEvent) => {
            if (event.key === "Enter") {
                if (name.length > 0) {
                    props.onCreateSpace(name);
                }
            } else if (event.key === "Escape") {
                props.onCancel();
            }
        }
        document.addEventListener("keydown", listener)
        return () => {
            document.removeEventListener("keydown", listener);
        }
    }, [props.disableCancel, name]);

    return (
        <Flex style={{ height: "100%" }} vertical justify="space-between" align={"center"}>
            <Flex gap={10} style={{ width: "100%" }} vertical>
                <Flex justify="center" vertical align='center'>
                    <SpacesLogo />
                    <Title level={3} >Create a Space</Title>
                    <Text>Separate spaces for different things</Text>
                </Flex>
                <Flex vertical align="center" justify='center'>
                    <Input placeholder="Space name...." onChange={(event) => {
                        setName(event.target.value);
                    }} autoFocus />
                </Flex>
            </Flex>
            <Flex vertical style={{ justifySelf: "flex-end", justifyContent: "space-around", width: "100%" }} gap={5}>
                <ConfigProvider theme={{
                    components: {
                        Button: {
                            defaultActiveBg: "black",
                            colorPrimary: 'black',
                        }
                    }
                }}>
                    <Button type='primary' onClick={() => {
                        props.onCreateSpace(name);
                    }}
                        disabled={name?.length === 0 || name?.length > 20}>Create Space</Button>
                </ConfigProvider>
                <Button disabled={props.disableCancel} type="text" onClick={() => { props.onCancel(); }} style={{
                }}>Cancel</Button>
            </Flex>
        </Flex>
    );
}

export default NewSpaceComponent;