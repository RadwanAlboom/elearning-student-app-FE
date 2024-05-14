import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Pagination, Navigation, Autoplay } from "swiper";

import CardCarousel from "./CardCarousel";
import { loadTeam } from "../store/team";

import "swiper/swiper-bundle.css";
import "swiper/swiper-bundle.min.css";
import "swiper/swiper.min.css";
import "./TeamCarousel.css";

SwiperCore.use([Pagination, Navigation, Autoplay]);

const TeamCarousel = () => {
    const dispatch = useDispatch();
    const team = useSelector((state) => state.entities.team.list);

    useEffect(() => {
        dispatch(loadTeam());
    }, [dispatch]);

    const displayTeam = team.map((member) => {
        return (
            <SwiperSlide>
                <CardCarousel
                    name={member.name}
                    major={member.major}
                    email={member.email}
                    whatsapp={member.whatsapp}
                    facebook={member.facebook}
                    phone={member.phone}
                    image={member.image}
                />
            </SwiperSlide>
        );
    });

    return (
        <div>
            <Swiper
                spaceBetween={10}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                }}
                pagination={{
                    clickable: true,
                }}
                centeredSlides={true}
                breakpoints={{
                    640: {
                        slidesPerView: 1,
                        spaceBetween: 20,
                    },
                    768: {
                        slidesPerView: 1,
                        spaceBetween: 40,
                    },
                    1024: {
                        slidesPerView: 2,
                        spaceBetween: 50,
                    },
                }}
                modules={[Pagination, Navigation, Autoplay]}
                className="mySwiper"
            >
                {displayTeam}
            </Swiper>
        </div>
    );
};

export default TeamCarousel;
