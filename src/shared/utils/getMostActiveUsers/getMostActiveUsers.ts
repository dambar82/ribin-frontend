import { User } from "../../../store/userSlice"

export const getMostActiveUsers = (users: User[] | undefined, quantity: number) => {
  if (users) {
    const sorted = users.slice().sort((a, b) => a.rubick - b.rubick);

    if (!sorted) return [];

    return sorted.slice(-quantity).reverse();
  }
  return [];
}