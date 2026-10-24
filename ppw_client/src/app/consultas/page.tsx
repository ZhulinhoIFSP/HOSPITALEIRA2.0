'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { ConsultaStatusBadge } from '@/components/consultas/consulta-status-badge';
import { useConsultas } from '@/components/consultas/consulta-provider';
import { Modal } from '@/components/ui/modal';
import { Consulta, StatusConsulta } from '@/types/consulta';

export default function PaginaConsultas() {
  const {
    consultas,
    pacientes,
    medicos,
    loading,
    error,
    editarConsulta,
    excluirConsulta,
  } = useConsultas();

  const [busca, setBusca] = useState('');
  const [data, setData] = useState('');
  const [status, setStatus] = useState('');
  const [medicoId, setMedicoId] = useState('');

  // Modais
  const [consultaParaEditar, setConsultaParaEditar] = useState<Consulta | null>(null);
  const [consultaParaExcluir, setConsultaParaExcluir] = useState<Consulta | null>(null);

  // Campos de edição
  const [editPacienteId, setEditPacienteId] = useState('');
  const [editMedicoId, setEditMedicoId] = useState('');
  const [editData, setEditData] = useState('');
  const [editHorario, setEditHorario] = useState('');
  const [editStatus, setEditStatus] = useState<StatusConsulta>('AGENDADA');
  const [salvando, setSalvando] = useState(false);
  const [modalErro, setModalErro] = useState('');

  function abrirEdicao(c: Consulta) {
    setConsultaParaEditar(c);
    setEditPacienteId(String(c.pacienteId));
    setEditMedicoId(String(c.medicoId));
    setEditData(c.data);
    setEditHorario(c.horario);
    setEditStatus(c.status);
    setModalErro('');
  }

  async function salvarEdicao(event: FormEvent) {
    event.preventDefault();
    if (!consultaParaEditar) return;
    setSalvando(true);
    setModalErro('');

    try {
      await editarConsulta(consultaParaEditar.id, {
        pacienteId: Number(editPacienteId),
        medicoId: Number(editMedicoId),
        data: editData,
        horario: editHorario,
        status: editStatus,
      });
      setConsultaParaEditar(null);
    } catch (err) {
      setModalErro(err instanceof Error ? err.message : 'Erro ao salvar alterações.');
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    if (!consultaParaExcluir) return;
    setSalvando(true);
    setModalErro('');

    try {
      await excluirConsulta(consultaParaExcluir.id);
      setConsultaParaExcluir(null);
    } catch (err) {
      setModalErro(err instanceof Error ? err.message : 'Erro ao excluir consulta.');
    } finally {
      setSalvando(false);
    }
  }

  const filtradas = consultas
    .filter((consulta) => {
      const paciente = pacientes.find((item) => item.id === consulta.pacienteId)?.nome ?? '';
      const medico = medicos.find((item) => item.id === consulta.medicoId)?.nome ?? '';
      return (
        (!data || consulta.data === data) &&
        (!status || consulta.status === status) &&
        (!medicoId || consulta.medicoId === Number(medicoId)) &&
        `${paciente} ${medico}`.toLowerCase().includes(busca.toLowerCase())
      );
    })
    .sort((a, b) => `${a.data}${a.horario}`.localeCompare(`${b.data}${b.horario}`));

  if (loading) return <p className="text-slate-600">Carregando consultas...</p>;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Consultas</h1>
          <p className="mt-1 text-slate-600">
            Acompanhe, altere, inclua e gerencie os agendamentos médicos.
          </p>
        </div>
        <Link
          href="/consultas/nova"
          className="flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white shadow-sm hover:bg-teal-800 transition-colors"
        >
          <span>+</span> Incluir Consulta
        </Link>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
          {error}
        </div>
      )}

      {/* Filtros */}
      <section className="mt-6 grid gap-3 rounded-xl bg-white p-4 shadow-sm md:grid-cols-4">
        <input
          aria-label="Buscar por paciente ou médico"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar paciente ou médico"
          className="rounded-lg border border-slate-200 p-2 text-sm focus:border-teal-500 focus:outline-none"
        />
        <input
          aria-label="Filtrar por data"
          type="date"
          value={data}
          onChange={(e) => setData(e.target.value)}
          className="rounded-lg border border-slate-200 p-2 text-sm focus:border-teal-500 focus:outline-none"
        />
        <select
          aria-label="Filtrar por status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-200 p-2 text-sm focus:border-teal-500 focus:outline-none"
        >
          <option value="">Todos os status</option>
          {['AGENDADA', 'CONFIRMADA', 'CHECK_IN', 'REALIZADA', 'CANCELADA'].map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          aria-label="Filtrar por médico"
          value={medicoId}
          onChange={(e) => setMedicoId(e.target.value)}
          className="rounded-lg border border-slate-200 p-2 text-sm focus:border-teal-500 focus:outline-none"
        >
          <option value="">Todos os médicos</option>
          {medicos.map((medico) => (
            <option key={medico.id} value={medico.id}>
              {medico.nome} ({medico.especialidade})
            </option>
          ))}
        </select>
      </section>

      {/* Tabela de Listagem */}
      <div className="mt-5 overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full min-w-225 text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 border-b">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3">Paciente</th>
              <th className="p-3">Médico</th>
              <th className="p-3">Especialidade</th>
              <th className="p-3">Data</th>
              <th className="p-3">Horário</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtradas.map((consulta) => {
              const paciente = pacientes.find((item) => item.id === consulta.pacienteId);
              const medico = medicos.find((item) => item.id === consulta.medicoId);
              return (
                <tr
                  key={consulta.id}
                  className={`border-t hover:bg-slate-50/70 ${
                    consulta.status === 'CANCELADA' ? 'bg-rose-50/30 text-slate-500' : ''
                  }`}
                >
                  <td className="p-3 font-semibold text-slate-700">#{consulta.id}</td>
                  <td className="p-3 font-medium text-slate-900">
                    {paciente?.nome ?? `ID ${consulta.pacienteId}`}
                  </td>
                  <td className="p-3">{medico?.nome ?? `ID ${consulta.medicoId}`}</td>
                  <td className="p-3 text-slate-600">{medico?.especialidade ?? '—'}</td>
                  <td className="p-3">{consulta.data}</td>
                  <td className="p-3">{consulta.horario}</td>
                  <td className="p-3">
                    <ConsultaStatusBadge status={consulta.status} />
                  </td>
                  <td className="p-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/consultas/${consulta.id}`}
                        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-50"
                      >
                        Detalhes
                      </Link>
                      <button
                        type="button"
                        onClick={() => abrirEdicao(consulta)}
                        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Alterar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setModalErro('');
                          setConsultaParaExcluir(consulta);
                        }}
                        className="rounded-md border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!filtradas.length && (
          <p className="p-8 text-center text-slate-500">Nenhuma consulta encontrada.</p>
        )}
      </div>

      {/* Modal de Alteração Rápida da Consulta */}
      <Modal
        aberto={consultaParaEditar !== null}
        aoFechar={() => setConsultaParaEditar(null)}
        titulo={`Alterar Consulta #${consultaParaEditar?.id}`}
      >
        <form onSubmit={salvarEdicao} className="space-y-4">
          {modalErro && (
            <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{modalErro}</p>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700">Paciente</label>
            <select
              required
              value={editPacienteId}
              onChange={(e) => setEditPacienteId(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-teal-500 focus:outline-none"
            >
              {pacientes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Médico</label>
            <select
              required
              value={editMedicoId}
              onChange={(e) => setEditMedicoId(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-teal-500 focus:outline-none"
            >
              {medicos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nome} — {m.especialidade}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">Data</label>
              <input
                required
                type="date"
                value={editData}
                onChange={(e) => setEditData(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">Horário</label>
              <input
                required
                type="time"
                value={editHorario}
                onChange={(e) => setEditHorario(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Status</label>
            <select
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value as StatusConsulta)}
              className="mt-1 block w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-teal-500 focus:outline-none"
            >
              {['AGENDADA', 'CONFIRMADA', 'CHECK_IN', 'REALIZADA', 'CANCELADA'].map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 border-t pt-4">
            <button
              type="button"
              onClick={() => setConsultaParaEditar(null)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
            >
              {salvando ? 'Salvando...' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Exclusão da Consulta */}
      <Modal
        aberto={consultaParaExcluir !== null}
        aoFechar={() => setConsultaParaExcluir(null)}
        titulo="Confirmar Exclusão de Consulta"
      >
        <div className="space-y-4">
          {modalErro && (
            <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{modalErro}</p>
          )}
          <p className="text-sm text-slate-600">
            Tem certeza que deseja excluir a Consulta{' '}
            <strong className="text-slate-900">#{consultaParaExcluir?.id}</strong> do paciente{' '}
            <strong>
              {pacientes.find((p) => p.id === consultaParaExcluir?.pacienteId)?.nome}
            </strong>
            ?
          </p>
          <div className="flex justify-end gap-2 border-t pt-4">
            <button
              type="button"
              onClick={() => setConsultaParaExcluir(null)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Voltar
            </button>
            <button
              type="button"
              onClick={confirmarExclusao}
              disabled={salvando}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {salvando ? 'Excluindo...' : 'Sim, Excluir'}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
