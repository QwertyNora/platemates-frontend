import { auth, currentUser } from "@clerk/nextjs/server";

export default async function FeedPage() {
  const { userId } = await auth();
  const user = await currentUser();

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to your Feed!</h1>
      <p className="text-xl">Logged in as: {user?.emailAddresses[0].emailAddress}</p>
      <p className="text-gray-600">User ID: {userId}</p>
      
      {/* TODO: Add feed content here */}
    </div>
  );
}