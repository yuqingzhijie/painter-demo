export function throttle<T extends (...args: any) => any>(fn: T, timeout: number) {
  let block = false
  let timer = NaN as unknown

  const afterExecuted = (): void => {
    block = true
    setTimeout(() => (block = false), timeout)
  }

  return function (this: unknown, ...args: unknown[]) {
    clearTimeout(timer as number)
    if (block === false) {
      fn.apply(this, args)
      afterExecuted()
    } else {
      timer = setTimeout(() => {
        fn.apply(this, args)
        afterExecuted()
      }, timeout)
    }
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
