export class Medico {
  constructor(
    public readonly id: number,
    public nome: string,
    public especialidade: string,
    public crm?: string,
    public telefone?: string,
  ) {}
}
