import { createFileRoute, Link } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { ArrowLeft, Loader2, MailCheck } from "lucide-react";

import { BrasilabLogo } from "@/components/brand/BrasilabLogo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import {
  passwordRecoverySchema,
  type PasswordRecoveryFormValues,
} from "@/features/auth/schemas/authSchemas";
import { requestPasswordRecovery } from "@/features/auth/services/authService";

export const Route = createFileRoute("/recuperar-senha")({
  head: () => ({
    meta: [
      { title: "Recuperar senha · Brasilab Intranet Lab" },
      {
        name: "description",
        content:
          "Solicite a redefinição da senha de acesso à intranet corporativa da Brasilab.",
      },
      { property: "og:title", content: "Recuperar senha · Brasilab Intranet Lab" },
      {
        property: "og:description",
        content: "Solicite a redefinição da senha de acesso à intranet da Brasilab.",
      },
    ],
  }),
  component: PasswordRecoveryPage,
});

function PasswordRecoveryPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<PasswordRecoveryFormValues>({
    resolver: zodResolver(passwordRecoverySchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: PasswordRecoveryFormValues) {
    setSubmitting(true);
    await requestPasswordRecovery(values.email);
    setSubmitting(false);
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <BrasilabLogo className="h-9" />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">Recuperar senha</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Informe seu e-mail corporativo para receber as instruções de redefinição.
        </p>

        <Card className="mt-6 shadow-card">
          <CardContent className="pt-6">
            {sent ? (
              <Alert>
                <MailCheck className="h-4 w-4" />
                <AlertTitle>Solicitação registrada</AlertTitle>
                <AlertDescription>
                  Caso o e-mail informado pertença a um usuário ativo, as instruções serão
                  enviadas. O envio real será habilitado junto do módulo de Autenticação.
                </AlertDescription>
              </Alert>
            ) : (
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
                  <Button type="submit" className="w-full" disabled={submitting}>
                    {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Enviar instruções
                  </Button>
                </form>
              </Form>
            )}

            <div className="mt-4 text-center">
              <Link
                to="/entrar"
                className="inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Voltar para o login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
