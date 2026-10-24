'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';
import { useConsultas } from '@/components/consultas/consulta-provider';

export default function NovaConsulta() {
  const router = useRouter();
  const { pacientes, medicos, criarConsulta, loading } = useConsultas();

  const [pacienteId, setPacienteId] = useState('');
  const [medicoId, setMedicoId] = useState('');
  const [data, setData] = useState('');
  const [horario, setHorario] = useState('');
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  const medicoSelecionado = medicos.find((item) => item.id === Number(medicoId));

  async function enviar(event: FormEvent) {
    event.preventDefault();
    setErro('');
    setSalvando(true);

    try {
      const consulta = await criarConsulta({
        pacienteId: Number(pacienteId),
        medicoId: Number(medicoId),
        data,
        horario,
      });
      router.push(`/consultas/${consulta.id}`);
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Não foi possível agendar a consulta.');
    } finally {
      setSalvando(false);
    }
  }

  if (loading) return <p className="text-slate-600">Carregando dados...</p>;

  return (
    <>
      <div className="flex items-center gap-3">
        <Link href="/consultas" className="text-sm font-semibold text-teal-700 hover:underline">
          ← Voltar para Consultas
        </Link>
      </div>

      <h1 className="mt-3 text-3xl font-bold text-slate-800">Nova Consulta</h1>
      <p className="mt-1 text-slate-600">
        Preencha os dados abaixo para criar um novo agendamento com status inicial{' '}
        <span className="font-semibold text-teal-700">AGENDADA</span>.
      </p>

      <form
        onSubmit={enviar}
        className="mt-6 max-w-xl space-y-5 rounded-xl bg-white p-6 shadow-sm"
      >
        {erro && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            {erro}
          </div>
        )}

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700">Paciente *</label>
            <Link
              href="/pacientes"
              className="text-xs font-medium text-teal-700 hover:underline"
            >
              + Cadastrar novo paciente
            </Link>
          </div>
          <select
            required
            value={pacienteId}
            onChange={(e) => setPacienteId(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-teal-500 focus:outline-none"
          >
            <option value="">Selecione o paciente</option>
            {pacientes.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nome} {p.cpf ? `(CPF: ${p.cpf})` : ''}
              </option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700">Médico *</label>
            <Link
              href="/medicos"
              className="text-xs font-medium text-teal-700 hover:underline"
            >
              + Cadastrar novo médico
            </Link>
          </div>
          <select
            required
            value={medicoId}
            onChange={(e) => setMedicoId(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-teal-500 focus:outline-none"
          >
            <option value="">Selecione o médico</option>
            {medicos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome} — {m.especialidade}
              </option>
            ))}
          </select>
        </div>

        {medicoSelecionado && (
          <div className="rounded-lg bg-teal-50 p-3 text-sm text-teal-900 border border-teal-200">
            <strong>Especialidade:</strong> {medicoSelecionado.especialidade}
            {medicoSelecionado.crm && (
              <span className="ml-3">
                <strong>CRM:</strong> {medicoSelecionado.crm}
              </span>
            )}
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-slate-700">Data *</label>
            <input
              required
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">Horário *</label>
            <input
              required
              type="time"
              value={horario}
              onChange={(e) => setHorario(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t pt-4">
          <Link
            href="/consultas"
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={salvando}
            className="rounded-lg bg-teal-700 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-teal-800 disabled:opacity-50"
          >
            {salvando ? 'Agendando...' : 'Agendar Consulta'}
          </button>
        </div>
      </form>
    </>
  );
}
