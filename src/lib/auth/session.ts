import { getServerSession } from "next-auth";
import { authOptions } from "./nextAuthOptions";
export async function getSession() { return getServerSession(authOptions); }
