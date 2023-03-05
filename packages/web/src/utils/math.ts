/**
 * Javascript's % is strange. This is not.
 */
export function mod(n: number, m: number): number {
    const remain = n % m
    return remain >= 0 ? remain : remain + m
}
