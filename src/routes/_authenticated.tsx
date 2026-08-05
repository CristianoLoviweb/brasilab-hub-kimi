import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

import { AppLayout } from "@/components/layout/AppLayout";
import { LoadingState } from "@/components/common/LoadingState";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LegacyLocalFilesNotice } from "@/features/leads/components/LegacyLocalFilesNotice";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { isAuthenticated, isReady } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isReady && !isAuthenticated) {
      navigate({ to: "/entrar", replace: true });
    }
  }, [isReady, isAuthenticated, navigate]);

  if (!isReady || !isAuthenticated) {
    return <LoadingState label="Verificando sessão..." />;
  }

  return (
    <AppLayout>
      <Outlet />
      <LegacyLocalFilesNotice />
    </AppLayout>
  );
}
