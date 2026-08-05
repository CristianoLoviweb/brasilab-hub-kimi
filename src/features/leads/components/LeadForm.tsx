import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { SectionCard } from "@/components/common/SectionCard";
import { Button } from "@/components/ui/button";
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

import { LEAD_ORIGIN_LABELS, LEAD_PRIORITY_LABELS } from "../constants/leadDomain";
import { COMMERCIAL_SELLERS } from "../data/commercialTeam";
import { leadFormSchema } from "../schemas/leadSchemas";
import type { LeadFormValues } from "../schemas/leadSchemas";
import type { LeadInput, LeadOrigin, LeadPriority } from "../types";

interface LeadFormProps {
  /** Habilita a atribuição imediata (somente com permissão de gestão). */
  allowDirectAssignment?: boolean;
  submitting?: boolean;
  onSubmit: (input: LeadInput) => Promise<void> | void;
  onCancel?: () => void;
}

const UNASSIGNED = "sem_atribuicao";

/** Cadastro manual de Lead (Sprint 03 — item 3). */
export function LeadForm({
  allowDirectAssignment = false,
  submitting,
  onSubmit,
  onCancel,
}: LeadFormProps) {
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      whatsapp: "",
      city: "",
      state: "",
      product: "",
      description: "",
      installationPlace: "",
      notes: "",
      origin: "manual",
      priority: "normal",
      assignToSellerId: UNASSIGNED,
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    const assignTo =
      allowDirectAssignment &&
      values.assignToSellerId &&
      values.assignToSellerId !== UNASSIGNED
        ? values.assignToSellerId
        : null;

    const input: LeadInput = {
      requester: {
        name: values.name.trim(),
        company: values.company?.trim() ?? "",
        email: values.email?.trim() ?? "",
        phone: values.phone.trim(),
        whatsapp: values.whatsapp?.trim() || values.phone.trim(),
        city: values.city?.trim() ?? "",
        state: (values.state ?? "").trim().toUpperCase(),
      },
      interest: {
        product: values.product.trim(),
        description: values.description?.trim() ?? "",
        installationPlace: values.installationPlace?.trim() ?? "",
        notes: values.notes?.trim() ?? "",
      },
      origin: values.origin as LeadOrigin,
      priority: values.priority as LeadPriority,
      assignToSellerId: assignTo,
    };

    await onSubmit(input);
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <SectionCard
          title="Solicitante"
          description="Dados de contato utilizados no atendimento comercial."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Nome do solicitante" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Empresa</FormLabel>
                  <FormControl>
                    <Input placeholder="Razão social ou instituição" {...field} />
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
              name="whatsapp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WhatsApp</FormLabel>
                  <FormControl>
                    <Input placeholder="Opcional — assume o telefone" {...field} />
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
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input placeholder="contato@empresa.com.br" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-[minmax(0,1fr)_100px] gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cidade</FormLabel>
                    <FormControl>
                      <Input placeholder="Cidade" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UF</FormLabel>
                    <FormControl>
                      <Input maxLength={2} placeholder="SP" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Oportunidade"
          description="Interesse declarado, origem da captação e prioridade de atendimento."
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="product"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Produto ou serviço</FormLabel>
                  <FormControl>
                    <Input placeholder="Bancada de laboratório, capela..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição da necessidade</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Detalhe a solicitação" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="installationPlace"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local de instalação</FormLabel>
                    <FormControl>
                      <Input placeholder="Laboratório, universidade..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Input placeholder="Informações complementares" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="origin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origem</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(LEAD_ORIGIN_LABELS).map(([value, label]) => (
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
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prioridade</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(LEAD_PRIORITY_LABELS).map(([value, label]) => (
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
            </div>

            {allowDirectAssignment ? (
              <FormField
                control={form.control}
                name="assignToSellerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Atribuir imediatamente</FormLabel>
                    <Select value={field.value ?? UNASSIGNED} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UNASSIGNED}>
                          Enviar para a fila de disponíveis
                        </SelectItem>
                        {COMMERCIAL_SELLERS.map((seller) => (
                          <SelectItem key={seller.id} value={seller.id}>
                            {seller.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      A atribuição direta cria imediatamente o primeiro contato obrigatório.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : null}
          </div>
        </SectionCard>

        <div className="flex justify-end gap-2">
          {onCancel ? (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          ) : null}
          <Button type="submit" disabled={submitting}>
            Cadastrar Lead
          </Button>
        </div>
      </form>
    </Form>
  );
}
