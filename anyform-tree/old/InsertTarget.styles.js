import React from "react";

const NormalStyles = {
  insertTarget: {
    boxSizing: "border-box",
    width: "100%",
    height: "0.2em",
    position: "absolute",
    zIndex: 1,
    display: "none",
  },
  insertBeforeTarget: {
    top: "-0.1em",
  },
  insertAfterTarget: {
    bottom: "-0.1em",
  },
  insertTargetCanDrop: {
    display: "flex",
  },
  insertTargetDropping: {
  },
  insertTargetMarkerDropping: {
    boxSizing: "border-box",
    width: "100%",
    height: "3px",
    borderRadius: "2px",
    background: "linear-gradient(90deg, gray, white)",
    alignSelf: "center",
  }
};

export const Styles = {
  insertBeforeTarget: Object.assign(
    {},
    NormalStyles.insertTarget,
    NormalStyles.insertBeforeTarget
  ),
  insertAfterTarget: Object.assign(
    {},
    NormalStyles.insertTarget,
    NormalStyles.insertAfterTarget
  ),
  insertTargetCanDrop: Object.assign(
    {},
    NormalStyles.insertTargetCanDrop
  ),
  insertTargetDropping: Object.assign(
    {},
    NormalStyles.insertTargetDropping
  ),
  insertTargetMarkerDropping: NormalStyles.insertTargetMarkerDropping
};
