/* global chrome */

import { useEffect, useState } from 'react';
import SpaceComponent from './SpaceComponent';
import NewSpaceComponent from './NewSpaceComponent';
import { SpaceData } from './Types';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import tippy from 'tippy.js'

import { Pagination } from 'swiper/modules';
import { Flex, notification } from 'antd';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import './Spaces.css';
import 'tippy.js/dist/tippy.css'; // optional for styling
import { Utils } from '../utils/Utils';


function Spaces() {
    const [spaces, setSpaces] = useState<SpaceData[]>([]);
    const [currentSpace, setCurrentSpace] = useState<number>(0);
    const [isCreateSpace, setIsCreateSpace] = useState(false);
    const [swiper, setSwiper] = useState<SwiperClass>();
    const [notificationApi, contextHolder] = notification.useNotification();

    useEffect(() => {
        const setupSpaces = async () => {
            // // Load up saved spaces
            // const result = await chrome.storage.local.get("spaces");
            // let spacesLocal = []
            // if (result && result.spaces) {
            //     spacesLocal = result.spaces;
            // }

            // setSpaces(spacesLocal);
        }
        setupSpaces();
    }, []);

    useEffect(() => {
        if (spaces.length === 0) {
            return () => { };
        }

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
        setSpaces([...spaces.slice(0, currentSpace + 1), {
            id: Utils.getUniqueIdNumber(),
            name,
            children: [],
            isDefault: false
        }, ...spaces.slice(currentSpace + 1)]);
        if (swiper) {
            swiper.slideNext();
        }
        setCurrentSpace(currentSpace + 1);
        setIsCreateSpace(false);
    };

    const onCreateSpaceCancel = () => {
        setIsCreateSpace(false);
    };

    const onSpaceNameChange = (spaceId: number, newName: string) => {
        const newSpaces = spaces.map((value: SpaceData, _) => {
            if (value.id === spaceId) {
                return {
                    ...value,
                    name: newName
                }
            }
            return value;
        });
        setSpaces(newSpaces);
    };

    const onSpaceDelete = (spaceId: number) => {
        const newSpaces = spaces.filter((space: SpaceData) => {
            return space.id !== spaceId;
        });
        setSpaces(newSpaces);
    };

    const onSpaceDataChange = (spaceId: number, newSpaceData: SpaceData) => {
        const newSpaces = spaces.map((oldSpaceData) => {
            if (oldSpaceData.id === spaceId) {
                return newSpaceData;
            }
            return oldSpaceData
        });
        setSpaces(newSpaces);
    }

    // We have spaces data so populate that
    return (
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
                        >
                            {spaces.map((space, _index) => {
                                return (
                                    <SwiperSlide style={{ "height": "100%" }} key={space.id} >
                                        <SpaceComponent
                                            space={space}
                                            onNewSpace={() => setIsCreateSpace(true)}
                                            onNameChange={onSpaceNameChange}
                                            onDelete={onSpaceDelete}
                                            onDataChange={onSpaceDataChange}
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
