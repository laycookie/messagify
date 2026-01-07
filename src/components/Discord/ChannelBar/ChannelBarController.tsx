import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DmChannelBar from "./DmChannelBar";
import GuildChannelBar from "./GuildChannelBar";

const ChannelBarController = () => {
  const { guildId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!guildId) {
      navigate("/discord/user", { replace: true });
    }
  }, [guildId]);

  return (
    <div className="w-60 bg-gray-800 flex flex-col">
        {guildId ? <GuildChannelBar/> : <DmChannelBar/>}
    </div>
  );
};

export default ChannelBarController;
