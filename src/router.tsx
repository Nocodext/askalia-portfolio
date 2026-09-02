import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    // We handle every internal #anchor jump ourselves (scrollToCase) with a
    // fixed header-clearance offset. The router's own default hash handling
    // calls element.scrollIntoView() with no offset, which runs after our
    // corrected scroll and overrides it, landing the sticky header on top of
    // the card instead of above it.
    defaultHashScrollIntoView: false,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
