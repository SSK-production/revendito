import Pusher from "pusher";

// Configuration de Pusher
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

// Exemple de méthode pour déclencher un événement
export async function POST(req: Request) {
  const { message, username } = await req.json();

  await pusher.trigger("chat-channel", "new-message", {
    username,
    message,
  });

  return new Response(JSON.stringify({ status: "success" }), { status: 200 });
}


