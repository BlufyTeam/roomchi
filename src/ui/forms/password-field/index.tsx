import React, { useState } from "react";
import TextField from "~/ui/forms/text-field";
import withLabel from "~/ui/forms/with-label";
import Button from "~/ui/buttons";
import { ClosedEyeIcon, OpenEyeIcon } from "~/ui/icons/eyes";

const TextFieldWithLable = withLabel(TextField);

export default function PasswordField({ fieldDisabled = false, ...rest }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="flex  items-center justify-center gap-2">
      <TextFieldWithLable
        className="disabled:cursor-not-allowed"
        disabled={fieldDisabled}
        {...rest}
        type={isOpen ? "text" : "password"}
      />
      {!fieldDisabled && (
        <Button
          className="rounded-full bg-primbuttn fill-secbuttn p-1 "
          onClick={() => setIsOpen((value) => !value)}
        >
          {isOpen ? <OpenEyeIcon /> : <ClosedEyeIcon />}
        </Button>
      )}
    </div>
  );
}
