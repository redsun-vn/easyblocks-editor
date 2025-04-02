/**
 *
 * @param collection Array of values
 * @param mapper Optional callback function that will be invoked for each item of given array to map it into comparable string
 */
declare function getUniqueValues<Collection extends Array<any>, Item extends Collection[number]>(collection: Collection, mapper?: (item: Item, index: number) => string | undefined): Array<Item>;
export { getUniqueValues };
//# sourceMappingURL=getUniqueValues.d.ts.map