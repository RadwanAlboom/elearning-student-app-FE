import React from "react";
import MotionHoc from "./MotionHoc";
import TeamCarousel from "../../components/TeamCarousel";

const TeamComponent = () => {
    return (
        <div className="team-container">
            <div style={{height: '140vh'}}>
                <div className="about">
                    <h2>المبدع للتعليم الإلكتروني</h2>
                    <div className="description">
                        أول منصة تعليم الكتروني بفلسطين تتكون من نخبة من
                        المعلميين المميزين. تتنوع خدماتنا من تعليم تفاعلي متكامل
                        لطلاب المنهاج الوطني والدولي والجامعات والعديد من
                        الدورات التدريبية باستخدام أحدث التقنيات والتكنولوجيا
                        والذكاء الاصطناعي لتسهيل وصول المعلومة بما يتناسب مع
                        تطور العصر والتكنولوجيا
                    </div>
                </div>
                <TeamCarousel />
            </div>
        </div>
    );
};

const Team = MotionHoc(TeamComponent);

export default Team;
