import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MotionHoc from "./MotionHoc";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { FaUserTie } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { toast } from "react-toastify";
import VerticalModal from "../../components/admin/verticalModel";
import PaymentActionsTable from "../../components/admin/PaymentActionsTable";
import {
    loadPaymentActions,
    updatePaymentAmount,
} from "../../store/paymentActions";
import UpdatePaymentForm from "../../components/admin/UpdatePaymentForm";

const PaymentActionsComponent = () => {
    const history = useHistory();
    const location = useLocation();
    const dispatch = useDispatch();
    const paymentActions = useSelector(
        (state) => state.entities.paymentActions.list
    );

    const [student, setStudent] = useState({});
    const [modalShow, setModalShow] = useState(false);
    const [formTitle, setFormTitle] = useState("");
    const [progress, setProgress] = useState(0);
    const [updateFormShow, setUpdateFormShow] = useState(false);
    const [action, setAction] = useState({});

    useEffect(() => {
        if (!location.state) {
            history.goBack();
        }
        const { student } = location.state;
        setStudent(student);
        dispatch(loadPaymentActions(student.id));
    }, []);

    const cancelUploading = () => {
        setProgress(0);
        setModalShow(false);
    };

    const updatePaymentClicked = (action) => {
        setFormTitle(`تحديث قيمة الدفع`);
        setModalShow(true);
        setUpdateFormShow(true);
        setAction(action);
    };

    const updatePaymentFormSubmitted = (
        chapterId,
        userId,
        newPaymentAmount
    ) => {
        setModalShow(false);
        try {
            dispatch(updatePaymentAmount(chapterId, userId, newPaymentAmount));
            toast.success("تم تحديث القيمة بنجاح");
        } catch (ex) {
            console.log(ex);
        }
    };

    return (
        <div className="requests-page">
            <VerticalModal
                formTitle={formTitle}
                progress={progress}
                show={modalShow}
                onHide={() => {
                    cancelUploading();
                }}
            >
                {updateFormShow && (
                    <UpdatePaymentForm
                        student={student}
                        action={action}
                        submitted={updatePaymentFormSubmitted}
                    />
                )}
            </VerticalModal>
            <div className="requests-header">
                <h3>
                    <BsFillGrid3X3GapFill
                        size={"1.7rem"}
                        color="#803bec"
                        style={{
                            marginRight: "10px",
                            marginBottom: "5px",
                        }}
                    />
                    اجراءات الدفع
                </h3>
            </div>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    backgroundColor: "white",
                    marginBottom: "20px",
                    padding: "10px",
                }}
            >
                <div style={{ display: "flex" }}>
                    <div style={{ order: 1 }}>
                        <FaUserTie style={{ marginRight: "10px" }} />
                    </div>
                    <div style={{ marginRight: "5px", order: 2 }}>الطالب: </div>
                    <div style={{ order: 3, wordBreak: "break-word" }}>
                        {student.name}
                    </div>
                </div>
                <div style={{ display: "flex" }}>
                    <div style={{ order: 1 }}>
                        <IoMail style={{ marginRight: "10px" }} />
                    </div>
                    <div style={{ marginRight: "5px", order: 2 }}>البريد: </div>
                    <div style={{ order: 3, wordBreak: "break-word" }}>
                        {student.email}
                    </div>
                </div>
            </div>
            <PaymentActionsTable
                actions={paymentActions}
                updatePaymentClicked={updatePaymentClicked}
            />
            <div style={{ width: "100%", height: "200px" }}></div>
        </div>
    );
};

const PaymentActions = MotionHoc(PaymentActionsComponent);

export default PaymentActions;
