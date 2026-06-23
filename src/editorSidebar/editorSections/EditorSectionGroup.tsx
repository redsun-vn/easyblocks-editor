import { Typography } from "@redsun-vn/easyblocks-design-system/Typography";
import React from "react";
import { useTranslation } from "../../useTranslation";
import { EditorSectionItem } from "./EditorSectionItem";
import { EditorSectionsSkeleton } from "./EditorSectionsSkeleton";

export const EditorSectionGroup = ({
  sectionGroups,
  isFetchingRemoteGroup,
  hoveredSection,
  onHoverSection,
}: {
  hoveredSection: string;
  sectionGroups: string[];
  onHoverSection: (id: string) => void;
  isFetchingRemoteGroup?: boolean;
}) => {
  const { t } = useTranslation();

  // The group list loads once from the count API; show the skeleton until then.
  if (isFetchingRemoteGroup) {
    return <EditorSectionsSkeleton />;
  }

  return sectionGroups.length ? (
    sectionGroups.map((currentSectionGroup) => (
      <EditorSectionItem
        key={currentSectionGroup}
        id={currentSectionGroup}
        name={currentSectionGroup}
        hovered={hoveredSection === currentSectionGroup}
        onHoverSection={onHoverSection}
      />
    ))
  ) : (
    <Typography variant="body" style={{ paddingLeft: 4 }}>
      {t("noData")}!
    </Typography>
  );
};
