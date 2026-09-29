import { EditorHistory, HistoryEntry } from "./EditorHistory";

/** A history entry whose config is just a span, which is all these cases vary. */
function entry(span: string): HistoryEntry {
  return {
    focussedField: ["data.0.Cells.0"],
    config: { _id: "root", _component: "Root", span } as any,
  };
}

describe("EditorHistory, as a resize drag uses it", () => {
  test("a drag through several values is one undo step", () => {
    const history = new EditorHistory();
    history.push(entry("1"));

    // First value the edge reaches makes the step; the rest fold into it.
    history.push(entry("2"));
    history.replace(entry("3"));
    history.replace(entry("4"));

    expect((history.back()?.config as any).span).toBe("1");
    expect(history.back()).toBeNull();
  });

  test("Esc putting the value back leaves nothing to undo into", () => {
    const history = new EditorHistory();
    history.push(entry("1"));
    history.push(entry("2"));
    history.replace(entry("1"));

    // The leftover step equals the one before it, and back() skips equals.
    expect(history.back()).toBeNull();
  });

  test("a later change after a drag keeps both steps", () => {
    const history = new EditorHistory();
    history.push(entry("1"));
    history.push(entry("2"));
    history.replace(entry("3"));
    history.push(entry("3-recoloured"));

    expect((history.back()?.config as any).span).toBe("3");
    expect((history.back()?.config as any).span).toBe("1");
  });
});
