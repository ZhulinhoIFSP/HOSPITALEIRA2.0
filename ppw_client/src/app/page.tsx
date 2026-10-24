'use client';

import Link from 'next/link';
import { ConsultaStatusBadge } from '@/components/consultas/consulta-status-badge';
import { useConsultas } from '@/components/consultas/consulta-provider';

const rotulo: Record<string, string> = {
  AGENDADA: 'Agendadas',
  CONFIRMADA: 'Confirmadas',
  CHECK_IN: 'Em check-in',
  REALIZADA: 'Realizadas',
  CANCELADA: 'Canceladas',
};

export default function Dashboard() {
  const { consultas, pacientes, medicos, loading, error } = useConsultas();

  const ordenadas = [...consultas].sort((a, b) =>
    `${a.data}${a.horario}`.localeCompare(`${b.data}${b.horario}`),
  );

  if (loading) return <p className="text-slate-600">Carregando painel...</p>;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
          <p className="mt-1 text-slate-600">
            Visão geral da agenda clínica, pacientes e médicos.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/consultas/nova"
            className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white shadow-sm hover:bg-teal-800 transition-colors"
          >
            + Agendar Consulta
          </Link>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
          {error}
        </div>
      )}

      {/* Cartões Principais: Pacientes, Médicos, Consultas */}
      <section className="mt-6 grid gap-4 sm:grid-cols-3">
        <Link
          href="/pacientes"
          className="group rounded-xl bg-white p-5 shadow-sm border border-slate-100 hover:border-teal-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Pacientes Cadastrados</p>
            <span className="text-xs font-semibold text-teal-700 group-hover:underline">
              Gerenciar →
            </span>
          </div>
          <strong className="mt-2 block text-3xl font-bold text-slate-800">
            {pacientes.length}
          </strong>
        </Link>

        <Link
          href="/medicos"
          className="group rounded-xl bg-white p-5 shadow-sm border border-slate-100 hover:border-teal-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Médicos Ativos</p>
            <span className="text-xs font-semibold text-teal-700 group-hover:underline">
              Gerenciar →
            </span>
          </div>
          <strong className="mt-2 block text-3xl font-bold text-slate-800">
            {medicos.length}
          </strong>
        </Link>

        <Link
          href="/consultas"
          className="group rounded-xl bg-white p-5 shadow-sm border border-slate-100 hover:border-teal-200 hover:shadow-md transition-all"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-slate-500">Total de Consultas</p>
            <span className="text-xs font-semibold text-teal-700 group-hover:underline">
              Gerenciar →
            </span>
          </div>
          <strong className="mt-2 block text-3xl font-bold text-slate-800">
            {consultas.length}
          </strong>
        </Link>
      </section>

      {/* Métricas por Status */}
      <section className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {Object.entries(rotulo).map(([status, texto]) => {
          const qtd = consultas.filter((c) => c.status === status).length;
          return (
            <div key={status} className="rounded-xl bg-white p-4 shadow-sm border border-slate-100">
              <p className="text-xs font-medium text-slate-500">{texto}</p>
              <div className="mt-2 flex items-center justify-between">
                <strong className="text-2xl font-bold text-slate-800">{qtd}</strong>
                <ConsultaStatusBadge status={status as any} />
              </div>
            </div>
          );
        })}
      </section>

      {/* Próximas Consultas */}
      <section className="mt-8 rounded-xl bg-white p-6 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-800">Próximas Consultas</h2>
          <Link
            className="text-sm font-semibold text-teal-700 hover:underline"
            href="/consultas"
          >
            Ver todas as consultas →
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {ordenadas.slice(0, 5).map((consulta) => {
            const pac = pacientes.find((p) => p.id === consulta.pacienteId);
            const med = medicos.find((m) => m.id === consulta.medicoId);
            return (
              <Link
                key={consulta.id}
                href={`/consultas/${consulta.id}`}
                className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition-colors"
              >
                <div>
                  <strong className="text-slate-900">
                    {pac?.nome ?? `Paciente #${consulta.pacienteId}`}
                  </strong>
                  <span className="ml-2 text-sm text-slate-500">
                    com {med?.nome ?? `Médico #${consulta.medicoId}`} ({med?.especialidade})
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <span className="font-medium text-slate-600">
                    {consulta.data} · {consulta.horario}
                  </span>
                  <ConsultaStatusBadge status={consulta.status} />
                </div>
              </Link>
            );
          })}
          {!ordenadas.length && (
            <p className="py-6 text-center text-slate-500">Nenhuma consulta agendada.</p>
          )}
        </div>
      </section>
    </>
  );
}
