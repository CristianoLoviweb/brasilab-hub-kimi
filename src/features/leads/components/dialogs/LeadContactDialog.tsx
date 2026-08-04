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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import {
  LEAD_CONTACT_CHANNEL_LABELS,
  LEAD_CONTACT_RESULT_LABELS,
} from "../../constants/leadDomain";
import { leadContactSchema } from "../../schemas/leadSchemas";
import type { LeadContactFormValues } from "../../schemas/leadSchemas";
import type { LeadContactChannel, LeadContactResult } from "../../types";

export interface LeadContactSubmit {
  channel: LeadContactChannel;
  result: LeadContactResult;
  notes: string;
  nextStep?: string;
  nextScheduleAt?: string;
  nextScheduleDescription?: string;
}

interface LeadContactDialogProps {
  trigger: ReactNode;
  submitting?: boolean;
  onSubmit: (values: LeadContactSubmit) => Promise<void> | void;
}

/**
 * Registro de contato realizado (Sprint 03 — item 19) com reagendamento
 * opcional (item 14).
 */
export function LeadContactDialog({
  trigger,
  submitting,
  onSubmit,
}: LeadContactDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<LeadContactFormValues>({
    resolver: zodResolver(leadContactSchema),
    defaultValues: {
      channel: "ligacao",
      result: "contato_realizado",
      notes: "",
      nextStep: "",
      scheduleNext: false,
      nextScheduleAt: "",
      nextScheduleDescription: "",
    },
  });

  const scheduleNext = form.watch("scheduleNext");

  const handleSubmit = form.handleSubmit(async (values) => {
    const nextStep = values.nextStep?.trim();
    const nextScheduleAt = values.scheduleNext ? values.nextScheduleAt?.trim() : "";
    const nextScheduleDescription = values.nextScheduleDescription?.trim();

    await onSubmit({
      channel: values.channel as LeadContactChannel,
      result: values.result as LeadContactResult,
      notes: values.notes.trim(),
      ...(nextStep ? { nextStep } : {}),
      ...(nextScheduleAt ? { nextScheduleAt } : {}),
      ...(nextScheduleAt && nextScheduleDescription ? { nextScheduleDescription } : {}),
    });

    form.reset();
    setOpen(false);
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Registrar contato</DialogTitle>
          <DialogDescription>
            O registro conclui o primeiro atendimento e alimenta o Histórico do Lead.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="channel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Canal</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(LEAD_CONTACT_CHANNEL_LABELS).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="result"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resultado</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(LEAD_CONTACT_RESULT_LABELS).map(
                          ([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
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
                  <FormLabel>Retorno do contato</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Descreva o que foi tratado com o solicitante"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nextStep"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Próximo passo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex.: aguardar envio do projeto" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="scheduleNext"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Agendar novo contato</FormLabel>
                    <FormDescription>
                      Cria um reagendamento na Agenda Comercial.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />

            {scheduleNext ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="nextScheduleAt"
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
                  name="nextScheduleDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objetivo do retorno</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex.: retorno sobre o projeto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ) : null}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                Registrar contato
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
