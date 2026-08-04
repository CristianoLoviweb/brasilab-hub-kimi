import { zodResolver } from "@hookform/resolvers/zod";
import { useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { Textarea } from "@/components/ui/textarea";

import {
  LEAD_FILE_CLASSIFICATIONS,
  LEAD_PRIORITY_LABELS,
} from "../../constants/leadDomain";
import { LEAD_FIRST_CONTACT_HOURS } from "../../constants/leadTiming";
import { MOCK_SELLERS } from "../../data/mockLeads";
import {
  leadClosingSchema,
  leadDirectAssignmentSchema,
  leadFileSchema,
  leadNoteSchema,
  leadScheduleSchema,
} from "../../schemas/leadSchemas";
import type {
  LeadClosingValues,
  LeadDirectAssignmentValues,
  LeadFileFormValues,
  LeadNoteFormValues,
  LeadScheduleFormValues,
} from "../../schemas/leadSchemas";
import type { LeadPriority } from "../../types";

/** Diálogos de ação do Lead — todos consomem os schemas oficiais do módulo. */

interface BaseDialogProps {
  trigger: ReactNode;
  submitting?: boolean;
}

/* ------------------------------------------------------------- agendamento */

export function LeadScheduleDialog({
  trigger,
  submitting,
  onSubmit,
}: BaseDialogProps & {
  onSubmit: (values: { scheduledFor: string; description: string }) => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<LeadScheduleFormValues>({
    resolver: zodResolver(leadScheduleSchema),
    defaultValues: { scheduledFor: "", description: "" },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit({
      scheduledFor: values.scheduledFor,
      description: values.description.trim(),
    });
    form.reset();
    setOpen(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar contato</DialogTitle>
          <DialogDescription>
            O compromisso aparecerá na Agenda Comercial e no Dashboard.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="scheduledFor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data e horário</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
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
                  <FormLabel>Objetivo</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Descreva o objetivo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                Agendar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------- nota interna */

export function LeadNoteDialog({
  trigger,
  submitting,
  onSubmit,
}: BaseDialogProps & { onSubmit: (content: string) => Promise<void> | void }) {
  const [open, setOpen] = useState(false);
  const form = useForm<LeadNoteFormValues>({
    resolver: zodResolver(leadNoteSchema),
    defaultValues: { content: "" },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values.content.trim());
    form.reset();
    setOpen(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar nota interna</DialogTitle>
          <DialogDescription>
            As notas são internas e nunca são enviadas ao solicitante.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nota</FormLabel>
                  <FormControl>
                    <Textarea rows={4} placeholder="Escreva a nota interna" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                Adicionar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ arquivo */

export function LeadFileDialog({
  trigger,
  submitting,
  onSubmit,
}: BaseDialogProps & {
  onSubmit: (values: { name: string; classification: string }) => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<LeadFileFormValues>({
    resolver: zodResolver(leadFileSchema),
    defaultValues: { name: "", classification: LEAD_FILE_CLASSIFICATIONS[0]! },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit({ name: values.name.trim(), classification: values.classification });
    form.reset();
    setOpen(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adicionar arquivo</DialogTitle>
          <DialogDescription>
            Nesta etapa apenas os metadados são registrados: não existe envio real de
            arquivos.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do arquivo</FormLabel>
                  <FormControl>
                    <Input placeholder="projeto-laboratorio.pdf" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="classification"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Classificação</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {LEAD_FILE_CLASSIFICATIONS.map((item) => (
                        <SelectItem key={item} value={item}>
                          {item}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                Adicionar
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------- atribuição direta */

export function LeadAssignmentDialog({
  trigger,
  submitting,
  onSubmit,
}: BaseDialogProps & {
  onSubmit: (values: {
    sellerId: string;
    sellerName: string;
    firstContactHours: number;
    priority: LeadPriority;
    observation?: string;
  }) => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<LeadDirectAssignmentValues>({
    resolver: zodResolver(leadDirectAssignmentSchema),
    defaultValues: {
      sellerId: MOCK_SELLERS[0]!.id,
      firstContactHours: LEAD_FIRST_CONTACT_HOURS,
      priority: "normal",
      observation: "",
    },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    const seller = MOCK_SELLERS.find((item) => item.id === values.sellerId);
    const observation = values.observation?.trim();

    await onSubmit({
      sellerId: values.sellerId,
      sellerName: seller?.name ?? values.sellerId,
      firstContactHours: Number(values.firstContactHours),
      priority: values.priority as LeadPriority,
      ...(observation ? { observation } : {}),
    });

    form.reset();
    setOpen(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Atribuir diretamente</DialogTitle>
          <DialogDescription>
            A atribuição direta dispensa a aprovação e cria imediatamente o primeiro
            contato.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="sellerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vendedor</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {MOCK_SELLERS.map((seller) => (
                        <SelectItem key={seller.id} value={seller.id}>
                          {seller.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="firstContactHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prazo do primeiro contato (horas)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={168}
                        value={String(field.value ?? "")}
                        onChange={(event) => field.onChange(Number(event.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Padrão atual: {LEAD_FIRST_CONTACT_HOURS} horas.
                    </FormDescription>
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
            <FormField
              control={form.control}
              name="observation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observação</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Opcional" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                Atribuir
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------- justificativa (recusa / encerramento) */

export function LeadReasonDialog({
  trigger,
  submitting,
  title,
  description,
  label,
  confirmLabel,
  onSubmit,
}: BaseDialogProps & {
  title: string;
  description: string;
  label: string;
  confirmLabel: string;
  onSubmit: (reason: string) => Promise<void> | void;
}) {
  const [open, setOpen] = useState(false);
  const form = useForm<LeadClosingValues>({
    resolver: zodResolver(leadClosingSchema),
    defaultValues: { reason: "" },
  });

  const handleSubmit = form.handleSubmit(async (values) => {
    await onSubmit(values.reason.trim());
    form.reset();
    setOpen(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{label}</FormLabel>
                  <FormControl>
                    <Textarea rows={4} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {confirmLabel}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

