import TextField from "../text-field";

export default function IntegerField({ value, onChange = () => {}, ...rest }) {
  function parse(val) {
    return val.replace(/[^0-9]/g, "");
  }

  return (
    <TextField
      value={value}
      isRtl={false}
      type="text"
      inputMode="numeric"
      pattern="[0-9]+"
      onChange={(val) => onChange(parse(val))}
      {...rest}
    />
  );
}
