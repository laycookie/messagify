import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { DiscordMessage } from "../../types/discord";
import Chat from "./MainChat";

export default function ChatController() {
  const { channelId, userChannelId } = useParams();
  const targetId = channelId ?? userChannelId;
  const [messages, setMessages] = useState<DiscordMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!targetId)
      return void (setMessages([]), setError(null), setLoading(false));
    let cancelled = false;
    setLoading(true);
    setError(null);
    invoke<string>("fetch_channel_messages", { channelId: targetId, limit: 50 })
      .then((json) => !cancelled && setMessages(JSON.parse(json) ?? []))
      .catch((e) => !cancelled && (setMessages([]), setError(String(e))))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [targetId]);

  return (
    <Chat
      channelTitle={targetId ?? "Select a channel"}
      messages={messages}
      loading={loading}
      error={error}
    />
  );
}
