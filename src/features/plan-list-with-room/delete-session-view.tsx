import React, { useState } from "react";
import { useLanguage } from "~/context/language.context";

import Button from "~/ui/buttons";
import ButtonCheckbox from "~/ui/forms/checkbox/checkbox";
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
  const deletePlan = api.plan.deletePlan.useMutation({
    onSuccess: () => {
      utils.plan.getPlansByDate.invalidate();
    },
  });
  const [notifyUsers, setNotifyUsers] = useState(false);
  return (
    <>
      <DeleteSessionButtonWithModal
        center
        title={t.delete + " " + t.session}
        size={"sm"}
        className="bg-secondary"
        render={(closeModal) => {
          return (
            <div className=" flex flex-col items-center justify-center gap-2 py-5">
              <ButtonCheckbox
                checked={notifyUsers}
                onClick={() => {
                  setNotifyUsers((prev) => !prev);
                }}
                text={t.NotifyUsers}
              />

              <Button
                disabled={deletePlan.isLoading}
                isLoading={deletePlan.isLoading}
                onClick={async () => {
                  try {
                    await deletePlan.mutateAsync({
                      id,
                      send_email: notifyUsers,
                    });
                    closeModal();
                  } catch {}
                }}
                className="bg-amber-500 text-black"
              >
                {/* {plan.status === "AlreadyStarted" ? "اتمام جلسه" : "لغو جلسه"} */}
                {t.delete + " " + t.session}
              </Button>
            </div>
          );
        }}
      >
        {t.delete + " " + t.session}
      </DeleteSessionButtonWithModal>
    </>
  );
}
