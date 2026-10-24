export class Paciente {
  constructor(
    public readonly id: number,
    public nome: string,
    public email?: string,
    public telefone?: string,
    public cpf?: string,
  ) {}
}
