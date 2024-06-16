/* global chrome */

import { Children, useEffect, useState } from 'react';
import SpaceComponent from './SpaceComponent';
import NewSpaceComponent from './NewSpaceComponent';
import { ChildrenType, SpaceData } from './Types';
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
    const [isCreateSpace, setIsCreateSpace] = useState(true);


    useEffect(() => {
        const setupSpaces = async () => {
            // // Load up saved spaces
            // const result = await chrome.storage.local.get("spaces");
            // let spacesLocal = []
            // if (result && result.spaces) {
            //     spacesLocal = result.spaces;
            // }

            const spacesLocal: SpaceData[] = []
            spacesLocal.push({
                id: 0,
                isDefault: true,
                name: "Untitled",
                children: [],
            });

            setSpaces(spacesLocal);
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
            children: [],
            isDefault: false
        }]);
        setIsCreateSpace(false);
        setCurrentSpace(spaces.length);
    }

    const onCreateSpaceCancel = () => {
        setIsCreateSpace(false);
    }

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
    }

    // We have spaces data so populate that
    return (
        <Flex vertical justify='center' style={{ height: '95vh', padding: '10px' }}>
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
                                        <SpaceComponent space={space} onNewSpace={() => setIsCreateSpace(true)} onSpaceNameChange={onSpaceNameChange} />
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
