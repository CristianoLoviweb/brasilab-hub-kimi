import { MASTER_USER } from "@/features/users/data/masterUser";

/**
 * Equipe comercial da plataforma.
 *
 * Sprint 03.1: o único usuário cadastrado é o Administrador Master, que
 * acumula provisoriamente as atribuições comerciais (venda e gestão).
 * Novos vendedores e gestores passarão a constar aqui conforme forem
 * cadastrados na plataforma.
 */
export interface CommercialTeamMember {
  id: string;
  name: string;
}

const MASTER_MEMBER: CommercialTeamMember = {
  id: MASTER_USER.id,
  name: MASTER_USER.name,
};

export const COMMERCIAL_SELLERS: CommercialTeamMember[] = [MASTER_MEMBER];

export const COMMERCIAL_MANAGERS: CommercialTeamMember[] = [MASTER_MEMBER];
