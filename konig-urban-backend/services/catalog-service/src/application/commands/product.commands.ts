export class CreateProductCommand {
  constructor(
    public readonly data: {
      nombre: string;
      descripcion?: string;
      precio: number;
      gramajeAlgodon?: number;
      material?: string;
      imagenUrl?: string;
      coleccionId: string;
      categoriaId: string;
      activo?: boolean;
    }
  ) {}
}

export class UpdateProductCommand {
  constructor(
    public readonly productId: string,
    public readonly data: Partial<CreateProductCommand['data']>
  ) {}
}
