import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { NAVIGATION_ITEMS } from "@/config/navigation";
import type { AccessGroupCode } from "@/features/access/types";

import { groupFormSchema } from "../schemas/groupSchemas";
import type { GroupFormValues } from "../schemas/groupSchemas";
import type { Group, GroupInput } from "../types";

interface GroupFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group?: Group;
  onSubmit: (input: GroupInput) => void;
}

/** Cadastro de Grupos (setores da empresa). */
export function GroupFormDialog({
  open,
  onOpenChange,
  group,
  onSubmit,
}: GroupFormDialogProps) {
  const form = useForm<GroupFormValues>({
    resolver: zodResolver(groupFormSchema),
    defaultValues: {
      code: group?.code ?? "",
      name: group?.name ?? "",
      description: group?.description ?? "",
      manager: group?.manager ?? "",
      email: group?.email ?? "",
      active: group?.active ?? true,
      modules: group?.modules ?? ["dashboard"],
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      code: group?.code ?? "",
      name: group?.name ?? "",
      description: group?.description ?? "",
      manager: group?.manager ?? "",
      email: group?.email ?? "",
      active: group?.active ?? true,
      modules: group?.modules ?? ["dashboard"],
    });
  }, [open, group, form]);

  const selectedModules = (form.watch("modules") ?? []) as string[];

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit({
      code: values.code as AccessGroupCode,
      name: values.name.trim(),
      description: values.description.trim(),
      manager: values.manager.trim(),
      email: values.email.trim(),
      active: values.active,
      modules: values.modules as string[],
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{group ? "Editar grupo" : "Novo grupo"}</DialogTitle>
          <DialogDescription>
            O Grupo representa uma área da empresa e define quais módulos ficam
            disponíveis para seus usuários.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Código</FormLabel>
                    <FormControl>
                      <Input placeholder="comercial" disabled={Boolean(group)} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="Comercial" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="manager"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Responsável</FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do gestor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail do setor</FormLabel>
                    <FormControl>
                      <Input placeholder="setor@brasilab.com.br" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea rows={2} placeholder="Responsabilidades da área" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="modules"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Módulos liberados</FormLabel>
                  <FormDescription>
                    Define o escopo máximo do Grupo. Os Perfis atuam apenas dentro dele.
                  </FormDescription>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {NAVIGATION_ITEMS.map((item) => {
                      const checked = selectedModules.includes(item.slug);
                      return (
                        <label
                          key={item.slug}
                          className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(value) => {
                              const next =
                                value === true
                                  ? [...selectedModules, item.slug]
                                  : selectedModules.filter((slug) => slug !== item.slug);
                              field.onChange(next);
                            }}
                          />
                          <span className="truncate">{item.label}</span>
                        </label>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border px-3 py-2">
                  <div>
                    <FormLabel>Grupo ativo</FormLabel>
                    <FormDescription>
                      Grupos inativos não podem receber novos usuários.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">{group ? "Salvar" : "Criar grupo"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
