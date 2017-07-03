export default function (n: number) {
    return n === 0 ?
        '100%' :
        'calc(100% - ' + (n + 'px') + ')'
}