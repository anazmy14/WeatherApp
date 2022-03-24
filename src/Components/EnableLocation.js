import React from "react";
import { MdWrongLocation } from "react-icons/md";
export default function EnableLocation() {
  return (
    <div className="enable-location">
      <MdWrongLocation fontSize={100} />
      <h3>Please Enable the Location in your Browser then Refresh the Page</h3>
    </div>
  );
}
