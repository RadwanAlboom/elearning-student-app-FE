import { SiSpringsecurity } from "react-icons/si";
import VerificationForm from "../../components/user/verificationForm";

const Verification = (props) => {

    return (
        <div className="particle-content">
            <div className="particle-form">
                <div className="security-logo">
                    <SiSpringsecurity size={"8rem"} color="white" />
                </div>
                <div className="verification-form-container">
                    <VerificationForm location={props.location}/>
                </div>
            </div>
        </div>
    );
};

export default Verification;
