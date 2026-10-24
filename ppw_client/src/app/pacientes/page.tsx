'use client';

import { FormEvent, useState } from 'react';
import { useConsultas } from '@/components/consultas/consulta-provider';
import { Modal } from '@/components/ui/modal';
import { DadosPaciente, Paciente } from '@/types/consulta';

export default function PaginaPacientes() {
  const { pacientes, loading, error, criarPaciente, editarPaciente, excluirPaciente } =
    useConsultas();

  const [busca, setBusca] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [pacienteEmEdicao, setPacienteEmEdicao] = useState<Paciente | null>(null);
  const [pacienteParaExcluir, setPacienteParaExcluir] = useState<Paciente | null>(null);

  // Form states
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpf, setCpf] = useState('');
  const [formErro, setFormErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  function abrirNovo() {
    setPacienteEmEdicao(null);
    setNome('');
    setEmail('');
    setTelefone('');
    setCpf('');
    setFormErro('');
    setModalAberto(true);
  }

  function abrirEditar(paciente: Paciente) {
    setPacienteEmEdicao(paciente);
    setNome(paciente.nome);
    setEmail(paciente.email ?? '');
    setTelefone(paciente.telefone ?? '');
    setCpf(paciente.cpf ?? '');
    setFormErro('');
    setModalAberto(true);
  }

  async function submeterForm(event: FormEvent) {
    event.preventDefault();
    setFormErro('');
    setSalvando(true);

    const dados: DadosPaciente = {
      nome: nome.trim(),
      email: email.trim() || undefined,
      telefone: telefone.trim() || undefined,
      cpf: cpf.trim() || undefined,
    };

    try {
      if (pacienteEmEdicao) {
        await editarPaciente(pacienteEmEdicao.id, dados);
      } else {
        await criarPaciente(dados);
      }
      setModalAberto(false);
    } catch (err) {
      setFormErro(err instanceof Error ? err.message : 'Erro ao salvar paciente.');
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    if (!pacienteParaExcluir) return;
    setSalvando(true);
    setFormErro('');
    try {
      await excluirPaciente(pacienteParaExcluir.id);
      setPacienteParaExcluir(null);
    } catch (err) {
      setFormErro(err instanceof Error ? err.message : 'Erro ao excluir paciente.');
    } finally {
      setSalvando(false);
    }
  }

  const filtrados = pacientes.filter((p) => {
    const texto = `${p.nome} ${p.email ?? ''} ${p.telefone ?? ''} ${p.cpf ?? ''}`.toLowerCase();
    return texto.includes(busca.toLowerCase());
  });

  if (loading) {
    return <p className="text-slate-600">Carregando pacientes...</p>;
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Pacientes</h1>
          <p className="mt-1 text-slate-600">
            Gerenciamento completo: cadastre, edite e acompanhe os pacientes.
          </p>
        </div>
        <button
          type="button"
          onClick={abrirNovo}
          className="flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white shadow-sm hover:bg-teal-800 transition-colors"
        >
          <span>+</span> Incluir Paciente
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
          {error}
        </div>
      )}

      {/* Barra de Pesquisa e Métricas */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm">
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar paciente por nome, email, telefone ou CPF..."
          className="w-full max-w-md rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
        />
        <div className="text-sm text-slate-500">
          Total: <strong className="text-slate-800">{filtrados.length}</strong> paciente(s)
        </div>
      </div>

      {/* Tabela de Listagem */}
      <div className="mt-5 overflow-hidden rounded-xl bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 border-b">
              <tr>
                <th className="p-3">ID</th>
                <th className="p-3">Nome</th>
                <th className="p-3">Email</th>
                <th className="p-3">Telefone</th>
                <th className="p-3">CPF</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((paciente) => (
                <tr key={paciente.id} className="border-t hover:bg-slate-50/70">
                  <td className="p-3 font-semibold text-slate-700">#{paciente.id}</td>
                  <td className="p-3 font-medium text-slate-900">{paciente.nome}</td>
                  <td className="p-3 text-slate-600">{paciente.email ?? '—'}</td>
                  <td className="p-3 text-slate-600">{paciente.telefone ?? '—'}</td>
                  <td className="p-3 text-slate-600">{paciente.cpf ?? '—'}</td>
                  <td className="p-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => abrirEditar(paciente)}
                        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-50"
                      >
                        Alterar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormErro('');
                          setPacienteParaExcluir(paciente);
                        }}
                        className="rounded-md border border-rose-200 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!filtrados.length && (
          <div className="p-8 text-center text-slate-500">
            Nenhum paciente encontrado.
          </div>
        )}
      </div>

      {/* Modal de Formulário (Incluir / Alterar) */}
      <Modal
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
        titulo={pacienteEmEdicao ? `Alterar Paciente #${pacienteEmEdicao.id}` : 'Incluir Paciente'}
      >
        <form onSubmit={submeterForm} className="space-y-4">
          {formErro && (
            <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{formErro}</p>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Nome Completo *
            </label>
            <input
              required
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Maria da Silva"
              className="mt-1 block w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ex.: maria@email.com"
              className="mt-1 block w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Telefone
              </label>
              <input
                type="text"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(00) 00000-0000"
                className="mt-1 block w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                CPF
              </label>
              <input
                type="text"
                value={cpf}
                onChange={(e) => setCpf(e.target.value)}
                placeholder="000.000.000-00"
                className="mt-1 block w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2 border-t pt-4">
            <button
              type="button"
              onClick={() => setModalAberto(false)}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={salvando}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50"
            >
              {salvando ? 'Salvando...' : pacienteEmEdicao ? 'Salvar Alterações' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        aberto={pacienteParaExcluir !== null}
        aoFechar={() => setPacienteParaExcluir(null)}
        titulo="Confirmar Exclusão"
      >
        <div className="space-y-4">
          {formErro && (
            <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{formErro}</p>
          )}
          <p className="text-sm text-slate-600">
            Tem certeza que deseja excluir o paciente{' '}
            <strong className="text-slate-900">{pacienteParaExcluir?.nome}</strong> (ID #{pacienteParaExcluir?.id})?
          </p>
          <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            Atenção: Pacientes com consultas ativas agendadas não podem ser excluídos.
          </p>
          <div className="flex justify-end gap-2 border-t pt-4">
            <button
              type="button"
              onClick={() => setPacienteParaExcluir(null)}
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
