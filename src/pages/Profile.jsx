import { useUser } from "../context/UserContext";

export default function Profile() {

  const { user } = useUser();

  return (
    <div className="p-4">

      <h2 className="text-xl font-bold mb-4">Profile</h2>

      <p>Username: {user.username}</p>

      <p className="mt-3 text-red-600 font-bold">
        📞 Call 9876543210 to Withdraw
      </p>

    </div>
  );
}
