import { useTranslation } from "../../useTranslation";

/**
 * The name shown for one item in a picker.
 *
 * A template's `label` is written in the definition, in English, and there are
 * more than a hundred of them across an app. Turning each into a translation
 * key would mean editing every definition and would leave an app's frozen set
 * with keys nobody is going to translate. So the id is the key and the written
 * label is the fallback: an item with a translation shows it, one without reads
 * exactly as before.
 *
 * A component with no template of its own gets one built for it, under the id
 * `<component>_default` (see `templates/getTemplates.ts`). The name belongs to
 * the component, so that suffix comes off before the lookup.
 */
export const usePickerItemLabel = () => {
  const { t } = useTranslation();

  return (id: string | undefined, written: string | undefined) => {
    if (!id) {
      return written;
    }

    for (const candidate of [id, id.replace(/_default$/, "")]) {
      const key = `picker.item.${candidate}`;
      const translated = t(key);

      if (translated !== key) {
        return translated;
      }
    }

    return written;
  };
};
