import React, { useState } from "react";
import { useLanguage } from "~/context/language.context";

import Button from "~/ui/buttons";
import ButtonCheckbox from "~/ui/forms/checkbox/checkbox";
import Modal from "~/ui/modals";
import withModalState from "~/ui/modals/with-modal-state";
import { api } from "~/utils/api";
import { translations } from "~/utils/translations";

function DeleteSessionButton({ children, ...rest }) {
  return (
    <Button {...rest} className="bg-amber-500 text-black">
      {children}
    </Button>
  );
}

const DeleteSessionButtonWithModal = withModalState(DeleteSessionButton);
export function DeleteSession({ id }) {
  const { language } = useLanguage();
  const t = translations[language];
  const utils = api.useContext();
  const [notifyUsers, setNotifyUsers] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const deletePlanMutate = api.plan.deletePlan.useMutation({
    onSuccess: () => {
      utils.plan.getPlansByDate.invalidate();
      utils.plan.getPlans.invalidate();
      setIsOpen(false);
    },
  });

  function deletePlan() {
    deletePlanMutate.mutate({
      id,
      send_email: notifyUsers,
    });
  }
  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-amber-500 text-black"
      >
        {t.delete + " " + t.session}
      </Button>
      <Modal
        center
        isOpen={isOpen}
        title={t.delete + " " + t.session}
        size={"sm"}
        className="bg-secondary"
      >
        <div className=" flex flex-col items-center justify-center gap-2 py-5">
          <ButtonCheckbox
            checked={notifyUsers}
            onClick={() => {
              setNotifyUsers((prev) => !prev);
            }}
            text={t.NotifyUsers}
          />

          <Button
            isLoading={deletePlanMutate.isLoading}
            onClick={() => {
              deletePlan();
            }}
            className="bg-amber-500 text-black"
          >
            {/* {plan.status === "AlreadyStarted" ? "اتمام جلسه" : "لغو جلسه"} */}
            {t.delete + " " + t.session}
          </Button>
        </div>
      </Modal>
    </>
  );
}
