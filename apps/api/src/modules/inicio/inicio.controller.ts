import { Controller, Get, Query } from "@nestjs/common";
import { Perfil, type InicioResumen } from "@nexshift/contracts";
import { InicioService } from "./inicio.service";

@Controller("inicio")
export class InicioController {
  constructor(private readonly inicio: InicioService) {}

  /** GET /api/inicio?perfil=jefatura */
  @Get()
  resumen(@Query("perfil") perfilRaw?: string): InicioResumen {
    const perfil: Perfil = Perfil.catch("jefatura").parse(perfilRaw);
    return this.inicio.resumen(perfil);
  }
}
