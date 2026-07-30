import { Module } from "@nestjs/common";
import { InicioModule } from "./modules/inicio/inicio.module";

/**
 * Monolito modular (doc 07 §7.1). Cada módulo de dominio (Personal,
 * Habilitación, Programación, Ausencias, Brechas, Coberturas, Desarrollo,
 * Analítica, Administración, Notificaciones) se registra aquí a medida que se
 * construye. En esta fase inicial exponemos el módulo de Inicio.
 */
@Module({
  imports: [InicioModule],
})
export class AppModule {}
