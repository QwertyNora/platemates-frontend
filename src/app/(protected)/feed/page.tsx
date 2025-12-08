import { auth, currentUser } from "@clerk/nextjs/server";

export default async function FeedPage() {
  const { userId } = await auth();
  const user = await currentUser();

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Your Feed</h1>
      <div className="bg-gray-100 p-4 rounded mb-8">
        <p className="text-lg">Welcome, {user?.firstName || user?.emailAddresses[0].emailAddress}!</p>
        <p className="text-sm text-gray-600">User ID: {userId}</p>
      </div>
      
      {/* TODO: Add actual feed content here */}
    </div>
  );
}
