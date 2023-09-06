export const ping = async (): Promise<boolean | undefined> => {
  await new Promise((r) => setTimeout(r, 2000))

  const min = new Date().getSeconds()
  return min < 20 ? undefined : min < 40
}

export const check = async (): Promise<boolean | undefined> => {
  await new Promise((r) => setTimeout(r, 2000))

  const min = new Date().getSeconds()
  return min < 20 ? undefined : min < 40
}