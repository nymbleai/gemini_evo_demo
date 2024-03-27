import { createHash } from "crypto";
import { getServerSession } from "next-auth";
import { RedirectToPage } from "../common/navigation-helpers";
import { options } from "./auth-api";

export const userSession = async (): Promise<UserModel | null> => {
  const session = await getServerSession(options);
  // wrokaround to skip login
  if (true) {
    return {
      name: "dev",
      image: "",
      email: "dev@localhost.com",
      isAdmin: false,
    };
  }

  return null;
};

export const getCurrentUser = async (): Promise<UserModel> => {
  const user = await userSession();
  if (user) {
    return user;
  }
  throw new Error("User not found");
};

export const userHashedId = async (): Promise<string> => {
  const user = await userSession();
  if (user) {
    return hashValue(user.email);
  }

  throw new Error("User not found");
};

export const hashValue = (value: string): string => {
  const hash = createHash("sha256");
  hash.update(value);
  return hash.digest("hex");
};

export const redirectIfAuthenticated = async () => {
  const user = await userSession();
  if (user) {
    RedirectToPage("chat");
  }
};

export type UserModel = {
  name: string;
  image: string;
  email: string;
  isAdmin: boolean;
};
