import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Loader2, LockKeyhole, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { BrasilabLogo } from "@/components/brand/BrasilabLogo";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas/authSchemas";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const Route = createFileRoute("/entrar")({
  head: () => ({
    meta: [
      { title: "Entrar · Brasilab Intranet Lab" },
      {
        name: "description",
        content:
          "Acesso restrito à intranet corporativa da Brasilab. Informe suas credenciais para continuar.",
      },
      { property: "og:title", content: "Entrar · Brasilab Intranet Lab" },
      {
        property: "og:description",
        content: "Acesso restrito à intranet corporativa da Brasilab.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthenticated, isReady } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (isReady && isAuthenticated) {
      navigate({ to: "/dashboard", replace: true });
    }
  }, [isReady, isAuthenticated, navigate]);

  async function onSubmit(values: LoginFormValues) {
    setSubmitting(true);
    try {
      await login(values);
      toast.success("Bem-vindo à Brasilab Intranet Lab");
      navigate({ to: "/dashboard", replace: true });
    } catch {
      toast.error("E-mail ou senha inválidos.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="bg-gradient-brand relative hidden flex-col items-center justify-center p-12 text-center text-brand-foreground lg:flex xl:p-16">
        <div className="flex max-w-md flex-col items-center">
          <BrasilabLogo variant="white" className="h-12 w-auto xl:h-16" />
          <h2 className="mt-10 text-3xl font-semibold tracking-tight xl:mt-12 xl:text-4xl">
            Intranet corporativa da Brasilab
          </h2>
          <p className="mt-4 text-sm/6 opacity-90 xl:text-base/7">
            Uma plataforma única para conduzir o processo comercial, a produção, as
            compras, a logística e o financeiro com organização e rastreabilidade.
          </p>
        </div>
        <p className="absolute inset-x-12 bottom-10 flex items-center justify-center gap-2 text-xs opacity-80 xl:inset-x-16">
          <ShieldCheck className="h-4 w-4 shrink-0" />
          Ambiente interno · Informações confidenciais
        </p>
      </div>



      <div className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center gap-4 lg:hidden">
            <BrasilabLogo className="h-9" />
          </div>

          <h1 className="text-2xl font-semibold tracking-tight">Acessar a plataforma</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Informe suas credenciais corporativas para continuar.
          </p>

          <Card className="mt-6 shadow-card">
            <CardContent className="pt-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail corporativo</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            autoComplete="email"
                            placeholder="nome@brasilab.com.br"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            autoComplete="current-password"
                            placeholder="••••••••"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <LockKeyhole className="mr-2 h-4 w-4" />
                    )}
                    Entrar
                  </Button>
                </form>
              </Form>

              <div className="mt-4 text-center">
                <Link
                  to="/recuperar-senha"
                  className="text-sm text-primary underline-offset-4 hover:underline"
                >
                  Esqueci minha senha
                </Link>
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Acesso restrito · somente usuários autorizados podem entrar na plataforma.
          </p>
        </div>
      </div>
    </div>
  );
}
