import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  CalendarPlus,
  FileUp,
  Handshake,
  Mail,
  MessageSquare,
  PhoneCall,
  StickyNote,
  UserPlus,
} from "lucide-react";
import { toast } from "sonner";

import { DetailList } from "@/components/common/DetailList";
import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { SectionCard } from "@/components/common/SectionCard";
import { StatusBadge } from "@/components/common/StatusBadge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LeadHistoryTimeline } from "@/features/leads/components/LeadHistoryTimeline";
import {
  LeadAssignmentDialog,
  LeadFileDialog,
  LeadNoteDialog,
  LeadReasonDialog,
  LeadScheduleDialog,
} from "@/features/leads/components/dialogs/LeadActionDialogs";
import { LeadContactDialog } from "@/features/leads/components/dialogs/LeadContactDialog";
import {
  LEAD_CONTACT_CHANNEL_LABELS,
  LEAD_CONTACT_RESULT_LABELS,
  LEAD_ORIGIN_LABELS,
  LEAD_PRIORITY_LABELS,
  LEAD_PRIORITY_TONE,
  LEAD_SCHEDULE_STATUS_LABELS,
  LEAD_SCHEDULE_STATUS_TONE,
  LEAD_SITUATION_LABELS,
  LEAD_SITUATION_TONE,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_TONE,
} from "@/features/leads/constants/leadDomain";
import { LEAD_PERMISSIONS } from "@/features/leads/constants/leadPermissions";
import { LEAD_APPROVAL_DEADLINE_HOURS } from "@/features/leads/constants/leadTiming";
import { useCommercialActor } from "@/features/leads/hooks/useCommercialActor";
import {
  addFile,
  addNote,
  approveRequest,
  assignLeadDirectly,
  canConvertLead,
  convertLeadToProposal,
  discardLead,
  getLead,
  markLeadAsLost,
  registerContact,
  rejectRequest,
  requestLead,
  scheduleContact,
} from "@/features/leads/services/leadService";
import type { DirectAssignmentInput } from "@/features/leads/services/leadService";
import type { LeadContactSubmit } from "@/features/leads/components/dialogs/LeadContactDialog";
import {
  buildMailtoUrl,
  buildWhatsAppUrl,
} from "@/features/leads/utils/leadContactLinks";
import { describeDeadline } from "@/features/leads/utils/leadTime";
import { formatDateTime } from "@/lib/query";

export const Route = createFileRoute("/_authenticated/comercial/leads/$leadId")({
  head: () => ({
    meta: [
      { title: "Detalhes do Lead · Comercial · Brasilab Intranet Lab" },
      {
        name: "description",
        content:
          "Detalhes do Lead: dados do solicitante, interesse, contatos, agendamentos, notas, arquivos e Histórico imutável.",
      },
      { name: "robots", content: "noindex" },
      { property: "og:title", content: "Detalhes do Lead · Brasilab Intranet Lab" },
      {
        property: "og:description",
        content: "Atendimento completo da oportunidade comercial.",
      },
    ],
  }),
  component: LeadDetalhePage,
});

function LeadDetalhePage() {
  const { leadId } = Route.useParams();
  const queryClient = useQueryClient();
  const { actor, can } = useCommercialActor();

  const query = useQuery({
    queryKey: ["leads", "detalhe", leadId],
    queryFn: () => getLead(leadId),
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["leads"] });

  /* Hook auxiliar: padroniza feedback e invalidação das ações do Lead. */
  const useLeadAction = <TInput,>(
    fn: (input: TInput) => Promise<unknown>,
    successMessage: string,
  ) =>
    useMutation({
      mutationFn: fn,
      onSuccess: () => {
        toast.success(successMessage);
        void invalidate();
      },
      onError: (error: Error) => toast.error(error.message),
    });
  const run = useLeadAction;

  /* Mutations — uma por ação disponível na página. */
  const request = run<void>(() => requestLead(leadId, actor), "Solicitação enviada.");
  const approve = run<void>(
    () => approveRequest(leadId, actor),
    "Solicitação aprovada.",
  );
  const reject = run<string>(
    (reason) => rejectRequest(leadId, actor, reason),
    "Solicitação recusada.",
  );
  const assign = run<DirectAssignmentInput>(
    (input) => assignLeadDirectly(leadId, actor, input),
    "Lead atribuído.",
  );
  const contact = run<LeadContactSubmit>(
    (input) => registerContact(leadId, actor, input),
    "Contato registrado.",
  );
  const schedule = run<{ scheduledFor: string; description: string }>(
    (input) => scheduleContact(leadId, actor, input),
    "Contato agendado.",
  );
  const note = run<string>(
    (content) => addNote(leadId, actor, content),
    "Nota interna adicionada.",
  );
  const file = run<{ name: string; classification: string }>(
    (input) => addFile(leadId, actor, input),
    "Arquivo registrado.",
  );
  const lost = run<string>(
    (reason) => markLeadAsLost(leadId, actor, reason),
    "Lead marcado como perdido.",
  );
  const discard = run<string>(
    (reason) => discardLead(leadId, actor, reason),
    "Lead descartado.",
  );
  const convert = useMutation({
    mutationFn: () => convertLeadToProposal(leadId, actor),
    onSuccess: (result) => {
      toast.success(
        `Conversão registrada (${result.proposalRef}). A numeração oficial da Proposta e da REV 0 será gerada no backend na Sprint 04.`,
      );
      void invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (query.isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const lead = query.data;
  if (!lead) {
    return (
      <EmptyState
        title="Lead não encontrado"
        description="O registro pode ter sido removido ou o endereço está incorreto."
      />
    );
  }

  const isOwner = lead.ownerId === actor.id;
  const canOperate = isOwner || actor.isManager;
  const pendingRequest = lead.request?.status === "pendente" ? lead.request : null;
  const whatsappUrl = buildWhatsAppUrl(
    lead.requester.whatsapp || lead.requester.phone,
    `Olá ${lead.requester.name}, aqui é da Brasilab.`,
  );
  const mailtoUrl = buildMailtoUrl(
    lead.requester.email,
    `Brasilab — ${lead.interest.product}`,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${lead.code} · ${lead.requester.name}`}
        description={`${lead.requester.company || "Sem empresa informada"} · ${lead.interest.product}`}
        icon={Handshake}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/comercial/leads">
                <ArrowLeft className="h-4 w-4" />
                Fila
              </Link>
            </Button>
            {!lead.ownerId && !pendingRequest && can(LEAD_PERMISSIONS.solicitar) ? (
              <Button size="sm" onClick={() => request.mutate()}>
                Solicitar Lead
              </Button>
            ) : null}
            {pendingRequest && can(LEAD_PERMISSIONS.aprovarAtribuicao) ? (
              <>
                <Button size="sm" onClick={() => approve.mutate()}>
                  Aprovar
                </Button>
                <LeadReasonDialog
                  title="Recusar solicitação"
                  description="A justificativa é obrigatória e ficará registrada no Histórico."
                  label="Justificativa"
                  confirmLabel="Recusar"
                  submitting={reject.isPending}
                  onSubmit={async (reason) => {
                    await reject.mutateAsync(reason);
                  }}
                  trigger={
                    <Button size="sm" variant="outline">
                      Recusar
                    </Button>
                  }
                />
              </>
            ) : null}
            {can(LEAD_PERMISSIONS.atribuirDiretamente) ? (
              <LeadAssignmentDialog
                submitting={assign.isPending}
                onSubmit={async (values) => {
                  await assign.mutateAsync(values);
                }}
                trigger={
                  <Button size="sm" variant="outline">
                    <UserPlus className="h-4 w-4" />
                    Atribuir
                  </Button>
                }
              />
            ) : null}
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge
          label={LEAD_STATUS_LABELS[lead.status]}
          tone={LEAD_STATUS_TONE[lead.status]}
        />
        <StatusBadge
          label={LEAD_SITUATION_LABELS[lead.situation]}
          tone={LEAD_SITUATION_TONE[lead.situation]}
        />
        <StatusBadge
          label={`Prioridade ${LEAD_PRIORITY_LABELS[lead.priority]}`}
          tone={LEAD_PRIORITY_TONE[lead.priority]}
        />
        {lead.proposalRef ? (
          <StatusBadge label={`Conversão: ${lead.proposalRef}`} tone="success" />
        ) : null}
      </div>

      {pendingRequest ? (
        <SectionCard
          title="Solicitação em análise"
          description={`Prazo de ${LEAD_APPROVAL_DEADLINE_HOURS} horas para decisão do gestor. Sem decisão, a aprovação é automática.`}
          actions={
            <StatusBadge
              label={describeDeadline(pendingRequest.deadlineAt).label}
              tone={describeDeadline(pendingRequest.deadlineAt).tone}
            />
          }
        >
          <p className="text-sm text-muted-foreground">
            Solicitado por <strong>{pendingRequest.sellerName}</strong> em{" "}
            {formatDateTime(pendingRequest.requestedAt)}.
          </p>
        </SectionCard>
      ) : null}

      <Tabs defaultValue="dados">
        <TabsList>
          <TabsTrigger value="dados">Dados</TabsTrigger>
          <TabsTrigger value="contatos">Contatos</TabsTrigger>
          <TabsTrigger value="agenda">Agenda</TabsTrigger>
          <TabsTrigger value="notas">Notas</TabsTrigger>
          <TabsTrigger value="arquivos">Arquivos</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        <TabsContent value="dados" className="space-y-4">
          <SectionCard
            title="Solicitante"
            description="Ações de contato abrem o WhatsApp Web ou o cliente de e-mail padrão."
            actions={
              <div className="flex flex-wrap gap-2">
                {whatsappUrl ? (
                  <Button asChild size="sm" variant="outline">
                    <a href={whatsappUrl} target="_blank" rel="noreferrer">
                      <MessageSquare className="h-4 w-4" />
                      WhatsApp
                    </a>
                  </Button>
                ) : null}
                {mailtoUrl ? (
                  <Button asChild size="sm" variant="outline">
                    <a href={mailtoUrl}>
                      <Mail className="h-4 w-4" />
                      E-mail
                    </a>
                  </Button>
                ) : null}
              </div>
            }
          >
            <DetailList
              items={[
                { label: "Nome", value: lead.requester.name },
                { label: "Empresa", value: lead.requester.company || "—" },
                { label: "Telefone", value: lead.requester.phone },
                { label: "WhatsApp", value: lead.requester.whatsapp || "—" },
                { label: "E-mail", value: lead.requester.email || "—" },
                {
                  label: "Localidade",
                  value:
                    [lead.requester.city, lead.requester.state]
                      .filter(Boolean)
                      .join(" / ") || "—",
                },
              ]}
            />
          </SectionCard>

          <SectionCard title="Oportunidade">
            <DetailList
              items={[
                { label: "Produto/serviço", value: lead.interest.product },
                { label: "Origem", value: LEAD_ORIGIN_LABELS[lead.origin] },
                {
                  label: "Local de instalação",
                  value: lead.interest.installationPlace || "—",
                },
                { label: "Entrada", value: formatDateTime(lead.createdAt) },
                { label: "Responsável", value: lead.ownerName ?? "Sem responsável" },
                {
                  label: "Atribuído em",
                  value: lead.assignedAt ? formatDateTime(lead.assignedAt) : "—",
                },
                { label: "Descrição", value: lead.interest.description || "—" },
                { label: "Observações", value: lead.interest.notes || "—" },
                { label: "Encerramento", value: lead.closingReason ?? "—" },
              ]}
            />
          </SectionCard>

          <SectionCard
            title="Encerramento e conversão"
            description="A numeração oficial da Proposta e da REV 0 será gerada de forma transacional no backend (Sprint 04)."
          >
            <div className="flex flex-wrap gap-2">
              {can(LEAD_PERMISSIONS.converterProposta) ? (
                <Button
                  size="sm"
                  disabled={!canConvertLead(lead, actor) || convert.isPending}
                  onClick={() => convert.mutate()}
                >
                  Converter em Proposta
                </Button>
              ) : null}
              {can(LEAD_PERMISSIONS.marcarPerdido) ? (
                <LeadReasonDialog
                  title="Marcar como perdido"
                  description="Informe o motivo da perda para o Histórico do Lead."
                  label="Motivo"
                  confirmLabel="Marcar como perdido"
                  submitting={lost.isPending}
                  onSubmit={async (reason) => {
                    await lost.mutateAsync(reason);
                  }}
                  trigger={
                    <Button size="sm" variant="outline">
                      Marcar como perdido
                    </Button>
                  }
                />
              ) : null}
              {can(LEAD_PERMISSIONS.descartar) ? (
                <LeadReasonDialog
                  title="Descartar Lead"
                  description="O descarte encerra o Lead e é registrado no Histórico."
                  label="Motivo"
                  confirmLabel="Descartar"
                  submitting={discard.isPending}
                  onSubmit={async (reason) => {
                    await discard.mutateAsync(reason);
                  }}
                  trigger={
                    <Button size="sm" variant="outline">
                      Descartar
                    </Button>
                  }
                />
              ) : null}
            </div>
          </SectionCard>
        </TabsContent>

        <TabsContent value="contatos">
          <SectionCard
            title="Contatos realizados"
            description="O primeiro contato válido conclui o atendimento obrigatório."
            actions={
              canOperate && can(LEAD_PERMISSIONS.registrarContato) ? (
                <LeadContactDialog
                  submitting={contact.isPending}
                  onSubmit={async (values) => {
                    await contact.mutateAsync(values);
                  }}
                  trigger={
                    <Button size="sm">
                      <PhoneCall className="h-4 w-4" />
                      Registrar contato
                    </Button>
                  }
                />
              ) : null
            }
          >
            {lead.contacts.length === 0 ? (
              <EmptyState
                title="Nenhum contato registrado"
                description="Registre o primeiro contato dentro do prazo para manter o Lead na carteira."
              />
            ) : (
              <ul className="divide-y">
                {[...lead.contacts]
                  .sort(
                    (a, b) =>
                      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
                  )
                  .map((item) => (
                    <li key={item.id} className="space-y-1 py-3 first:pt-0 last:pb-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge
                          label={LEAD_CONTACT_CHANNEL_LABELS[item.channel]}
                          tone="info"
                        />
                        <StatusBadge label={LEAD_CONTACT_RESULT_LABELS[item.result]} />
                        <span className="text-xs text-muted-foreground">
                          {formatDateTime(item.occurredAt)} · {item.authorName}
                        </span>
                      </div>
                      <p className="text-sm">{item.notes}</p>
                      {item.nextStep ? (
                        <p className="text-xs text-muted-foreground">
                          Próximo passo: {item.nextStep}
                        </p>
                      ) : null}
                    </li>
                  ))}
              </ul>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="agenda">
          <SectionCard
            title="Agendamentos"
            actions={
              canOperate && can(LEAD_PERMISSIONS.agendarContato) ? (
                <LeadScheduleDialog
                  submitting={schedule.isPending}
                  onSubmit={async (values) => {
                    await schedule.mutateAsync(values);
                  }}
                  trigger={
                    <Button size="sm">
                      <CalendarPlus className="h-4 w-4" />
                      Agendar contato
                    </Button>
                  }
                />
              ) : null
            }
          >
            {lead.schedules.length === 0 ? (
              <EmptyState
                title="Nenhum agendamento"
                description="O primeiro contato é criado automaticamente na atribuição do Lead."
              />
            ) : (
              <ul className="divide-y">
                {[...lead.schedules]
                  .sort(
                    (a, b) =>
                      new Date(a.scheduledFor).getTime() -
                      new Date(b.scheduledFor).getTime(),
                  )
                  .map((item) => (
                    <li
                      key={item.id}
                      className="flex flex-wrap items-start justify-between gap-3 py-3 first:pt-0 last:pb-0"
                    >
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          {item.isFirstContact ? (
                            <StatusBadge label="Primeiro contato" tone="info" />
                          ) : null}
                          <StatusBadge
                            label={LEAD_SCHEDULE_STATUS_LABELS[item.status]}
                            tone={LEAD_SCHEDULE_STATUS_TONE[item.status]}
                          />
                        </div>
                        <p className="mt-1 text-sm">{item.description}</p>
                        <p className="text-xs text-muted-foreground">{item.ownerName}</p>
                      </div>
                      <p className="text-sm font-medium">
                        {formatDateTime(item.scheduledFor)}
                      </p>
                    </li>
                  ))}
              </ul>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="notas">
          <SectionCard
            title="Notas internas"
            description="Conteúdo interno — nunca é enviado ao solicitante."
            actions={
              can(LEAD_PERMISSIONS.adicionarNota) ? (
                <LeadNoteDialog
                  submitting={note.isPending}
                  onSubmit={async (content) => {
                    await note.mutateAsync(content);
                  }}
                  trigger={
                    <Button size="sm">
                      <StickyNote className="h-4 w-4" />
                      Adicionar nota
                    </Button>
                  }
                />
              ) : null
            }
          >
            {lead.notes.length === 0 ? (
              <EmptyState
                title="Nenhuma nota"
                description="Registre informações relevantes do atendimento."
              />
            ) : (
              <ul className="divide-y">
                {lead.notes.map((item) => (
                  <li key={item.id} className="space-y-1 py-3 first:pt-0 last:pb-0">
                    <p className="text-sm">{item.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDateTime(item.createdAt)} · {item.authorName}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="arquivos">
          <SectionCard
            title="Arquivos"
            description="Metadados simulados. Nenhum arquivo é armazenado nesta Sprint."
            actions={
              can(LEAD_PERMISSIONS.adicionarArquivo) ? (
                <LeadFileDialog
                  submitting={file.isPending}
                  onSubmit={async (values) => {
                    await file.mutateAsync(values);
                  }}
                  trigger={
                    <Button size="sm">
                      <FileUp className="h-4 w-4" />
                      Adicionar arquivo
                    </Button>
                  }
                />
              ) : null
            }
          >
            {lead.files.length === 0 ? (
              <EmptyState
                title="Nenhum arquivo"
                description="Anexe documentos relacionados ao atendimento."
              />
            ) : (
              <ul className="divide-y">
                {lead.files.map((item) => (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.classification} · {formatDateTime(item.uploadedAt)} ·{" "}
                        {item.authorName}
                      </p>
                    </div>
                    <StatusBadge label={item.extension.toUpperCase() || "ARQUIVO"} />
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </TabsContent>

        <TabsContent value="historico">
          <SectionCard
            title="Histórico"
            description="Registro cronológico e imutável de todas as ações do Lead."
          >
            <LeadHistoryTimeline entries={lead.history} />
          </SectionCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}
