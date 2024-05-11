export async function verifyHashedPassword(
  password: string,
  hashedPassword: string
) {
  return (await hashPassword(password)) === hashedPassword
}

export async function hashPassword(password: string) {
  return Buffer.from(
    await crypto.subtle.digest("SHA-512", Buffer.from(password))
  ).toString("base64")
}
