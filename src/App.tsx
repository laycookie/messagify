import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChannelBarController from "./components/Discord/ChannelBar/ChannelBarController";
import ChatController from "./components/Discord/MainChatController";

// Lazy load components
const Login = lazy(() => import("./pages/Login"));
const DiscordLayout = lazy(() => import("./layout/Discord/DiscordLayout"));
const Accounts = lazy(() => import("./pages/Accounts"));
// Loading fallback component
function LoadingFallback() {
  return (
    <div style={{ padding: "20px", textAlign: "center" }}>
      <p>Loading...</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Accounts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/discord" element={<DiscordLayout />}>
            <Route
              path="/discord/user/:userChannelId?"
              element={
                <>
                  <ChannelBarController />
                  <ChatController />
                </>
              }
            />
            <Route
              path="/discord/guild/:guildId?/:channelId?"
              element={
                <>
                  <ChannelBarController />
                  <ChatController />
                </>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
export default App;
