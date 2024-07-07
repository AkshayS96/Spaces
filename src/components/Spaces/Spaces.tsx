/* global chrome */

import { useEffect, useState } from 'react';
import SpaceComponent from './SpaceComponent';
import NewSpaceComponent from './NewSpaceComponent';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import tippy from 'tippy.js'

import { Pagination } from 'swiper/modules';
import { Flex, Spin, notification } from 'antd';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import './Spaces.css';
import 'tippy.js/dist/tippy.css'; // optional for styling
import { Utils } from './Utils';
import { LoadingOutlined } from '@ant-design/icons';


function Spaces() {
    const [isLoading, setisLoading] = useState<boolean>(true);
    const [spaces, setSpaces] = useState<{ id: string, name: string }[]>([]);
    const [currentSpace, setCurrentSpace] = useState<number>(0);
    const [isCreateSpace, setIsCreateSpace] = useState(false);
    const [swiper, setSwiper] = useState<SwiperClass>();
    const [notificationApi, contextHolder] = notification.useNotification();

    useEffect(() => {
        const setupSpaces = async () => {
            const storedItems = await chrome.storage.local.get("spaces-extension-spaceIds");
            const spaceIds: Array<string> = storedItems["spaces-extension-spaceIds"];
            if (spaceIds) {
                const spacesLocal: Array<{ id: string, name: string }> = [];
                const allSpaceData = await chrome.storage.local.get(spaceIds.map((spaceId) => `spaces-extension-space-${spaceId}`));
                spaceIds.forEach((spaceId) => {
                    const storedSpaceData = allSpaceData[`spaces-extension-space-${spaceId}`];
                    if (storedSpaceData) {
                        spacesLocal.push({
                            id: spaceId,
                            name: storedSpaceData.name,
                        });
                    }
                });
                setSpaces(spacesLocal);
            }
            setisLoading(false);
        }
        setupSpaces();
    }, []);

    useEffect(() => {
        if (spaces.length === 0) {
            return;
        }
        // Fix Hover later
        const tippyInstances = tippy(`#swiper-navigation-bullet`);
        tippyInstances.forEach((instance, index) => {
            instance.setProps({
                content: `<div class="swiper-bullet-pagination-custom" > ${spaces[index].name} </div>`, //index < 9 ? `<div class="swiper-bullet-pagination-custom" >${spaces[index].name}  <kbd>Ctrl+Shift+${index}</kbd></div>` : "",
                allowHTML: true,
            })
        })

        return () => {
            tippyInstances.forEach((instance) => {
                instance.destroy();
            })
        }
    }, [spaces]);

    useEffect(() => {
        chrome.storage.local.set({ "spaces-current-space": spaces[currentSpace]?.id });
    }, [currentSpace])

    const onCreateSpace = (name: string) => {
        const newSpace = { id: Utils.getUniqueId(), name };
        const newSpaces = [...spaces.slice(0, currentSpace + 1), newSpace, ...spaces.slice(currentSpace + 1)];
        chrome.storage.local.set({ "spaces-extension-spaceIds": newSpaces.map((space) => space.id) });
        chrome.storage.local.set({ [`spaces-extension-space-${newSpace.id}`]: { ...newSpace, children: [] } });
        setSpaces(newSpaces);
        if (swiper) {
            swiper.slideNext();
        }
        if (currentSpace !== newSpaces.length - 1) {
            setCurrentSpace(currentSpace + 1);
        }
        setIsCreateSpace(false);
    };

    const onCreateSpaceCancel = () => {
        setIsCreateSpace(false);
    };

    const onDeleteSpace = (spaceIdToDelete: string) => {
        const newSpaces = spaces.filter((space: { id: string, name: string }) => {
            return space.id !== spaceIdToDelete;
        });
        chrome.storage.local.set({ "spaces-extension-spaceIds": newSpaces });
        chrome.storage.local.remove(`spaces-extension-space-${spaceIdToDelete}`);
        if (currentSpace !== 0) {
            setCurrentSpace(currentSpace - 1);
        }
        setSpaces(newSpaces);
    };

    // We have spaces data so populate that
    return isLoading ? <Flex vertical style={{ height: '95vh' }} justify='center' align='center'>
        <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
    </Flex> : (
        <Flex vertical justify='center' style={{ height: '95vh', padding: '10px' }}>
            {contextHolder}
            {(isCreateSpace || spaces.length === 0) ?
                (
                    <NewSpaceComponent onCreateSpace={onCreateSpace} onCancel={onCreateSpaceCancel} disableCancel={spaces.length === 0} />
                ) :
                (
                    <>
                        <Swiper
                            initialSlide={currentSpace}
                            spaceBetween={50}
                            slidesPerView={1}
                            onSlideChange={(swiper: SwiperClass) => setCurrentSpace(swiper.activeIndex)}
                            onSwiper={(swiper: any) => setSwiper(swiper)}
                            modules={[Pagination]}
                            pagination={{
                                dynamicBullets: true,
                                clickable: true,
                                bulletElement: 'div',
                                renderBullet: (_: number, className: string) => {
                                    return `<div class="${className}" id="swiper-navigation-bullet"></div>`;
                                }
                            }}
                            mousewheel={{ forceToAxis: true }}
                            style={{ height: "100%", width: "100%" }}
                            keyboard={{
                                enabled: true
                            }}
                            touchStartPreventDefault={false}
                        >
                            {spaces.map((space, _index) => {
                                return (
                                    <SwiperSlide style={{ "height": "100%" }} key={space.id} >
                                        <SpaceComponent
                                            spaceId={space.id}
                                            currentSpaceId={spaces[currentSpace].id}
                                            onNewSpace={() => setIsCreateSpace(true)}
                                            onDelete={onDeleteSpace}
                                        />
                                    </SwiperSlide>
                                );
                            })}
                        </Swiper>
                    </>
                )
            }
        </Flex >
    );
}


export default Spaces;
