import React, { useState } from "react";
import { loginUser } from "../../store/userSlice";
import { useAppDispatch } from "../../store/hooks";

const Restore = () => {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // dispatch(restorePassword({ password }));
  };

  return (
    <div className="authBlock__restore gap-26">
      <div className="authBlock__restore_text">
        <h1 className="h1_36_44">Восстановление пароля</h1>
        <p className="authBlock__paragraph">
          Укажите, пожалуйста, адрес электронной почты, который вы использовали
          при регистрации.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="authBlock__form_block  gap-46">
        <div className="authBlock__form_inputs">
          <div className="authBlock__form-group">
            <input
              placeholder="Почта"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="authBlock__input"
            />
          </div>
        </div>
        <button type="submit" className="action_button">
          Отправить запрос
        </button>
      </form>
    </div>
  );
};

export default Restore;
