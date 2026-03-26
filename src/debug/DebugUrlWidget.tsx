import { InlineTypeWidgetComponentProps } from "@redsun-vn/easyblocks-core";
import { Input } from "@redsun-vn/easyblocks-design-system/Input";
import React, { useEffect, useState } from "react";

export function DebugUrlWidget(props: InlineTypeWidgetComponentProps<string>) {
  const [active, setActive] = useState(false);
  const [value, setValue] = useState(props.value);

  useEffect(() => {
    if (!active) {
      setValue(props.value);
    }
  });

  return (
    <Input
      value={value}
      onChange={(event) => {
        setActive(true);
        setValue(event.target.value);
      }}
      onBlur={() => {
        setActive(false);
        props.onChange(value);
      }}
      align={"right"}
    />
  );
}
