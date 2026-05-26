export class UpdateMarginCommand {
  constructor(
    public readonly data: {
      prendaId: string;
      costeProduccion: number;
      precioVenta: number;
    },
  ) {}
}
