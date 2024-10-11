export function areaFormatter(area) {
    if (area >= 1000000) {
        return `${(area / 1000000).toFixed(0)} Millions`;
    } else {
        return `${(area / 1000).toFixed(0)} Thousands`;
    }
}