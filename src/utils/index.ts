export function throttle<T extends (...args: any) => any>(fn: T, timeout: number) {
  let block = false

  return function (this: any, ...args: unknown[]) {
    if (block) {
      return
    }
    block = true
    setTimeout(() => {
      fn.apply(this, args)
      block = false
    }, timeout)
  }
}

export const repeatArray = (arr: number[], count = 4): number[] => {
  const result = []
  while (count > 0) {
    result.push(...arr)
    count--
  }
  return result
}
