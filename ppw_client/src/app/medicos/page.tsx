'use client';

import { FormEvent, useState } from 'react';
import { useConsultas } from '@/components/consultas/consulta-provider';
import { Modal } from '@/components/ui/modal';
import { DadosMedico, Medico } from '@/types/consulta';

export default function PaginaMedicos() {
  const { medicos, loading, error, criarMedico, editarMedico, excluirMedico } =
    useConsultas();

  const [busca, setBusca] = useState('');
  const [filtroEspecialidade, setFiltroEspecialidade] = useState('');
  const [modalAberto, setModalAberto] = useState(false);
  const [medicoEmEdicao, setMedicoEmEdicao] = useState<Medico | null>(null);
  const [medicoParaExcluir, setMedicoParaExcluir] = useState<Medico | null>(null);

  // Form states
  const [nome, setNome] = useState('');
  const [especialidade, setEspecialidade] = useState('');
  const [crm, setCrm] = useState('');
  const [telefone, setTelefone] = useState('');
  const [formErro, setFormErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  function abrirNovo() {
    setMedicoEmEdicao(null);
    setNome('');
    setEspecialidade('');
    setCrm('');
    setTelefone('');
    setFormErro('');
    setModalAberto(true);
  }

  function abrirEditar(medico: Medico) {
    setMedicoEmEdicao(medico);
    setNome(medico.nome);
    setEspecialidade(medico.especialidade);
    setCrm(medico.crm ?? '');
    setTelefone(medico.telefone ?? '');
    setFormErro('');
    setModalAberto(true);
  }

  async function submeterForm(event: FormEvent) {
    event.preventDefault();
    setFormErro('');
    setSalvando(true);

    const dados: DadosMedico = {
      nome: nome.trim(),
      especialidade: especialidade.trim(),
      crm: crm.trim() || undefined,
      telefone: telefone.trim() || undefined,
    };

    try {
      if (medicoEmEdicao) {
        await editarMedico(medicoEmEdicao.id, dados);
      } else {
        await criarMedico(dados);
      }
      setModalAberto(false);
    } catch (err) {
      setFormErro(err instanceof Error ? err.message : 'Erro ao salvar médico.');
    } finally {
      setSalvando(false);
    }
  }

  async function confirmarExclusao() {
    if (!medicoParaExcluir) return;
    setSalvando(true);
    setFormErro('');
    try {
      await excluirMedico(medicoParaExcluir.id);
      setMedicoParaExcluir(null);
    } catch (err) {
      setFormErro(err instanceof Error ? err.message : 'Erro ao excluir médico.');
    } finally {
      setSalvando(false);
    }
  }

  const especialidadesUnicas = Array.from(
    new Set(medicos.map((m) => m.especialidade).filter(Boolean)),
  );

  const filtrados = medicos.filter((m) => {
    const atendeBusca = `${m.nome} ${m.especialidade} ${m.crm ?? ''} ${m.telefone ?? ''}`
      .toLowerCase()
      .includes(busca.toLowerCase());
    const atendeEspecialidade =
      !filtroEspecialidade || m.especialidade === filtroEspecialidade;
    return atendeBusca && atendeEspecialidade;
  });

  if (loading) {
    return <p className="text-slate-600">Carregando médicos...</p>;
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Médicos</h1>
          <p className="mt-1 text-slate-600">
            Gerenciamento do corpo clínico: cadastre, edite e organize os profissionais.
          </p>
        </div>
        <button
          type="button"
          onClick={abrirNovo}
          className="flex items-center gap-2 rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white shadow-sm hover:bg-teal-800 transition-colors"
        >
          <span>+</span> Incluir Médico
        </button>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
          {error}
        </div>
      )}

      {/* Filtros e Busca */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-xl bg-white p-4 shadow-sm">
        <div className="flex flex-1 flex-wrap gap-3">
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome, especialidade ou CRM..."
            className="w-full max-w-sm rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
          />
          <select
            value={filtroEspecialidade}
            onChange={(e) => setFiltroEspecialidade(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-teal-500 focus:outline-none"
          >
            <option value="">Todas as especialidades</option>
            {especialidadesUnicas.map((esp) => (
              <option key={esp} value={esp}>
                {esp}
              </option>
            ))}
          </select>
        </div>
        <div className="text-sm text-slate-500">
          Total: <strong className="text-slate-800">{filtrados.length}</strong> médico(s)
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
                <th className="p-3">Especialidade</th>
                <th className="p-3">CRM</th>
                <th className="p-3">Telefone</th>
                <th className="p-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((medico) => (
                <tr key={medico.id} className="border-t hover:bg-slate-50/70">
                  <td className="p-3 font-semibold text-slate-700">#{medico.id}</td>
                  <td className="p-3 font-medium text-slate-900">{medico.nome}</td>
                  <td className="p-3">
                    <span className="inline-block rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-800 border border-teal-200">
                      {medico.especialidade}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600">{medico.crm ?? '—'}</td>
                  <td className="p-3 text-slate-600">{medico.telefone ?? '—'}</td>
                  <td className="p-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => abrirEditar(medico)}
                        className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-teal-700 hover:bg-teal-50"
                      >
                        Alterar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormErro('');
                          setMedicoParaExcluir(medico);
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
            Nenhum médico encontrado.
          </div>
        )}
      </div>

      {/* Modal de Formulário (Incluir / Alterar) */}
      <Modal
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
        titulo={medicoEmEdicao ? `Alterar Médico #${medicoEmEdicao.id}` : 'Incluir Médico'}
      >
        <form onSubmit={submeterForm} className="space-y-4">
          {formErro && (
            <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{formErro}</p>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Nome do Médico *
            </label>
            <input
              required
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Dr. Roberto Ramos"
              className="mt-1 block w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-teal-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">
              Especialidade *
            </label>
            <input
              required
              type="text"
              list="especialidades-sugestoes"
              value={especialidade}
              onChange={(e) => setEspecialidade(e.target.value)}
              placeholder="Ex.: Cardiologia, Pediatria, Dermatologia"
              className="mt-1 block w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-teal-500 focus:outline-none"
            />
            <datalist id="especialidades-sugestoes">
              <option value="Clínica Geral" />
              <option value="Cardiologia" />
              <option value="Dermatologia" />
              <option value="Pediatria" />
              <option value="Ortopedia" />
              <option value="Neurologia" />
              <option value="Ginecologia" />
              <option value="Oftalmologia" />
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                CRM
              </label>
              <input
                type="text"
                value={crm}
                onChange={(e) => setCrm(e.target.value)}
                placeholder="CRM/SP 000000"
                className="mt-1 block w-full rounded-lg border border-slate-300 p-2.5 text-sm focus:border-teal-500 focus:outline-none"
              />
            </div>
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
              {salvando ? 'Salvando...' : medicoEmEdicao ? 'Salvar Alterações' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        aberto={medicoParaExcluir !== null}
        aoFechar={() => setMedicoParaExcluir(null)}
        titulo="Confirmar Exclusão"
      >
        <div className="space-y-4">
          {formErro && (
            <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{formErro}</p>
          )}
          <p className="text-sm text-slate-600">
            Tem certeza que deseja excluir o médico{' '}
            <strong className="text-slate-900">{medicoParaExcluir?.nome}</strong> (ID #{medicoParaExcluir?.id})?
          </p>
          <p className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
            Atenção: Médicos com consultas ativas agendadas não podem ser excluídos.
          </p>
          <div className="flex justify-end gap-2 border-t pt-4">
            <button
              type="button"
              onClick={() => setMedicoParaExcluir(null)}
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
