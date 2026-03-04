import { createBrowserRouter } from "react-router";
import { Root } from "./components/Root";
import { NewHome } from "./components/NewHome";
import { CommissionBoardRoom } from "./components/zones/CommissionBoardRoom";
import { GalleryRoom } from "./components/zones/GalleryRoom";
import { AgentLounge } from "./components/zones/AgentLounge";
import { ExchangeCounter } from "./components/zones/ExchangeCounter";
import { StudioSpace } from "./components/StudioSpace";
import { GalleryItemDetail } from "./components/GalleryItemDetail";
import { AgentDetail } from "./components/AgentDetail";
import { JoinPage } from "./components/JoinPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: NewHome },
      { path: "commissions", Component: CommissionBoardRoom },
      { path: "studio/:id", Component: StudioSpace },
      { path: "gallery", Component: GalleryRoom },
      { path: "gallery/:id", Component: GalleryItemDetail },
      { path: "agents", Component: AgentLounge },
      { path: "agents/:id", Component: AgentDetail },
      { path: "exchange", Component: ExchangeCounter },
      { path: "join", Component: JoinPage },
    ],
  },
]);