import { invoke } from "@tauri-apps/api/core";
import { useEffect, useState } from "react";
import { Channel, ChannelType } from "../../../types/discord";
import { useNavigate, useParams } from "react-router-dom";

const GuildChannelBar = () => {
  function openChannel(channelId: string) {
    if (!guildId) return;
    navigate(`/discord/guild/${guildId}/${channelId}`);
  }

  const [channels, setChannels] = useState<Channel[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set()
  );
  const { guildId, channelId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!guildId) {
      return;
    }
    invoke<string>("fetch_guild_channels", { guildId: guildId })
      .then((json) => {
        const parsed = JSON.parse(json) as Channel[];
        setChannels(parsed ?? []);
        // Expand all categories by default
        const categories = parsed.filter(
          (c) => c.type === ChannelType.GUILD_CATEGORY
        );
        setExpandedCategories(new Set(categories.map((c) => c.id)));
      })
      .catch((e) => {
        console.error("Failed to fetch guild channels:", e);
        setChannels([]);
      });
  }, [guildId]);

  // Separate categories from regular channels in a single pass
  const categories: Channel[] = [];
  const regularChannels: Channel[] = [];
  for (const c of channels) {
    (c.type === ChannelType.GUILD_CATEGORY ? categories : regularChannels).push(
      c
    );
  }
  categories.sort((a, b) => a.position - b.position);

  // Group channels by parent_id
  const channelsByCategory = new Map<string, Channel[]>();
  for (const channel of regularChannels) {
    const parentId = channel.parent_id ?? "__uncategorized__";
    const list = channelsByCategory.get(parentId) ?? [];
    list.push(channel);
    channelsByCategory.set(parentId, list);
  }

  // Sort channels within each category by position
 

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const renderChannel = (channel: Channel) => {
    const isSelected = channelId === channel.id;
    return (
      <div
        key={channel.id}
        className={[
          "px-2 py-1 rounded cursor-pointer flex items-center",
          isSelected
            ? "bg-gray-700 text-white"
            : "hover:bg-gray-700/50 text-gray-300",
        ].join(" ")}
        onClick={() => openChannel(channel.id)}
      >
        <span className="mr-1.5">#</span>
        <span className="font-medium text-gray-300">{channel.name}</span>
      </div>
    );
  };

  const renderCategory = (category: Channel) => {
    const children = channelsByCategory.get(category.id) ?? [];
    const isExpanded = expandedCategories.has(category.id);

    if (children.length === 0) return null;

    return (
      <div key={category.id} className="mb-1">
        {/* Category Header (clickable to toggle) */}
        <div
          className="px-2 py-1 flex items-center cursor-pointer hover:bg-gray-700/30 rounded select-none"
          onClick={() => toggleCategory(category.id)}
        >
          {/* Chevron icon */}
          <svg
            className={`w-3 h-3 mr-1 text-gray-400 transition-transform ${
              isExpanded ? "rotate-90" : ""
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-xs font-semibold text-gray-400 uppercase">
            {category.name}
          </span>
        </div>

        {/* Category Children (collapsible) */}
        {isExpanded && (
          <div className="ml-2 mt-1 space-y-1">
            {children.map(renderChannel)}
          </div>
        )}
      </div>
    );
  };

  // Uncategorized channels (sorted by position)
  const uncategorized = (
    channelsByCategory.get("__uncategorized__") ?? []
  ).sort((a, b) => a.position - b.position);

  return (
    <>
      {/* Server Header */}
      <div className="h-12 border-b border-gray-900 px-4 flex items-center shadow-sm">
        <h2 className="font-semibold text-white">Messagify</h2>
      </div>

      {/* Channels List */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        {/* Uncategorized channels */}
        {uncategorized.length > 0 && (
          <div className="mb-2">
            <div className="space-y-1">{uncategorized.map(renderChannel)}</div>
          </div>
        )}

        {/* Categorized channels */}
        {categories.map(renderCategory)}
      </div>
    </>
  );
};

export default GuildChannelBar;
