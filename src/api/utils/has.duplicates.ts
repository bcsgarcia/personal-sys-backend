export function hasDuplicates(arr: any[]): boolean {
    const set = new Set(arr);
    return arr.length !== set.size;
}