import { Colors } from "@redsun-vn/easyblocks-design-system";
import { Icons } from "@redsun-vn/easyblocks-design-system/icons";
import { Typography } from "@redsun-vn/easyblocks-design-system/Typography";
import React, { Fragment } from "react";
import { styled } from "styled-components";
import { useEditorContext } from "../EditorContext";
import { useTranslation } from "../useTranslation";
import { getSelectionBreadcrumb } from "../utils/selection/canvasSelectionPaths";

// Fixed height, rendered even without a selection, so selecting never resizes the canvas.
const BreadcrumbBar = styled.nav`
  flex: 0 0 36px;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 0 12px;
  overflow-x: auto;
  border-top: 1px solid ${Colors.black10};
  background: ${Colors.white};
  white-space: nowrap;
`;

const Crumb = styled.button`
  flex-shrink: 0;
  padding: 2px 6px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;

  &:hover {
    background: ${Colors.black10};
  }
`;

const CrumbLabel = styled(Typography)<{ $isCurrent: boolean }>`
  cursor: pointer;
  font-weight: ${({ $isCurrent }) => ($isCurrent ? 700 : 400)};
`;

/**
 * Strip under the canvas with the selection's framed ancestors, outermost first. Lets
 * users reach containers that their children cover on the canvas.
 */
function SelectionBreadcrumb() {
  const editorContext = useEditorContext();
  const { t } = useTranslation();
  const { focussedField, setFocussedField } = editorContext;
  const crumbs =
    focussedField.length === 1
      ? getSelectionBreadcrumb(focussedField[0], editorContext, t)
      : [];

  return (
    <BreadcrumbBar aria-label={t("selectionBreadcrumb")}>
      {crumbs.map((crumb, index) => {
        const isCurrent = index === crumbs.length - 1;

        return (
          <Fragment key={crumb.path}>
            {index > 0 && <Icons.ChevronRight size={14} />}
            <Crumb
              type="button"
              aria-current={isCurrent ? "location" : undefined}
              onClick={() => setFocussedField(crumb.path)}
            >
              <CrumbLabel $isCurrent={isCurrent} variant="body" component="span">
                {crumb.label}
              </CrumbLabel>
            </Crumb>
          </Fragment>
        );
      })}
    </BreadcrumbBar>
  );
}

export { SelectionBreadcrumb };
