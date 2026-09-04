import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/currencies")({
  component: CurrenciesLayout,
});

function CurrenciesLayout() {
  return <Outlet />;
}
