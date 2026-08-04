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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ACCESS_GROUP_LIST } from "@/features/access/config/accessGroups";
import type { AccessGroupCode } from "@/features/access/types";
import { SPECIAL_PERMISSIONS } from "@/features/permissions/config/specialPermissions";
import type { SpecialPermissionCode } from "@/features/permissions/types";

import { profileFormSchema } from "../schemas/profileSchemas";
import type { ProfileFormValues } from "../schemas/profileSchemas";
import { PROFILE_LEVEL_LABELS } from "../types";
import type { Profile, ProfileInput } from "../types";

interface ProfileFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile?: Profile;
  onSubmit: (input: ProfileInput) => void;
}

/** Cadastro de Perfis (funções exercidas dentro de um Grupo). */
export function ProfileFormDialog({
  open,
  onOpenChange,
  profile,
  onSubmit,
}: ProfileFormDialogProps) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profile?.name ?? "",
      description: profile?.description ?? "",
      groupCode: profile?.groupCode ?? "comercial",
      level: profile?.level ?? 1,
      active: profile?.active ?? true,
      specialPermissions: profile?.specialPermissions ?? [],
    },
  });

  useEffect(() => {
    if (!open) return;
    form.reset({
      name: profile?.name ?? "",
      description: profile?.description ?? "",
      groupCode: profile?.groupCode ?? "comercial",
      level: profile?.level ?? 1,
      active: profile?.active ?? true,
      specialPermissions: profile?.specialPermissions ?? [],
    });
  }, [open, profile, form]);

  const selectedSpecial = (form.watch("specialPermissions") ?? []) as string[];

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit({
      name: values.name.trim(),
      description: values.description.trim(),
      groupCode: values.groupCode as AccessGroupCode,
      level: Number(values.level) as ProfileInput["level"],
      active: values.active,
      specialPermissions: (values.specialPermissions ?? []) as SpecialPermissionCode[],
    });
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{profile ? "Editar perfil" : "Novo perfil"}</DialogTitle>
          <DialogDescription>
            O Perfil representa a função exercida dentro do Grupo e define o nível de
            atuação do usuário.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do perfil</FormLabel>
                    <FormControl>
                      <Input placeholder="Vendedor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="groupCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Grupo</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o grupo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ACCESS_GROUP_LIST.map((group) => (
                          <SelectItem key={group.code} value={group.code}>
                            {group.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nível hierárquico</FormLabel>
                    <Select
                      value={String(field.value)}
                      onValueChange={(next) => field.onChange(Number(next))}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o nível" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(PROFILE_LEVEL_LABELS).map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {value} · {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Textarea rows={2} placeholder="Atribuições da função" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialPermissions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Permissões especiais</FormLabel>
                  <FormDescription>
                    Operações críticas autorizadas para este Perfil.
                  </FormDescription>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {SPECIAL_PERMISSIONS.map((permission) => {
                      const checked = selectedSpecial.includes(permission.code);
                      return (
                        <label
                          key={permission.code}
                          className="flex cursor-pointer items-start gap-2 rounded-lg border px-3 py-2 text-sm"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(value) => {
                              const next =
                                value === true
                                  ? [...selectedSpecial, permission.code]
                                  : selectedSpecial.filter(
                                      (code) => code !== permission.code,
                                    );
                              field.onChange(next);
                            }}
                          />
                          <span className="min-w-0 truncate">{permission.label}</span>
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
                    <FormLabel>Perfil ativo</FormLabel>
                    <FormDescription>
                      Perfis inativos não podem ser atribuídos a usuários.
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
              <Button type="submit">{profile ? "Salvar" : "Criar perfil"}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
