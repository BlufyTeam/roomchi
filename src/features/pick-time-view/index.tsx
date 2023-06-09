import React, { useState } from "react";
import { TimePicker } from "react-ios-time-picker";
export default function PickTimeView() {
  const [value, setValue] = useState("10:00");

  const onChange = (timeValue) => {
    setValue(timeValue);
  };

  return (
    <div>
      <TimePicker onChange={onChange} value={value} className="bg-black" />
    </div>
  );
}
