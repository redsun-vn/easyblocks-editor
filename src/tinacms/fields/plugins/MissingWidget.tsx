import { Typography } from "@redsun-vn/easyblocks-design-system/Typography";
import React from "react";

export function MissingWidget(props: { type: string }) {
  return <Typography>Missing widget for type "{props.type}".</Typography>;
}
