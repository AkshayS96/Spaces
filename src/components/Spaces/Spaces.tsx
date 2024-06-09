/* global chrome */

import { useEffect, useState } from 'react';
import SpaceComponent from './SpaceComponent';
import NewSpaceComponent from './NewSpaceComponent';
import { SpaceData } from './Types';
import { Swiper, SwiperSlide } from 'swiper/react';
import tippy from 'tippy.js'

import { Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import './Spaces.css';
import 'tippy.js/dist/tippy.css'; // optional for styling
import { Flex, Space } from 'antd';


function Spaces() {
    const [spaces, setSpaces] = useState<SpaceData[]>([]);
    const [currentSpace, setCurrentSpace] = useState<number>(0);
    const [isCreateSpace, setIsCreateSpace] = useState(false);


    useEffect(() => {
        const setupSpaces = async () => {
            // // Load up saved spaces
            // const result = await chrome.storage.local.get("spaces");
            // let spacesLocal = []
            // if (result && result.spaces) {
            //     spacesLocal = result.spaces;
            // }
            // spacesLocal.push({
            //     id: 0,
            //     isDefault: true,
            //     name: "Default",
            //     folders: [],
            // });
            // setSpaces(spacesLocal);

            const spacesLocal = [{ id: 0, name: "test", folders: [], isDefault: false }, { id: 1, name: "test1", folders: [], isDefault: false }, { id: 2, name: "test2", folders: [], isDefault: false }, { id: 3, name: "test3", folders: [], isDefault: false }]
            setSpaces(spacesLocal as SpaceData[]);
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
        setSpaces([...spaces, {
            id: spaces.length,
            name,
            folders: [],
            isDefault: false
        } as any]);
        setIsCreateSpace(false);
        setCurrentSpace(spaces.length);
    }

    const onCreateSpaceCancel = () => {
        setIsCreateSpace(false);
    }

    // We have spaces data so populate that
    return (
        <Flex vertical justify='center' style={{ height: '95vh' }}>
            {isCreateSpace ?
                (
                    <NewSpaceComponent onCreateSpace={onCreateSpace} onCancel={onCreateSpaceCancel} />
                ) :
                (
                    <>
                        <Swiper
                            spaceBetween={50}
                            slidesPerView={1}
                            onSlideChange={() => console.log('slide change')}
                            onSwiper={(swiper: any) => console.log(swiper)}
                            modules={[Pagination]}
                            pagination={{
                                dynamicBullets: true,
                                clickable: true,
                                bulletElement: 'div',
                                renderBullet: (index: number, className: string) => {
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
                                    <SwiperSlide style={{ "height": "100%" }} key={space.id}>
                                        <SpaceComponent space={space} />
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
