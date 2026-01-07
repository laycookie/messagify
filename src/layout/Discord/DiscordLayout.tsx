import Guild from "../../components/Discord/GuildBar";
import ChannelBarController from "../../components/Discord/ChannelBar/ChannelBarController";
import MembersBar from "../../components/Discord/Members";
import ChatController from "../../components/Discord/MainChatController";
import { DiscordEventListener } from "../../hooks/useDiscordEvents";
import { Outlet } from "react-router-dom";

function DiscordLayout() {
  return (
    <div className="flex h-screen w-screen bg-gray-800 text-gray-100">
      {/* Gateway event listener - listens to WebSocket events and updates store */}
      <DiscordEventListener />

      {/* Guild Bar */}
      <Guild />

      <Outlet />

      {/* Members Sidebar */}
      <MembersBar />
    </div>
  );
}

export default DiscordLayout;
