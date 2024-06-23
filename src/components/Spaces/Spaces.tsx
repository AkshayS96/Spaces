/* global chrome */

import { useEffect, useState } from 'react';
import SpaceComponent from './SpaceComponent';
import NewSpaceComponent from './NewSpaceComponent';
import { SpaceData } from './Types';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import tippy from 'tippy.js'

import { Pagination } from 'swiper/modules';
import { Flex, Spin, notification } from 'antd';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import './Spaces.css';
import 'tippy.js/dist/tippy.css'; // optional for styling
import { Utils } from '../utils/Utils';
import { LoadingOutlined } from '@ant-design/icons';
import SpaceContentTree from './content/SpaceContentTree';


function Spaces() {
    const [isLoading, setisLoading] = useState<boolean>(true);
    const [spaces, setSpaces] = useState<{ id: string, name: string }[]>([]);
    const [currentSpace, setCurrentSpace] = useState<number>(0);
    const [isCreateSpace, setIsCreateSpace] = useState(false);
    const [swiper, setSwiper] = useState<SwiperClass>();
    const [notificationApi, contextHolder] = notification.useNotification();


    // add loading state till we don't look up in local storage
    useEffect(() => {
        const setupSpaces = async () => {
            const spacesIdsStr = window.localStorage.getItem("spaces-extension-spaceIds"); // Change with chrome api later on
            if (spacesIdsStr) {
                const spaceIds: Array<string> = JSON.parse(spacesIdsStr);
                if (spaceIds) {
                    const spacesLocal: { id: string, name: string }[] = []
                    spaceIds.forEach((spaceId) => {
                        const spaceDataStr = window.localStorage.getItem(`spaces-extension-space-${spaceId}`);
                        if (spaceDataStr) {
                            const spaceData = JSON.parse(spaceDataStr);
                            spacesLocal.push({
                                id: spaceId,
                                name: spaceData.name,
                            });
                        }
                    });

                    setSpaces(spacesLocal);
                }
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
                content: `<div class="swiper-bullet-pagination-custom" >${spaces[index].name}  <kbd>Ctrl+Shift+${index}</kbd></div>`,
                allowHTML: true,
            })
        })

        return () => {
            tippyInstances.forEach((instance) => {
                instance.destroy();
            })
        }
    }, [spaces]);

    const onCreateSpace = (name: string) => {
        const newSpace = { id: Utils.getUniqueId(), name };
        const newSpaces = [...spaces.slice(0, currentSpace + 1), newSpace, ...spaces.slice(currentSpace + 1)];
        window.localStorage.setItem("spaces-extension-spaceIds", JSON.stringify(newSpaces.map((space) => space.id))); // Change with chrome api later on
        window.localStorage.setItem(`spaces-extension-space-${newSpace.id}`, JSON.stringify({ ...newSpace, children: [] }));
        setSpaces(newSpaces);
        if (swiper) {
            swiper.slideNext();
        }
        setCurrentSpace(currentSpace + 1);
        setIsCreateSpace(false);
    };

    const onCreateSpaceCancel = () => {
        setIsCreateSpace(false);
    };

    const onDeleteSpace = (spaceIdToDelete: string) => {
        const newSpaces = spaces.filter((space: { id: string, name: string }) => {
            return space.id !== spaceIdToDelete;
        });
        window.localStorage.setItem("spaces-extension-spaceIds", JSON.stringify(newSpaces)); // Change with chrome api later on
        window.localStorage.removeItem(`spaces-extension-space-${spaceIdToDelete}`);
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
