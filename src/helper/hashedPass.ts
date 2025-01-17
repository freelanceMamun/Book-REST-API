import bcrypt from "bcrypt";

export default async function hashPassword(
  data: string | Buffer,
  saltOrRounds: string | number
): Promise<string> {
  const dataString = data.toString();
  return await bcrypt.hash(dataString, saltOrRounds);
}

export async function comparePassword(
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(plainTextPassword, hashedPassword);
}
