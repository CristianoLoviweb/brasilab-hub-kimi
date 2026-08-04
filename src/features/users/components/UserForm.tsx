import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { ACCESS_GROUP_LIST } from "@/features/access/config/accessGroups";
import type { AccessGroupCode } from "@/features/access/types";
import { SPECIAL_PERMISSIONS } from "@/features/permissions/config/specialPermissions";
import type { SpecialPermissionCode } from "@/features/permissions/types";
import { MOCK_PROFILES } from "@/features/profiles/data/mockProfiles";
import { userFormSchema } from "../schemas/userSchemas";
import type { UserFormValues } from "../schemas/userSchemas";
import { USER_STATUS_LABELS } from "../types";
import type { User, UserInput, UserStatus } from "../types";

interface UserFormProps {
  user?: User;
  submitting?: boolean;
  onSubmit: (input: UserInput) => void;
  onCancel: () => void;
}

/** Formulário único de criação e edição de usuários. */
export function UserForm({ user, submitting, onSubmit, onCancel }: UserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: user?.name ?? "",
      email: user?.email ?? "",
      phone: user?.phone ?? "",
      registration: user?.registration ?? "",
      position: user?.position ?? "",
      groupCode: user?.groupCode ?? "comercial",
      profileId: user?.profileId ?? "",
      status: user?.status ?? "ativo",
      notes: user?.notes ?? "",
      specialPermissions: user?.specialPermissions ?? [],
    },
  });

  const groupCode = form.watch("groupCode");
  const profiles = MOCK_PROFILES.filter((profile) => profile.groupCode === groupCode);
  const selectedSpecial = (form.watch("specialPermissions") ?? []) as string[];

  const handleSubmit = form.handleSubmit((values) => {
    const notes = values.notes?.trim();
    onSubmit({
      name: values.name.trim(),
      email: values.email.trim(),
      phone: values.phone?.trim() ?? "",
      registration: values.registration.trim(),
      position: values.position.trim(),
      groupCode: values.groupCode as AccessGroupCode,
      profileId: values.profileId,
      status: values.status as UserStatus,
      specialPermissions: (values.specialPermissions ?? []) as SpecialPermissionCode[],
      ...(notes ? { notes } : {}),
    });
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do colaborador" {...field} />
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
                <FormLabel>E-mail corporativo</FormLabel>
                <FormControl>
                  <Input placeholder="nome@brasilab.com.br" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="registration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Matrícula</FormLabel>
                <FormControl>
                  <Input placeholder="BRL-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input placeholder="(00) 00000-0000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cargo</FormLabel>
                <FormControl>
                  <Input placeholder="Cargo exercido" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Situação</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(USER_STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
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
            name="groupCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grupo (setor)</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(next) => {
                    field.onChange(next);
                    form.setValue("profileId", "");
                  }}
                >
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
            name="profileId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Perfil (função)</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o perfil" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {profiles.map((profile) => (
                      <SelectItem key={profile.id} value={profile.id}>
                        {profile.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  O Perfil define as permissões dentro do Grupo selecionado.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea rows={3} placeholder="Informações internas" {...field} />
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
                Concessões individuais para operações críticas. Nunca liberam módulos não
                autorizados ao Grupo.
              </FormDescription>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {SPECIAL_PERMISSIONS.map((permission) => {
                  const checked = selectedSpecial.includes(permission.code);
                  return (
                    <label
                      key={permission.code}
                      className="flex cursor-pointer items-start gap-2 rounded-lg border p-3 text-sm"
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={(value) => {
                          const next = value === true
                            ? [...selectedSpecial, permission.code]
                            : selectedSpecial.filter((code) => code !== permission.code);
                          field.onChange(next);
                        }}
                      />
                      <span className="min-w-0">
                        <span className="block font-medium">{permission.label}</span>
                        <span className="block text-xs text-muted-foreground">
                          {permission.description}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-wrap justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {user ? "Salvar alterações" : "Cadastrar usuário"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
