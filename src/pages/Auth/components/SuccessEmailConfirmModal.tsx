import { useNavigate } from "react-router-dom";
import { Button, Logo } from "../../../shared/UI";
import { useAppDispatch } from "../../../store/hooks";
import { emailConfirmed } from "../../../store/userSlice";

import c from "./confirmEmailModal.module.scss";

const SuccessConfirmEmailModal = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const confirmHandler = () => {
    dispatch(emailConfirmed());
    navigate("/");
  };

  return (
    <div className={c.modal}>
      <div className={c.logo}>
        <Logo />
      </div>

      <div className={c.modal_body}>
        <div className={c.text_wrapper}>
          <p className={c.title}>Успешно</p>
          <p className={c.text}>
            Ваш email успешно подтвержден! Теперь вы можете воспользоваться
            всеми возможностями нашего сервиса."
          </p>
        </div>

        <Button onClick={confirmHandler}>Понятно</Button>
      </div>
    </div>
  );
};

export { SuccessConfirmEmailModal };
