/**
 * Единый источник путей навигации.
 *
 * Экраны вызывают router.push(ROUTES.entry(id)), а не
 * router.push(`/entry/${id}`) россыпью по коду.
 */
export const ROUTES = {
  home: "/",
  welcome: "/welcome",
  journal: "/journal",
  forest: "/forest",
  calendar: "/calendar",
  profile: "/profile",
  profileNotifications: "/profile/notifications",
  favorites: "/favorites",
  entryNew: "/entry/new",
  entry: (id: string) => `/entry/${id}` as const,
} as const;
